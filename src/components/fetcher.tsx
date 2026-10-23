import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CATALOG } from "@/data/sites";
import { useVault, type AttentionMark, type BonusMode, type FallbackCred } from "@/components/vault";
import { SiteIcon } from "@/components/site-icon";
import { fetchCasinoBatchFn } from "@/lib/casino.functions";
import { isPublicDomain, normalizeDomain } from "@/lib/domain";
import { money, formatAdded } from "@/lib/format";
import { catalogMeta, chosenBonus, compareSites } from "@/lib/order";
import type { AccountCode, AccountErr, AccountOk, AccountRow, BonusView } from "@/lib/parse-account";

const PAGE = 12;
const BATCH = 10;
const RUN_KEY = "vault-run";

type RunCheckpoint = { at: number; done: string[]; rows: AccountRow[] };

function readRun(): RunCheckpoint | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(RUN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<RunCheckpoint>;
    if (!parsed || !Array.isArray(parsed.done) || !Array.isArray(parsed.rows)) return null;
    return { at: typeof parsed.at === "number" ? parsed.at : Date.now(), done: parsed.done, rows: parsed.rows };
  } catch {
    return null;
  }
}

function writeRun(checkpoint: RunCheckpoint) {
  try {
    localStorage.setItem(RUN_KEY, JSON.stringify(checkpoint));
  } catch {
    /* ignore quota */
  }
}

function chunkDomains(domains: string[]): string[][] {
  const batches: string[][] = [];
  for (let i = 0; i < domains.length; i += BATCH) batches.push(domains.slice(i, i + BATCH));
  return batches;
}

function loginKey(login: FallbackCred): string {
  return `${login.phone}\0${login.password}`;
}

function usableLogin(login: FallbackCred | null | undefined): FallbackCred | null {
  if (!login) return null;
  const phone = login.phone.replace(/\s+/g, "");
  if (!/^[0-9+]{6,20}$/.test(phone) || login.password.length < 4 || login.password.length > 64) return null;
  return { phone, password: login.password };
}

function planBatches(domains: string[], form: FallbackCred[], saved: Record<string, FallbackCred>) {
  const groups = new Map<string, { first: FallbackCred; domains: string[] }>();
  const fresh: string[] = [];
  for (const domain of domains) {
    const known = usableLogin(saved[domain]);
    if (!known) {
      fresh.push(domain);
      continue;
    }
    const key = loginKey(known);
    const group = groups.get(key);
    if (group) group.domains.push(domain);
    else groups.set(key, { first: known, domains: [domain] });
  }
  const batches: { domains: string[]; creds: FallbackCred[] }[] = [];
  for (const group of groups.values()) {
    const rest = form.filter((cred) => loginKey(cred) !== loginKey(group.first));
    for (const slice of chunkDomains(group.domains)) {
      batches.push({ domains: slice, creds: [group.first, ...rest] });
    }
  }
  if (fresh.length && form.length) {
    for (const slice of chunkDomains(fresh)) batches.push({ domains: slice, creds: form });
  }
  return { batches, unseen: form.length ? 0 : fresh.length };
}

const TONES = ["tone-0", "tone-1", "tone-2", "tone-3", "tone-4"] as const;

type MoneyBox = { label: string; amount: number; kind: "wallet" | "promo" };

type ChangeNote = {
  id: string;
  domain: string;
  label: string;
  from: number | null;
  to: number | null;
};

function cents(amount: number): number {
  return Math.round(amount * 100) / 100;
}

function boxesOf(row: AccountOk): MoneyBox[] {
  const wallets = row.wallets.filter((wallet) => wallet.balance > 0.001);
  const walletBoxes: MoneyBox[] = wallets.length
    ? wallets.map((wallet) => ({ label: wallet.name, amount: wallet.balance, kind: "wallet" }))
    : row.cash > 0.001
      ? [{ label: row.cashWalletName, amount: row.cash, kind: "wallet" }]
      : [];
  const promos: MoneyBox[] = (row.promoBoxes ?? [])
    .filter((box) => box.amount > 0.001)
    .map((box) => ({ label: box.label, amount: box.amount, kind: "promo" }));
  return [...walletBoxes, ...promos];
}

