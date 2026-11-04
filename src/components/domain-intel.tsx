import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useVault } from "@/components/vault";
import { checkSiteStatus, fetchAllStatusesFn } from "@/lib/casino.functions";
import { BUILT_IN_DOMAINS } from "@/lib/built-in-domains";
import { isPublicDomain, normalizeDomain } from "@/lib/domain";
import { domainsFromText, INTEL_KEY } from "@/lib/intel-domains";
import { visibleSites } from "@/lib/working-sites";

const KEY = INTEL_KEY;
const DIRECT_LIMIT = 40;

type CheckStatus = "checking" | "live" | "slow" | "redirect" | "dead" | "unknown";

type Check = { status: CheckStatus; ms: number; at: number };

const LABEL: Record<CheckStatus, string> = {
  checking: "Checking",
  live: "Up",
  slow: "Slow",
  redirect: "Redirect",
  dead: "Down",
  unknown: "Unknown",
};

function readSaved(): { domains: string[]; checks: Record<string, Check> } {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { domains: [], checks: {} };
    const parsed = JSON.parse(raw) as { domains?: unknown; checks?: unknown };
    const domains = Array.isArray(parsed.domains)
      ? parsed.domains.map((item) => normalizeDomain(String(item))).filter(isPublicDomain)
      : [];
    const checks: Record<string, Check> = {};
    if (parsed.checks && typeof parsed.checks === "object") {
      for (const [domain, value] of Object.entries(parsed.checks as Record<string, Check>)) {
        if (!value || value.status === "checking") continue;
        checks[domain] = value;
      }
    }
    return { domains: Array.from(new Set(domains)), checks };
  } catch {
    return { domains: [], checks: {} };
  }
}

