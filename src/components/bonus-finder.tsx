import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { BonusCard } from "@/components/bonus-card";
import { useVault } from "@/components/vault";
import { loadPublicCatalogueFn } from "@/lib/casino.functions";
import { visibleSites } from "@/lib/working-sites";
import { type BonusKind, type BonusSlot, type PublicBonus } from "@/lib/public-bonus";

const CACHE_KEY = "pokies_vault_bonus_catalogue_v1";
const PAGE = 20;

type CacheRow = { bonuses: PublicBonus[]; message?: string };

type Filters = {
  slots: BonusSlot[];
  kind: "any" | BonusKind;
  amountMin: string;
  amountMax: string;
  rollMin: string;
  rollMax: string;
  maxMin: string;
  maxMax: string;
  sort: "list" | "amount" | "rollover" | "cashout" | "az";
};

const EMPTY_FILTERS: Filters = {
  slots: [],
  kind: "any",
  amountMin: "",
  amountMax: "",
  rollMin: "",
  rollMax: "",
  maxMin: "",
  maxMax: "",
  sort: "list",
};

function readCache(): Record<string, CacheRow> {
  if (typeof localStorage === "undefined") return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}") as Record<string, CacheRow>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeCache(cache: Record<string, CacheRow>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* quota */
  }
}

