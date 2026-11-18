import { ChevronDown, ChevronUp } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { BonusCard } from "@/components/bonus-card";
import { useVault } from "@/components/vault";
import { loadPublicCatalogueFn } from "@/lib/casino.functions";
import { visibleSites } from "@/lib/working-sites";
import { bestBonus, type BonusSlot, type PublicBonus } from "@/lib/public-bonus";

const CACHE_KEY = "pokies_vault_bonus_catalogue_v1";
const PAGE = 20;

type CacheRow = { bonuses: PublicBonus[]; message?: string; host?: string; merchantId?: string };

type AmountSort = "" | "deposit" | "amount" | "withdraw" | "turnover";

type Filters = {
  slots: BonusSlot[];
  list: BonusSlot | "";
  amount: AmountSort;
};

const FILTER_SLOTS: { id: BonusSlot; label: string }[] = [
  { id: "deposit", label: "Deposit Match" },
  { id: "signup", label: "Free Signup" },
  { id: "share", label: "Share/Invite" },
  { id: "daily", label: "Daily Free" },
  { id: "birthday", label: "Birthday" },
];

const EMPTY_FILTERS: Filters = {
  slots: [],
  list: "",
  amount: "",
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

function passes(bonus: PublicBonus, slots: BonusSlot[]): boolean {
  return bonus.slot !== "other" && slots.includes(bonus.slot);
}

function metricOf(bonuses: PublicBonus[], filters: Filters): number | null {
  if (!filters.amount) return null;
  const slot = filters.amount === "deposit" ? "deposit" : filters.list;
  if (!slot) return null;
  const bonus = bestBonus(bonuses, slot);
  if (!bonus || bonus.kind === "unset") return null;
  if (filters.amount === "turnover") return bonus.rollover ?? 0;
  if (filters.amount === "withdraw") return bonus.maxWithdraw;
  return bonus.amount;
}

export function BonusFinder() {
  const { state } = useVault();
  const loadFn = useServerFn(loadPublicCatalogueFn);
  const loadRef = useRef(loadFn);
  loadRef.current = loadFn;
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cache, setCache] = useState<Record<string, CacheRow>>({});
  const cacheRef = useRef(cache);
  cacheRef.current = cache;
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
    if (filters.slots.length) {
      list = list.filter((domain) => {
        const row = cache[domain];
        if (!row) return false;
        return row.bonuses.some((bonus) => passes(bonus, filters.slots));
      });
    }
    const sorted = [...list].sort((a, b) => a.localeCompare(b));
    if (!filters.amount || (filters.amount !== "deposit" && !filters.list)) return sorted;
    const direction = filters.amount === "turnover" ? 1 : -1;
    return sorted.sort((a, b) => {
      const left = metricOf(cache[a]?.bonuses ?? [], filters);
      const right = metricOf(cache[b]?.bonuses ?? [], filters);
      if (left == null && right == null) return a.localeCompare(b);
      if (left == null) return 1;
      if (right == null) return -1;
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
        const names = unique.slice(index, index + 4);
        if (!names.length) return;
        const items = names.map((domain) => {
          const saved = cacheRef.current[domain];
          return { domain, host: saved?.host, merchantId: saved?.merchantId };
        });
        try {
          const result = await loadRef.current({ data: { items }, signal: controller.signal });
          if (controller.signal.aborted) return;
          setCache((current) => {
            const next = { ...current };
            for (const row of result) {
              next[row.domain] = {
                bonuses: row.ok ? row.bonuses : [],
                message: row.ok ? undefined : row.message,
                host: row.host || current[row.domain]?.host,
                merchantId: row.merchantId || current[row.domain]?.merchantId,
              };
            }
            return next;
          });
        } catch {
          if (controller.signal.aborted) return;
          setCache((current) => {
            const next = { ...current };
            for (const domain of names) {
              if (!next[domain]) next[domain] = { bonuses: [], message: "Could not load" };
            }
            return next;
          });
        }
        done += names.length;
        setProgress({ done: Math.min(done, unique.length), total: unique.length });
      }
    };
    await Promise.all(Array.from({ length: Math.min(5, Math.ceil(unique.length / 4)) }, () => worker()));
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
          the public deposit match, free signup, share, daily, and birthday offers. No sign-in.
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
        <button
          type="button"
          className="filter-toggle"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <span>Sort and filter{filters.slots.length || filters.amount ? " · On" : ""}</span>
          {filtersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {filtersOpen ? (
          <div className="finder-box">
            <div className="finder-slots">
              {FILTER_SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  className={filters.slots.includes(slot.id) ? "tool active" : "tool"}
                  onClick={() => toggleSlot(slot.id)}
                >
                  {slot.label}
                </button>
              ))}
            </div>
            <div className="finder-grid">
              <label>
                List order
                <select
                  value={filters.list}
                  onChange={(event) => {
                    setPage(0);
                    const list = event.target.value as Filters["list"];
                    setFilters((current) => ({ ...current, list }));
                  }}
                >
                  <option value="">All</option>
                  {FILTER_SLOTS.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Amount type
                <select
                  value={filters.amount}
                  onChange={(event) => {
                    setPage(0);
                    const amount = event.target.value as AmountSort;
                    setFilters((current) => ({ ...current, amount }));
                  }}
                >
                  <option value="">Domain A–Z</option>
                  <option value="deposit">Highest Deposit Match</option>
                  <option value="amount">Highest Bonus Amount</option>
                  <option value="withdraw">Highest Max Withdrawal</option>
                  <option value="turnover">Lowest Turnover/Wager</option>
                </select>
              </label>
            </div>
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
          </div>
        ) : null}
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