export function DomainIntel() {
  const { ready: vaultReady, state, addManaged, removeManaged } = useVault();
  const statusFn = useServerFn(checkSiteStatus);
  const allStatusesFn = useServerFn(fetchAllStatusesFn);
  const [ready, setReady] = useState(false);
  const [visibleCount, setVisibleCount] = useState(80);
  const [checks, setChecks] = useState<Record<string, Check>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [entry, setEntry] = useState("");
  const [filter, setFilter] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const stopRef = useRef<AbortController | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const allRef = useRef<HTMLInputElement | null>(null);

  const domains = useMemo(
    () => visibleSites(state).map((site) => site.domain),
    [state],
  );
  const shown = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return q ? domains.filter((domain) => domain.includes(q)) : domains;
  }, [domains, filter]);

  const migrated = useRef(false);

  useEffect(() => {
    if (!vaultReady || migrated.current) return;
    migrated.current = true;
    const saved = readSaved();
    setChecks(saved.checks);
    if (saved.domains.length) {
      addManaged(saved.domains.filter((domain) => !BUILT_IN_DOMAINS.has(domain)));
      try {
        localStorage.setItem(KEY, JSON.stringify({ checks: saved.checks }));
      } catch {
        /* ignore */
      }
    }
    setReady(true);
  }, [vaultReady, addManaged]);

  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify({ checks }));
      } catch {
        /* ignore quota */
      }
    }, 400);
    return () => window.clearTimeout(id);
  }, [ready, checks]);

  useEffect(() => {
    setVisibleCount(80);
  }, [filter]);

  const allSelected = shown.length > 0 && shown.every((domain) => selected.has(domain));
  const someSelected = shown.some((domain) => selected.has(domain)) && !allSelected;

  useEffect(() => {
    if (allRef.current) allRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const counts = useMemo(() => {
    let up = 0;
    let slow = 0;
    let redirect = 0;
    let down = 0;
    for (const domain of domains) {
      const status = checks[domain]?.status;
      if (status === "live") up += 1;
      else if (status === "slow") slow += 1;
      else if (status === "redirect") redirect += 1;
      else if (status === "dead") down += 1;
    }
    return { up, slow, redirect, down };
  }, [domains, checks]);

  function submitOne() {
    const domain = normalizeDomain(entry);
    if (!isPublicDomain(domain)) {
      setError("Enter a domain like yeah96.com");
      setNote("");
      return;
    }
    const result = addManaged([domain]);
    if (result.error) {
      setError(result.error);
      setNote("");
      return;
    }
    if (!result.added) {
      setError("That domain is already in the list.");
      setNote("");
      return;
    }
    setEntry("");
    setError("");
    setNote(`Added ${domain}. It is on the main list and in the fetcher.`);
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      const found = domainsFromText(text);
      if (!found.length) {
        setError("No domains found. Use one domain per line.");
        setNote("");
        return;
      }
      const result = addManaged(found);
      if (result.error) {
        setError(result.error);
        setNote("");
        return;
      }
      setError("");
      setNote(`Imported ${result.added} new domain${result.added === 1 ? "" : "s"} from ${found.length} in the file.`);
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = "";
  }

  function toggle(domain: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(domain)) next.delete(domain);
      else next.add(domain);
      return next;
    });
  }

  function toggleShown() {
    setSelected((current) => {
      const next = new Set(current);
      if (allSelected) {
        for (const domain of shown) next.delete(domain);
      } else {
        for (const domain of shown) next.add(domain);
      }
      return next;
    });
  }

  function removeSelected() {
    if (!selected.size) return;
    const drop = [...selected];
    const message = removeManaged(drop);
    if (message) {
      setError(message);
      setNote("");
      return;
    }
    setChecks((current) => {
      const next = { ...current };
      for (const domain of drop) delete next[domain];
      return next;
    });
    setNote(`Removed ${drop.length}. Gone from the main list and the fetcher too.`);
    setError("");
    setSelected(new Set());
  }

  async function runCheck() {
    const targets = selected.size ? domains.filter((domain) => selected.has(domain)) : [...domains];
    if (!targets.length) {
      setError("Add a domain before checking.");
      return;
    }
    stopRef.current?.abort();
    const controller = new AbortController();
    stopRef.current = controller;
    setRunning(true);
    setError("");
    if (targets.length > DIRECT_LIMIT) {
      setNote(`Checking ${targets.length} domains from the live status list…`);
      setProgress({ done: 0, total: targets.length });
      try {
        const map = await allStatusesFn({ data: {} });
        if (controller.signal.aborted) return;
        const now = Date.now();
        setChecks((current) => {
          const next = { ...current };
          for (const domain of targets) next[domain] = { status: map[domain] ?? "unknown", ms: 0, at: now };
          return next;
        });
        setProgress({ done: targets.length, total: targets.length });
        setNote(`Checked ${targets.length} domains.`);
      } catch {
        if (!controller.signal.aborted) setError("The live status list did not load.");
      }
      setRunning(false);
      return;
    }
    setNote(selected.size ? `Checking ${targets.length} selected…` : `Checking ${targets.length} domains…`);
    setProgress({ done: 0, total: targets.length });
    let cursor = 0;
    let done = 0;
    const worker = async () => {
      for (;;) {
        if (controller.signal.aborted) return;
        const index = cursor;
        cursor += 1;
        if (index >= targets.length) return;
        const domain = targets[index] ?? "";
        setChecks((current) => ({ ...current, [domain]: { status: "checking", ms: 0, at: Date.now() } }));
        try {
          const result = await statusFn({ data: { domain }, signal: controller.signal });
          if (controller.signal.aborted) return;
          setChecks((current) => ({
            ...current,
            [domain]: { status: result.status, ms: result.ms, at: Date.now() },
          }));
        } catch {
          if (controller.signal.aborted) return;
          setChecks((current) => ({
            ...current,
            [domain]: { status: "dead", ms: 0, at: Date.now() },
          }));
        }
        done += 1;
        setProgress({ done, total: targets.length });
      }
    };
    await Promise.all(Array.from({ length: Math.min(4, targets.length) }, () => worker()));
    const stopped = controller.signal.aborted;
    setRunning(false);
    if (!stopped) setNote(`Checked ${targets.length} domain${targets.length === 1 ? "" : "s"}.`);
    else setNote("Stopped. Finished checks stay in the list.");
  }

  return (
    <section className="stack">
      <Link to="/" className="hint" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        <ChevronLeft size={16} /> Back to the list
      </Link>
      <div>
        <h1 className="brand grad-text" style={{ fontSize: "1.7rem" }}>
          Domain Intel
        </h1>
        <p className="hint">
          This is the same list as the main page and the fetcher. After you add or remove a domain, that exact list is what comes back when you reopen the app.
        </p>
      </div>

      <div className="intel-counts">
        <span>{domains.length} total</span>
        <span className="up">{counts.up} up</span>
        <span className="slow">{counts.slow} slow</span>
        <span className="redirect">{counts.redirect} redirect</span>
        <span className="down">{counts.down} down</span>
      </div>

      <div className="panel stack">
        <div className="check-row">
          <input
            className="text-input"
            value={entry}
            placeholder="yeah96.com or https://yeah96.com"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            onChange={(event) => setEntry(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submitOne();
            }}
          />
          <button type="button" className="btn btn-grad" onClick={submitOne}>
            Add
          </button>
        </div>
        <input
          className="text-input"
          value={filter}
          placeholder="Find a domain"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          onChange={(event) => setFilter(event.target.value)}
        />
        <div className="intel-tools">
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
            Import text file
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,text/plain"
            hidden
            onChange={(event) => onFile(event.target.files?.[0])}
          />
          <button type="button" className="btn btn-grad" disabled={running || !domains.length} onClick={() => void runCheck()}>
            {running ? <Loader2 size={16} className="spin" /> : null}
            {running ? `${progress.done}/${progress.total}` : selected.size ? `Check ${selected.size}` : "Check status"}
          </button>
          {running ? (
            <button type="button" className="btn" onClick={() => stopRef.current?.abort()}>
              Stop
            </button>
          ) : (
            <button type="button" className="btn" disabled={!selected.size} onClick={removeSelected}>
              Remove{selected.size ? ` ${selected.size}` : ""}
            </button>
          )}
        </div>
        <p className="hint">
          One domain per line in a text file. Check status tests a selection directly. Checking the whole list uses
          the live status feed.
        </p>
        {error ? <p className="error-line">{error}</p> : null}
        {note ? <p className="hint">{note}</p> : null}
      </div>

      {shown.length ? (
        <div className="stack">
          <label className="intel-select">
            <input ref={allRef} type="checkbox" checked={allSelected} onChange={toggleShown} />
            <span>{filter.trim() ? `Select ${shown.length} shown` : "Select all"}</span>
          </label>
          <div className="intel-list">
            {shown.slice(0, visibleCount).map((domain) => {
              const check = checks[domain];
              const status = check?.status ?? "unknown";
              return (
                <label key={domain} className="intel-row">
                  <input type="checkbox" checked={selected.has(domain)} onChange={() => toggle(domain)} />
                  <strong>{domain}</strong>
                  <span className={`site-meta ${status}`}>
                    <i />
                    {check ? LABEL[status] : "Not checked"}
                    {check && check.status !== "checking" && check.ms > 0 ? ` · ${check.ms} ms` : ""}
                  </span>
                </label>
              );
            })}
          </div>
          {visibleCount < shown.length ? (
            <button type="button" className="btn" onClick={() => setVisibleCount((value) => value + 80)}>
              Show {Math.min(80, shown.length - visibleCount)} more
            </button>
          ) : null}
        </div>
      ) : (
        <div className="panel">
          <p className="hint" style={{ margin: 0 }}>
            {domains.length ? "No domains match that search." : "No domains yet. Add one above, or import a .txt file."}
          </p>
        </div>
      )}
    </section>
  );
}