function totalsOf(row: AccountOk): { wallets: number; claimable: number; total: number } {
  let wallets = 0;
  let claimable = 0;
  for (const box of boxesOf(row)) {
    if (box.kind === "wallet") wallets += box.amount;
    else claimable += box.amount;
  }
  wallets = cents(wallets);
  claimable = cents(claimable);
  return { wallets, claimable, total: cents(wallets + claimable) };
}

function boxMap(row: AccountOk): Map<string, MoneyBox> {
  const map = new Map<string, MoneyBox>();
  for (const box of boxesOf(row)) {
    const key = `${box.kind}\0${box.label}`;
    const current = map.get(key);
    if (current) current.amount = cents(current.amount + box.amount);
    else map.set(key, { ...box, amount: cents(box.amount) });
  }
  return map;
}

function changesFor(before: AccountOk | undefined, after: AccountOk): ChangeNote[] {
  if (!before?.ok) {
    const total = totalsOf(after).total;
    if (total <= 0) return [];
    return [{ id: `${after.domain}:new`, domain: after.domain, label: "Now showing", from: null, to: total }];
  }
  const prev = boxMap(before);
  const next = boxMap(after);
  const notes: ChangeNote[] = [];
  const keys = new Set([...prev.keys(), ...next.keys()]);
  for (const key of keys) {
    const oldBox = prev.get(key);
    const newBox = next.get(key);
    const from = oldBox?.amount ?? null;
    const to = newBox?.amount ?? null;
    if (from != null && to != null && Math.abs(from - to) < 0.01) continue;
    if (from == null && to == null) continue;
    const label = newBox?.label ?? oldBox?.label ?? "Balance";
    notes.push({ id: `${after.domain}:${key}`, domain: after.domain, label, from, to });
  }
  notes.sort((a, b) => Math.abs((b.to ?? 0) - (b.from ?? 0)) - Math.abs((a.to ?? 0) - (a.from ?? 0)));
  return notes;
}

function deltaText(note: ChangeNote): string {
  if (note.from == null && note.to != null) {
    return note.label === "Now showing" ? money(note.to) : `New ${money(note.to)}`;
  }
  if (note.to == null) return `${money(note.from)} → ${money(0)}`;
  return `${money(note.from)} → ${money(note.to)}`;
}

function deltaClass(note: ChangeNote): string {
  const from = note.from ?? 0;
  const to = note.to ?? 0;
  if (to > from + 0.009) return "delta up";
  if (to < from - 0.009) return "delta down";
  return "delta";
}

function ResultCard({ row, bonus }: { row: AccountOk; bonus: BonusView | null }) {
  const boxes = boxesOf(row);
  const total = totalsOf(row).total;
  return (
    <article className="result-card">
      <div className="result-head">
        <span className="result-title">
          <SiteIcon domain={row.domain} />
          <strong>{row.domain}</strong>
        </span>
        <span className="result-side">
          {total > 0 ? <b>{money(total)}</b> : null}
          <a href={`https://${row.domain}/`} target="_blank" rel="noreferrer">
            Open
          </a>
        </span>
      </div>
      {bonus ? (
        <p className="hint">
          {bonus.name} {bonus.amountDisplay}
        </p>
      ) : null}
      {boxes.length ? (
        <div className="promo-stack">
          {boxes.map((box, index) => (
            <div className={`promo-box ${TONES[index % TONES.length]}`} key={`${box.kind}-${box.label}-${index}`}>
              <span>{box.label}</span>
              <b>{money(box.amount)}</b>
            </div>
          ))}
        </div>
      ) : (
        <p className="hint">No balance or claimable promo.</p>
      )}
    </article>
  );
}