function numberOrNull(value: string): number | null {
  if (!value.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function passes(bonus: PublicBonus, filters: Filters): boolean {
  if (filters.slots.length && (bonus.slot === "other" || !filters.slots.includes(bonus.slot))) return false;
  if (filters.kind !== "any" && bonus.kind !== filters.kind) return false;
  const amountMin = numberOrNull(filters.amountMin);
  const amountMax = numberOrNull(filters.amountMax);
  const rollMin = numberOrNull(filters.rollMin);
  const rollMax = numberOrNull(filters.rollMax);
  const maxMin = numberOrNull(filters.maxMin);
  const maxMax = numberOrNull(filters.maxMax);
  if (amountMin != null && bonus.amount < amountMin) return false;
  if (amountMax != null && bonus.amount > amountMax) return false;
  if (rollMin != null && (bonus.rollover == null || bonus.rollover < rollMin)) return false;
  if (rollMax != null && (bonus.rollover == null || bonus.rollover > rollMax)) return false;
  if (maxMin != null && (bonus.maxWithdraw == null || bonus.maxWithdraw < maxMin)) return false;
  if (maxMax != null && (bonus.maxWithdraw == null || bonus.maxWithdraw > maxMax)) return false;
  return true;
}

function filtersActive(filters: Filters): boolean {
  return (
    filters.slots.length > 0 ||
    filters.kind !== "any" ||
    filters.amountMin !== "" ||
    filters.amountMax !== "" ||
    filters.rollMin !== "" ||
    filters.rollMax !== "" ||
    filters.maxMin !== "" ||
    filters.maxMax !== ""
  );
}

function score(bonuses: PublicBonus[], filters: Filters): number {
  const pool = bonuses.filter((bonus) => passes(bonus, filters));
  if (filters.sort === "rollover") {
    const rolls = pool.map((bonus) => bonus.rollover).filter((value): value is number => value != null);
    return rolls.length ? Math.min(...rolls) : Number.POSITIVE_INFINITY;
  }
  if (filters.sort === "cashout") {
    const maxes = pool.map((bonus) => bonus.maxWithdraw).filter((value): value is number => value != null);
    return maxes.length ? Math.max(...maxes) : -1;
  }
  return pool.reduce((best, bonus) => Math.max(best, bonus.amount), 0);
}

export function BonusFinder() {
  const { state } = useVault();
  const loadFn = useServerFn(loadPublicCatalogueFn);
  const loadRef = useRef(loadFn);
  loadRef.current = loadFn;
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [cache, setCache] = useState<Record<string, CacheRow>>({});
  const [page, setPage] = useState(0);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [status, setStatus] = useState("Same domains as the main list. Load bonuses to fill the cards.");
  const stopRef = useRef<AbortController | null>(null);
  const ready = useRef(false);

  const domains = useMemo(() => visibleSites(state).map((site) => site.domain), [state]);

  useEffect(() => {
    const saved = readCache();
    const allowed = new Set(domains);
    const next: Record<string, CacheRow> = {};
    for (const [domain, row] of Object.entries(saved)) {
      if (allowed.has(domain)) next[domain] = row;
    }
    setCache(next);
    if (Object.keys(next).length !== Object.keys(saved).length) writeCache(next);
    ready.current = true;
  }, [domains]);

  useEffect(() => {
    if (!ready.current) return;
    writeCache(cache);
  }, [cache]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = domains.filter((domain) => !q || domain.includes(q));
    if (filtersActive(filters)) {
      list = list.filter((domain) => {
        const row = cache[domain];
        if (!row) return false;
        return row.bonuses.some((bonus) => passes(bonus, filters));
      });
    }
    if (filters.sort === "az") return [...list].sort((a, b) => a.localeCompare(b));
    if (filters.sort === "list") return list;
    const direction = filters.sort === "rollover" ? 1 : -1;
    return [...list].sort((a, b) => {
      const left = score(cache[a]?.bonuses ?? [], filters);
      const right = score(cache[b]?.bonuses ?? [], filters);
      return (left - right) * direction || a.localeCompare(b);
    });
  }, [domains, query, filters, cache]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const safePage = Math.min(page, pages - 1);
  const slice = filtered.slice(safePage * PAGE, safePage * PAGE + PAGE);

  function toggleSlot(slot: BonusSlot) {
    setPage(0);
    setFilters((current) => ({
      ...current,
      slots: current.slots.includes(slot)
        ? current.slots.filter((item) => item !== slot)
        : [...current.slots, slot],
    }));
  }

  async function load(domainsToLoad: string[]) {
    const unique = Array.from(new Set(domainsToLoad));
    if (!unique.length) {
      setStatus("No domains to load.");
      return;
    }
    stopRef.current?.abort();
    const controller = new AbortController();
    stopRef.current = controller;
    setRunning(true);
    setProgress({ done: 0, total: unique.length });
    setStatus(`Loading public bonuses for ${unique.length} domains…`);
    let done = 0;
    let cursor = 0;
    const worker = async () => {
      for (;;) {
        if (controller.signal.aborted) return;
        const index = cursor;
        cursor += 4;
        const batch = unique.slice(index, index + 4);
        if (!batch.length) return;
        try {
          const result = await loadRef.current({ data: { domains: batch }, signal: controller.signal });
          if (controller.signal.aborted) return;
          setCache((current) => {
            const next = { ...current };
            for (const row of result) {
              next[row.domain] = row.ok
                ? { bonuses: row.bonuses }
                : { bonuses: [], message: row.message };
            }
            return next;
          });
        } catch {
          if (controller.signal.aborted) return;
          setCache((current) => {
            const next = { ...current };
            for (const domain of batch) {
              if (!next[domain]) next[domain] = { bonuses: [], message: "Could not load" };
            }
            return next;
          });
        }
        done += batch.length;
        setProgress({ done: Math.min(done, unique.length), total: unique.length });
      }
    };
    await Promise.all(Array.from({ length: Math.min(2, Math.ceil(unique.length / 4)) }, () => worker()));
    setRunning(false);
    setStatus(controller.signal.aborted ? "Stopped." : "Public bonuses loaded. No password was used.");
  }

  const loadedCount = domains.filter((domain) => cache[domain]).length;

  return (
    <section className="stack">
      <div className="panel">
        <h1 className="section-label">Bonus Finder</h1>
        <p className="hint">
          The same domains as the main list. Add or remove one in Domain Intel and it changes here. Bonuses are
          the public signup, share, daily, and birthday offers. No sign-in.
        </p>
        <label className="search">
          <input
            value={query}
            placeholder="Search this list"
            aria-label="Search domains"
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
          />
        </label>
        <div className="finder-slots">
          {(
            [
              ["signup", "Signup"],
              ["share", "Share"],
              ["daily", "Daily"],
              ["birthday", "Birthday"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={filters.slots.includes(id) ? "tool active" : "tool"}
              onClick={() => toggleSlot(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="finder-grid">
          <label>
            Sort
            <select
              value={filters.sort}
              onChange={(event) => {
                setPage(0);
                setFilters((current) => ({ ...current, sort: event.target.value as Filters["sort"] }));
              }}
            >
              <option value="list">List order</option>
              <option value="az">Domain A–Z</option>
              <option value="amount">Highest amount</option>
              <option value="rollover">Lowest rollover</option>
              <option value="cashout">Highest max cashout</option>
            </select>
          </label>
          <label>
            Amount type
            <select
              value={filters.kind}
              onChange={(event) => {
                setPage(0);
                const kind = event.target.value;
                setFilters((current) => ({
                  ...current,
                  kind: kind === "fixed" || kind === "percent" || kind === "random" ? kind : "any",
                }));
              }}
            >
              <option value="any">Any</option>
              <option value="fixed">Fixed amount</option>
              <option value="percent">Percent</option>
              <option value="random">Random range</option>
            </select>
          </label>
          <label>
            Amount from
            <input
              inputMode="decimal"
              value={filters.amountMin}
              onChange={(event) => setFilters((current) => ({ ...current, amountMin: event.target.value }))}
            />
          </label>
          <label>
            Amount to
            <input
              inputMode="decimal"
              value={filters.amountMax}
              onChange={(event) => setFilters((current) => ({ ...current, amountMax: event.target.value }))}
            />
          </label>
          <label>
            Rollover from
            <input
              inputMode="decimal"
              value={filters.rollMin}
              onChange={(event) => setFilters((current) => ({ ...current, rollMin: event.target.value }))}
            />
          </label>
          <label>
            Rollover to
            <input
              inputMode="decimal"
              value={filters.rollMax}
              onChange={(event) => setFilters((current) => ({ ...current, rollMax: event.target.value }))}
            />
          </label>
          <label>
            Max cashout from
            <input
              inputMode="decimal"
              value={filters.maxMin}
              onChange={(event) => setFilters((current) => ({ ...current, maxMin: event.target.value }))}
            />
          </label>
          <label>
            Max cashout to
            <input
              inputMode="decimal"
              value={filters.maxMax}
              onChange={(event) => setFilters((current) => ({ ...current, maxMax: event.target.value }))}
            />
          </label>
        </div>
        <p className="hint">Amount is dollars for a fixed bonus and the percent number for a percent bonus.</p>
        <div className="actions">
          <button type="button" className="btn btn-grad" disabled={running || slice.length === 0} onClick={() => void load(slice)}>
            Load this page
          </button>
          <button
            type="button"
            className="btn"
            disabled={running || filtered.length === 0}
            onClick={() => void load(filtered)}
          >
            Load list
          </button>
          <button type="button" className="btn" disabled={!running} onClick={() => stopRef.current?.abort()}>
            Stop
          </button>
        </div>
        <p className="progress-line">
          {status} {domains.length} domains · {loadedCount} loaded
          {running ? ` · ${progress.done} / ${progress.total}` : ""}
        </p>
      </div>

      {filtered.length === 0 ? <div className="empty">No domains match.</div> : null}
      <div className="cards">
        {slice.map((domain, index) => {
          const row = cache[domain];
          return (
            <BonusCard
              key={domain}
              domain={domain}
              rank={safePage * PAGE + index + 1}
              bonuses={row ? row.bonuses : null}
              message={row?.message}
            />
          );
        })}
      </div>
      {pages > 1 ? (
        <div className="pager">
          <button type="button" className="btn" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>
            Previous
          </button>
          <span>
            Page {safePage + 1} / {pages}
          </span>
          <button type="button" className="btn" disabled={safePage >= pages - 1} onClick={() => setPage(safePage + 1)}>
            Next
          </button>
        </div>
      ) : null}
    </section>
  );
}