function PageList({ rows, bonusMode }: { rows: AccountOk[]; bonusMode: BonusMode }) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const safe = Math.min(page, pages - 1);
  const slice = rows.slice(safe * PAGE, safe * PAGE + PAGE);
  return (
    <>
      {pages > 1 ? (
        <div className="pager">
          <button type="button" className="btn" disabled={safe === 0} onClick={() => setPage(safe - 1)}>
            Previous
          </button>
          <span>
            Page {safe + 1} / {pages}
          </span>
          <button
            type="button"
            className="btn"
            disabled={safe >= pages - 1}
            onClick={() => setPage(safe + 1)}
          >
            Next
          </button>
        </div>
      ) : null}
      <div className="stack">
        {slice.map((row) => (
          <ResultCard
            key={row.domain}
            row={row}
            bonus={bonusMode === "none" ? null : chosenBonus(row, bonusMode)}
          />
        ))}
      </div>
    </>
  );
}

const CODE_ORDER: AccountCode[] = [
  "captcha",
  "invalid_login",
  "timeout",
  "unreachable",
  "unsupported",
  "other",
];

function isMarked(marks: AttentionMark[], domain: string, code: string): boolean {
  return marks.some((mark) => mark.domain === domain && mark.code === code);
}

function NeedsAttention({
  savedAt,
  rows,
  marks,
  onToggle,
}: {
  savedAt: number | null;
  rows: AccountErr[];
  marks: AttentionMark[];
  onToggle: (domain: string, code: string) => void;
}) {
  const [showChecked, setShowChecked] = useState(false);
  const stamp = savedAt ? formatAdded(new Date(savedAt).toISOString()) : "";
  const counts = CODE_ORDER.map((code) => ({
    code,
    count: rows.filter((row) => row.code === code).length,
  })).filter((item) => item.count > 0);
  const hidden = rows.filter((row) => isMarked(marks, row.domain, row.code)).length;
  const visible = showChecked ? rows : rows.filter((row) => !isMarked(marks, row.domain, row.code));
  const groups = counts
    .map((item) => ({
      ...item,
      rows: visible.filter((row) => row.code === item.code),
    }))
    .filter((group) => group.rows.length > 0);

  return (
    <section className="panel attention">
      <h2 className="section-label">Needs attention · {rows.length}</h2>
      <p className="hint">Rejected sites are saved with the fetch. A checked row stays hidden until that site comes back with a different code.</p>
      {counts.length ? (
        <p className="attention-counts">
          {counts.map((item) => (
            <span key={item.code}>
              {item.code} <b>{item.count}</b>
            </span>
          ))}
        </p>
      ) : (
        <p className="hint">No rejected sites saved yet.</p>
      )}
      {hidden > 0 ? (
        <button type="button" className="btn" onClick={() => setShowChecked((value) => !value)}>
          {showChecked ? "Hide checked" : `Show checked (${hidden})`}
        </button>
      ) : null}
      {groups.map((group) => (
        <div className="attention-group" key={group.code}>
          <h3>
            {group.code} · {group.rows.length}
          </h3>
          <div className="attention-table">
            {group.rows.map((row) => {
              const checked = isMarked(marks, row.domain, row.code);
              return (
                <div className="attention-row" key={`${row.domain}-${row.code}`}>
                  <label className="attention-check">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(row.domain, row.code)}
                    />
                    <span className="sr">Checked</span>
                  </label>
                  <strong className="attention-domain">{row.domain}</strong>
                  <span className="attention-code">{row.code}</span>
                  <span className="attention-message">{row.message}</span>
                  <time dateTime={savedAt ? new Date(savedAt).toISOString() : undefined}>{stamp}</time>
                  <a href={`https://${row.domain}/`} target="_blank" rel="noreferrer">
                    Open
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

export function Fetcher() {
  const { state, patch, rememberAccount, rememberLogins, saveFetch } = useVault();
  const fetchBatch = useServerFn(fetchCasinoBatchFn);
  const [showPassword, setShowPassword] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [single, setSingle] = useState("");
  const [status, setStatus] = useState("Enter the phone number and password you use on these sites.");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [rows, setRows] = useState<AccountRow[]>(state.lastFetch?.rows ?? []);
  const [showErrors, setShowErrors] = useState(false);
  const [confirmScan, setConfirmScan] = useState(false);
  const [diffs, setDiffs] = useState<ChangeNote[]>([]);
  const [comparedAt, setComparedAt] = useState<number | null>(null);
  const [pendingRun, setPendingRun] = useState<RunCheckpoint | null>(null);
  const stopRef = useRef<AbortController | null>(null);
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  useEffect(() => {
    const saved = readRun();
    if (saved && saved.done.length < CATALOG.length) setPendingRun(saved);
  }, []);

  const creds = useMemo(() => {
    const list = [usableLogin({ phone: state.phone, password: state.password })];
    for (const item of state.fallbacks) list.push(usableLogin(item));
    const seen = new Set<string>();
    const out: FallbackCred[] = [];
    for (const item of list) {
      if (!item || seen.has(loginKey(item))) continue;
      seen.add(loginKey(item));
      out.push(item);
    }
    return out;
  }, [state.phone, state.password, state.fallbacks]);

  const valid = rows.filter((row): row is AccountOk => row.ok && row.hasData);
  const empty = rows.filter((row): row is AccountOk => row.ok && !row.hasData);
  const errors = rows.filter((row) => !row.ok);
  const orderOf = (a: AccountOk, b: AccountOk) =>
    compareSites(catalogMeta(a.domain), catalogMeta(b.domain), a, b, state.sort, state.bonusMode);
  const ranked = [...valid].sort(orderOf);
  const quiet = [...empty].sort(orderOf);
  const walletTotal = cents(ranked.reduce((sum, row) => sum + totalsOf(row).wallets, 0));
  const claimableTotal = cents(ranked.reduce((sum, row) => sum + totalsOf(row).claimable, 0));
  const waiting = cents(walletTotal + claimableTotal);

  function setFallback(index: number, partial: Partial<FallbackCred>) {
    const fallbacks = state.fallbacks.map((item, i) => (i === index ? { ...item, ...partial } : item));
    patch({ fallbacks });
  }

  async function run(domains: string[], resumeFrom?: RunCheckpoint) {
    const unique = Array.from(new Set(domains));
    if (!unique.length) {
      setStatus("No sites to check. Save accounts from the list, add a domain, or scan.");
      return;
    }
    const { batches, unseen } = planBatches(unique, creds, state.logins);
    if (!batches.length) {
      setStatus("Enter your phone number and password before fetching.");
      return;
    }
    const previousAt = state.lastFetch?.at ?? null;
    const previous = new Map((state.lastFetch?.rows ?? []).filter((row) => row.ok).map((row) => [row.domain, row]));
    stopRef.current?.abort();
    const controller = new AbortController();
    stopRef.current = controller;
    const collected: AccountRow[] = resumeFrom ? [...resumeFrom.rows] : [];
    const done = resumeFrom ? [...resumeFrom.done] : [];
    const total = resumeFrom ? CATALOG.length : unique.length - unseen;
    setRunning(true);
    setShowErrors(false);
    setDiffs([]);
    setComparedAt(null);
    setRows(collected);
    setProgress({ done: done.length, total });
    setStatus(
      resumeFrom
        ? `Resuming ${done.length} of ${CATALOG.length}…`
        : unique.length === 1
          ? `Checking ${unique[0]}…`
          : unseen
            ? `Checking ${total} sites that already have a saved login…`
            : `Checking ${unique.length} sites…`,
    );

    const publish = (batchRows: AccountRow[], loginNotes: { domain: string; login: FallbackCred | null }[]) => {
      rememberLogins(loginNotes);
      for (const row of batchRows) {
        if (row.ok) rememberAccount(row.domain);
        const index = collected.findIndex((item) => item.domain === row.domain);
        if (index >= 0) collected[index] = row;
        else collected.push(row);
        if (!done.includes(row.domain)) done.push(row.domain);
      }
      const snapshot = [...collected].sort((a, b) => a.domain.localeCompare(b.domain));
      setRows(snapshot);
      setProgress({ done: done.length, total });
      const checkpoint = { at: Date.now(), done: [...done], rows: snapshot };
      writeRun(checkpoint);
      setPendingRun(done.length < CATALOG.length ? checkpoint : null);
    };

    let cursor = 0;
    const worker = async () => {
      for (;;) {
        if (controller.signal.aborted) return;
        const index = cursor;
        cursor += 1;
        if (index >= batches.length) return;
        const batch = batches[index];
        if (!batch) return;
        let pending = batch.domains;
        const settled = new Map<string, AccountRow>();
        const loginNotes: { domain: string; login: FallbackCred | null }[] = [];
        try {
          for (const cred of batch.creds) {
            if (controller.signal.aborted || !pending.length) break;
            const result = await fetchBatch({
              data: { domains: pending, phone: cred.phone, password: cred.password },
              signal: controller.signal,
            });
            const retry: string[] = [];
            const returned = new Set(result.map((row) => row.domain));
            for (const row of result) {
              if (row.ok) {
                settled.set(row.domain, row);
                loginNotes.push({ domain: row.domain, login: cred });
              } else if (row.code !== "invalid_login") {
                settled.set(row.domain, row);
              } else {
                retry.push(row.domain);
              }
            }
            for (const domain of pending) {
              if (!returned.has(domain) && !settled.has(domain)) retry.push(domain);
            }
            pending = retry;
          }
        } catch (error) {
          if (controller.signal.aborted || (error instanceof DOMException && error.name === "AbortError")) return;
          for (const domain of pending) {
            if (!settled.has(domain)) settled.set(domain, { domain, ok: false, code: "other", message: "Check failed" });
          }
          pending = [];
        }
        if (controller.signal.aborted) return;
        for (const domain of pending) {
          settled.set(domain, { domain, ok: false, code: "invalid_login", message: "Not your account" });
          loginNotes.push({ domain, login: null });
        }
        publish(
          batch.domains.map((domain) => settled.get(domain) ?? { domain, ok: false, code: "other", message: "Check failed" }),
          loginNotes,
        );
      }
    };
    await Promise.all(Array.from({ length: Math.min(4, batches.length) }, () => worker()));
    const stopped = controller.signal.aborted;
    const finalRows = [...collected].sort((a, b) => a.domain.localeCompare(b.domain));
    setRows(finalRows);
    saveFetch(finalRows);
    if (!stopped && done.length >= CATALOG.length) {
      try {
        localStorage.removeItem(RUN_KEY);
      } catch {
        /* ignore */
      }
      setPendingRun(null);
    }
    const notes: ChangeNote[] = [];
    for (const row of finalRows) {
      if (!row.ok) continue;
      notes.push(...changesFor(previous.get(row.domain), row));
    }
    notes.sort(
      (a, b) =>
        Math.abs((b.to ?? 0) - (b.from ?? 0)) - Math.abs((a.to ?? 0) - (a.from ?? 0)) ||
        a.domain.localeCompare(b.domain),
    );
    setDiffs(notes);
    setComparedAt(previousAt);
    const signedIn = finalRows.filter((row) => row.ok).length;
    setStatus(
      stopped
        ? "Stopped. Successful sign-ins stay in My accounts."
        : `Done. ${signedIn} of ${finalRows.length} signed in. Only those are kept as your accounts.`,
    );
    setRunning(false);
  }

  const mineTargets = state.mine.length
    ? state.mine
    : CATALOG.filter((site) => state.visited.includes(site.domain)).map((site) => site.domain);

  return (
    <section className="stack">
      <Link to="/" className="hint" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        <ChevronLeft size={16} /> Back to the list
      </Link>
      <div>
        <h1 className="brand grad-text" style={{ fontSize: "1.7rem" }}>
          Fetch bonus data
        </h1>
        <p className="hint">
          Each site is signed in with the phone and password that worked there last time. New sites try the
          login below, then any fallbacks. A hit is remembered on this device and used first next time.
        </p>
        {Object.keys(state.logins).length ? (
          <p className="hint">{Object.keys(state.logins).length} sites have a saved login.</p>
        ) : null}
      </div>

      <div className="panel stack">
        <label className="field">
          <span>Phone number</span>
          <input
            className="text-input"
            inputMode="tel"
            autoComplete="username"
            value={state.phone}
            placeholder="04…"
            onChange={(event) => patch({ phone: event.target.value })}
          />
        </label>
        <label className="field">
          <span>Password</span>
          <div className="pass-row">
            <input
              className="text-input"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={state.password}
              onChange={(event) => patch({ password: event.target.value })}
            />
            <button
              type="button"
              className="btn"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>
        <button type="button" className="btn btn-ghost" onClick={() => setAdvanced((value) => !value)}>
          {advanced ? "Hide fallback logins" : "Fallback logins"}
        </button>
        {advanced
          ? state.fallbacks.map((item, index) => (
              <div className="stack" key={index}>
                <label className="field">
                  <span>Fallback {index + 2} phone</span>
                  <input
                    className="text-input"
                    value={item.phone}
                    inputMode="tel"
                    onChange={(event) => setFallback(index, { phone: event.target.value })}
                  />
                </label>
                <label className="field">
                  <span>Fallback {index + 2} password</span>
                  <input
                    className="text-input"
                    type="password"
                    value={item.password}
                    onChange={(event) => setFallback(index, { password: event.target.value })}
                  />
                </label>
              </div>
            ))
          : null}
        <p className="hint">
          Saved only in this browser. The server uses them to sign in and does not keep them.
        </p>
        <div className="actions">
          <button
            type="button"
            className="btn btn-grad"
            disabled={running}
            onClick={() => void run(mineTargets)}
          >
            {running ? <Loader2 size={16} /> : null} Fetch my accounts
            {mineTargets.length ? ` (${mineTargets.length})` : ""}
          </button>
          <button type="button" className="btn" disabled={!running} onClick={() => stopRef.current?.abort()}>
            Stop
          </button>
          <button
            type="button"
            className="btn"
            disabled={running || !state.lastFetch}
            onClick={() => {
              setRows(state.lastFetch?.rows ?? []);
              setDiffs([]);
              setComparedAt(null);
              setStatus("Showing the last fetch saved on this device.");
            }}
          >
            View last fetch
          </button>
        </div>
        <div className="check-row">
          <input
            className="text-input"
            value={single}
            placeholder="Check one site, e.g. 9au.com"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            onChange={(event) => setSingle(event.target.value)}
          />
          <button
            type="button"
            className="btn"
            disabled={running}
            onClick={() => {
              const domain = normalizeDomain(single);
              if (!isPublicDomain(domain)) {
                setStatus("Enter a domain like 9au.com");
                return;
              }
              void run([domain]);
            }}
          >
            Check
          </button>
        </div>
        <button type="button" className="btn btn-ghost" disabled={running} onClick={() => setConfirmScan(true)}>
          Scan the full list to find my accounts
        </button>
        {pendingRun && !running ? (
          <button
            type="button"
            className="btn"
            onClick={() => {
              const done = new Set(pendingRun.done);
              const remaining = CATALOG.map((site) => site.domain).filter((domain) => !done.has(domain));
              void run(remaining, pendingRun);
            }}
          >
            Resume scan ({pendingRun.done.length} of {CATALOG.length})
          </button>
        ) : null}
        <p className="progress-line">{status}</p>
        {progress.total > 0 ? (
          <div className="bar" aria-hidden="true">
            <span style={{ width: `${Math.round((progress.done / progress.total) * 100)}%` }} />
          </div>
        ) : null}
      </div>

      {comparedAt != null ? (
        <div className="panel">
          <strong>Changes since {formatAdded(new Date(comparedAt).toISOString())}</strong>
          {diffs.length ? (
            <ul className="diff">
              {diffs.map((note) => (
                <li key={note.id}>
                  <span className="diff-copy">
                    <strong>{note.domain}</strong>
                    <span>{note.label}</span>
                  </span>
                  <span className={deltaClass(note)}>{deltaText(note)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="hint">No change in wallets or claimable bonuses.</p>
          )}
        </div>
      ) : null}

      <div className="result-summary">
        <h2 className="section-label">Your accounts · {ranked.length}</h2>
        {ranked.length ? (
          <>
            <p className="waiting">
              {money(waiting)} <span>waiting</span>
            </p>
            <p className="hint waiting-split">
              Wallets {money(walletTotal)} + claimable {money(claimableTotal)}
            </p>
          </>
        ) : null}
        {state.lastFetch && !running ? (
          <p className="hint waiting-split">Saved {formatAdded(new Date(state.lastFetch.at).toISOString())}</p>
        ) : null}
        {ranked.length ? <PageList rows={ranked} bonusMode={state.bonusMode} /> : <p className="hint">Nothing with a balance or bonus yet.</p>}
      </div>
      <div>
        <h2 className="section-label">Signed in, nothing waiting · {empty.length}</h2>
        {quiet.length ? <PageList rows={quiet} bonusMode={state.bonusMode} /> : <p className="hint">None.</p>}
      </div>
      <div>
        <h2 className="section-label">Not your account or unreachable · {errors.length}</h2>
        {errors.length ? (
          <>
            <button type="button" className="btn" onClick={() => setShowErrors((value) => !value)}>
              {showErrors ? "Hide" : "Show"} rejected sites
            </button>
            {showErrors ? (
              <div className="stack" style={{ marginTop: 8 }}>
                {errors.map((row) => (
                  <div className="result-card error-row" key={row.domain}>
                    <SiteIcon domain={row.domain} />
                    <div>
                      <strong>{row.domain}</strong>
                      <p className="hint">{row.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <p className="hint">None this fetch. Rejected sites stay saved under Needs attention.</p>
        )}
      </div>

      <NeedsAttention
        savedAt={state.lastFetch?.at ?? null}
        rows={(state.lastFetch?.rows ?? []).filter((row): row is AccountErr => !row.ok)}
        marks={state.attentionChecked}
        onToggle={(domain, code) => {
          const marks = state.attentionChecked;
          const exists = marks.some((mark) => mark.domain === domain && mark.code === code);
          patch({
            attentionChecked: exists
              ? marks.filter((mark) => !(mark.domain === domain && mark.code === code))
              : [...marks, { domain, code }],
          });
        }}
      />

      {confirmScan ? (
        <div className="modal-backdrop" onClick={() => setConfirmScan(false)}>
          <div className="modal-card stack" onClick={(event) => event.stopPropagation()}>
            <h3>Scan every listed site?</h3>
            <p className="hint">
              Sites that already signed in use that saved login. The rest try the phone and password above, then
              any fallbacks. It can take several minutes. You can stop it at any time.
            </p>
            <div className="actions">
              <button type="button" className="btn" onClick={() => setConfirmScan(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-grad"
                onClick={() => {
                  setConfirmScan(false);
                  void run(CATALOG.map((site) => site.domain));
                }}
              >
                Scan my login
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
