import { useServerFn } from "@tanstack/react-start";
import { ArrowUpDown, Bookmark, Eye, Search, Wallet, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CATALOG, type CatalogSite, type SiteGroup } from "@/data/sites";
import { checkSiteStatus, fetchAllStatusesFn } from "@/lib/casino.functions";
import { formatAdded, money } from "@/lib/format";
import type { AccountOk, AccountRow, BonusView } from "@/lib/parse-account";
import { SiteIcon } from "@/components/site-icon";
import { useVault, type BonusMode, type SortMode } from "@/components/vault";
import { compareSites, chosenBonus } from "@/lib/order";

type Listed = CatalogSite | { domain: string; group: SiteGroup; addedAt: string };

const GROUP_LABEL: Record<SiteGroup, string> = {
  new: "New",
  best: "Best",
  unverified: "Unverified",
  share: "Instant share bonuses",
  latest: "Latest",
  custom: "Added by you",
};

const STATUS_LABEL = {
  checking: "Checking",
  live: "Live",
  slow: "Slow",
  redirect: "Redirect",
  dead: "Down",
  unknown: "Unknown",
} as const;

type StatusName = keyof typeof STATUS_LABEL;

const STATUS_CACHE_KEY = "vault-statuses";
const STATUS_CACHE_TTL = 15 * 60 * 1000;

function readStatusCache(): Record<string, StatusName> | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(STATUS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { at?: number; map?: Record<string, StatusName> };
    if (!parsed.at || !parsed.map || Date.now() - parsed.at >= STATUS_CACHE_TTL) return null;
    return parsed.map;
  } catch {
    return null;
  }
}

function writeStatusCache(map: Record<string, StatusName>) {
  try {
    localStorage.setItem(STATUS_CACHE_KEY, JSON.stringify({ at: Date.now(), map }));
  } catch {
    /* ignore quota */
  }
}

function bonusSortName(mode: BonusMode): string {
  if (mode === "new") return "Signup bonus";
  if (mode === "commission") return "Commission";
  if (mode === "referral") return "Referral";
  if (mode === "rebate") return "Rebate";
  return "Share";
}

function bonusOf(row: AccountOk, mode: BonusMode): BonusView | null {
  if (mode === "none") return null;
  return chosenBonus(row, mode);
}

export function Directory() {
  const { state, patch, markVisited, toggleMine } = useVault();
  const statusFn = useServerFn(checkSiteStatus);
  const allStatusesFn = useServerFn(fetchAllStatusesFn);
  const statusFnRef = useRef(statusFn);
  const allStatusesFnRef = useRef(allStatusesFn);
  statusFnRef.current = statusFn;
  allStatusesFnRef.current = allStatusesFn;
  const [query, setQuery] = useState("");
  const [searchReady, setSearchReady] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, StatusName>>(() => readStatusCache() ?? {});

  useEffect(() => {
    setSearchReady(true);
  }, []);

  const fetchMap = useMemo(() => {
    const map = new Map<string, AccountRow>();
    for (const row of state.lastFetch?.rows ?? []) map.set(row.domain, row);
    return map;
  }, [state.lastFetch]);

  const sites = useMemo<Listed[]>(() => {
    const map = new Map<string, Listed>();
    for (const site of CATALOG) map.set(site.domain, site);
    for (const site of state.custom) {
      if (!map.has(site.domain)) {
        map.set(site.domain, { domain: site.domain, group: "custom", addedAt: site.addedAt });
      }
    }
    return [...map.values()];
  }, [state.custom]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = sites.filter((site) => {
      if (state.mineOnly && !state.mine.includes(site.domain)) return false;
      if (state.notVisited && state.visited.includes(site.domain)) return false;
      if (q && !site.domain.includes(q)) return false;
      return true;
    });
    const sorted =
      state.sort === "default"
        ? list
        : [...list].sort((a, b) =>
            compareSites(a, b, fetchMap.get(a.domain), fetchMap.get(b.domain), state.sort, state.bonusMode),
          );
    return sorted;
  }, [sites, query, state.mineOnly, state.mine, state.notVisited, state.visited, state.sort, state.bonusMode, fetchMap]);

  const grouped = state.sort === "default" && !query.trim() && !state.mineOnly && !state.notVisited;
  const domainKey = sites.map((site) => site.domain).join("\n");

  useEffect(() => {
    let cancelled = false;
    const domains = domainKey ? domainKey.split("\n") : [];

    const probeMissing = async (map: Record<string, StatusName>) => {
      const missing = domains.filter((domain) => !(domain in map));
      const probe = missing.slice(0, 40);
      const next = { ...map };
      for (const domain of missing.slice(40)) next[domain] = "unknown";
      if (!probe.length || cancelled) return next;
      if (!cancelled) setStatuses({ ...next });
      let cursor = 0;
      const worker = async () => {
        for (;;) {
          if (cancelled) return;
          const index = cursor;
          cursor += 1;
          if (index >= probe.length) return;
          const domain = probe[index] ?? "";
          try {
            const result = await statusFnRef.current({ data: { domain } });
            next[domain] = result.status;
          } catch {
            next[domain] = "dead";
          }
          if (!cancelled) setStatuses({ ...next });
        }
      };
      await Promise.all(Array.from({ length: Math.min(4, probe.length) }, () => worker()));
      return next;
    };

    const cached = readStatusCache();
    if (cached) {
      setStatuses(cached);
      const missing = domains.filter((domain) => !(domain in cached));
      if (missing.length) void probeMissing(cached).then((filled) => {
        if (!cancelled) writeStatusCache(filled);
      });
      return () => {
        cancelled = true;
      };
    }

    void (async () => {
      let map: Record<string, StatusName> = {};
      try {
        map = await allStatusesFnRef.current({ data: {} });
      } catch {
        map = {};
      }
      if (cancelled) return;
      setStatuses(map);
      const filled = await probeMissing(map);
      if (!cancelled) writeStatusCache(filled);
    })();

    return () => {
      cancelled = true;
    };
  }, [domainKey]);

  function renderCard(site: Listed, compact = false) {
    const row = fetchMap.get(site.domain);
    const status = statuses[site.domain] ?? "checking";
    const bonus = row?.ok ? bonusOf(row, state.bonusMode) : null;
    return (
      <article
        key={site.domain}
        className={compact ? "site-card compact" : "site-card"}
      >
        <a
          className="site-hit"
          href={`https://${site.domain}/`}
          target="_blank"
          rel="noreferrer"
          onClick={() => markVisited(site.domain)}
        >
          <SiteIcon domain={site.domain} />
          <span className="site-copy">
            <span className="site-domain">{site.domain}</span>
            <span className={`site-meta ${status}`}>
              <i />
              {STATUS_LABEL[status]}
              {site.addedAt ? ` · ${formatAdded(site.addedAt)}` : ""}
            </span>
            {state.wallets ? (
              <span className={row && !row.ok ? "wallet-line warn" : "wallet-line"}>
                {!row
                  ? "No fetch yet"
                  : row.ok
                    ? `${money(row.cash)} ${row.cashWalletName}`
                    : row.message}
              </span>
            ) : null}
            {bonus ? (
              <span className="wallet-line">
                {bonus.name} {bonus.amountDisplay}
              </span>
            ) : null}
          </span>
        </a>
        <button
          type="button"
          className={state.mine.includes(site.domain) ? "pin on" : "pin"}
          aria-label={
            state.mine.includes(site.domain) ? `Remove ${site.domain} from my accounts` : `Save ${site.domain}`
          }
          onClick={() => toggleMine(site.domain)}
        >
          <Bookmark size={16} fill={state.mine.includes(site.domain) ? "currentColor" : "none"} />
        </button>
      </article>
    );
  }

  const visitedCount = sites.filter((site) => state.visited.includes(site.domain)).length;

  return (
    <>
      <section className="toolbar">
        <div className="tool-row">
          <button
            type="button"
            className={state.notVisited ? "tool active" : "tool"}
            onClick={() => patch({ notVisited: !state.notVisited })}
          >
            <Eye size={12} style={{ display: "inline", marginRight: 3 }} />
            Not visited: {state.notVisited ? "On" : "Off"}
          </button>
          <button
            type="button"
            className="tool"
            onClick={() =>
              patch({
                view: state.view === "default" ? "one" : state.view === "one" ? "two" : "default",
              })
            }
          >
            View: {state.view === "default" ? "Groups" : state.view === "one" ? "One" : "Two"}
          </button>
          <button
            type="button"
            className={state.wallets ? "tool active" : "tool"}
            onClick={() => patch({ wallets: !state.wallets })}
          >
            <Wallet size={12} style={{ display: "inline", marginRight: 3 }} />
            Wallets: {state.wallets ? "On" : "Off"}
          </button>
          <button type="button" className="tool" onClick={() => setSortOpen(true)}>
            <ArrowUpDown size={12} style={{ display: "inline", marginRight: 3 }} />
            Sort / filter
          </button>
        </div>
        <label className="search">
          <Search size={16} />
          {searchReady ? (
            <input
              value={query}
              placeholder="Search casinos or domains"
              aria-label="Search casinos or domains"
              onChange={(event) => setQuery(event.target.value)}
            />
          ) : (
            <span className="search-ghost">Search casinos or domains</span>
          )}
          {query ? (
            <button type="button" className="pin" aria-label="Clear search" onClick={() => setQuery("")}>
              <X size={16} />
            </button>
          ) : null}
        </label>
        <div className="stats">
          <span>
            Sites <strong>{sites.length}</strong>
          </span>
          <span>
            Visited <strong>{visitedCount}</strong>
          </span>
          <span>
            My accounts <strong>{state.mine.length}</strong>
          </span>
        </div>
      </section>

      <section className="banner">
        <div>
          <strong>How your accounts work</strong>
          <p>
            Bookmark a site, then open the fetcher and sign in with the phone number and password you already
            use. Only sites that accept that login are kept. Nothing here is paid — no fetch packs and no rented cards.
          </p>
        </div>
      </section>

      {filtered.length === 0 ? <div className="empty">No matching sites.</div> : null}

      {grouped && state.view === "default" ? (
        <>
          <div className="feature-frame">
            <div className="top-cols">
              {(["new", "best", "unverified"] as const).map((group) => (
                <div key={group}>
                  <h2>{GROUP_LABEL[group]}</h2>
                  <div className="top-col">
                    {filtered
                      .filter((site) => site.group === group)
                      .map((site) => renderCard(site, true))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {(["share", "custom", "latest"] as const).map((group) => {
            const items = filtered.filter((site) => site.group === group);
            if (!items.length) return null;
            return (
              <section key={group}>
                <h2 className="section-label">
                  {GROUP_LABEL[group]} · {items.length}
                </h2>
                <div className="cards">{items.map((site) => renderCard(site))}</div>
              </section>
            );
          })}
        </>
      ) : (
        <div className={state.view === "one" ? "cards view-one" : state.view === "two" ? "cards view-two" : "cards"}>
          {filtered.map((site) => renderCard(site, state.view !== "one"))}
        </div>
      )}

      {sortOpen ? (
        <div className="modal-backdrop" onClick={() => setSortOpen(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="header-row">
              <h3>Sort and filter</h3>
              <button type="button" className="pin" aria-label="Close" onClick={() => setSortOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <h3>Sort by</h3>
            <p className="hint">Same order for the homepage cards and the bonus fetcher results.</p>
            {(
              [
                ["default", "Default order"],
                ["az", "Domain name — A → Z"],
                ["za", "Domain name — Z → A"],
                ["balance", "Highest balance"],
                ["turnover", "Best turnover"],
                ["cashout", "Lowest cash-out"],
                ["errors", "Errors"],
                ["popular", "Most popular"],
                ["norefer", "Accounts without referlinks"],
                ["shareAmount", `${bonusSortName(state.bonusMode)} — biggest amount`],
                ["shareMax", `${bonusSortName(state.bonusMode)} — highest max`],
                ["shareTurn", `${bonusSortName(state.bonusMode)} — lowest turnover`],
                ["new", "Newest"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={state.sort === id ? "choice on" : "choice"}
                onClick={() => patch({ sort: id as SortMode })}
              >
                <i className="radio" />
                {label}
              </button>
            ))}
            <h3 className="section-label">Bonus display</h3>
            <p className="hint">
              Highlights that bonus on every card. The three “chosen bonus” sorts above use it.
            </p>
            {(
              [
                ["none", "None", ""],
                ["new", "Signup bonus", "🎁"],
                ["share", "Share bonus", "🤝"],
                ["commission", "Commission", "💸"],
                ["referral", "Referral bonus", "👥"],
                ["rebate", "Rebate bonus", "♻️"],
              ] as const
            ).map(([id, label, emoji]) => (
              <button
                key={id}
                type="button"
                className={state.bonusMode === id ? "choice on" : "choice"}
                onClick={() => patch({ bonusMode: id })}
              >
                <i className="radio" />
                {emoji ? <span aria-hidden="true">{emoji}</span> : null}
                {label}
              </button>
            ))}
            <button
              type="button"
              className={state.mineOnly ? "choice on" : "choice"}
              onClick={() => patch({ mineOnly: !state.mineOnly })}
            >
              My accounts only
            </button>
            <button type="button" className="btn btn-grad" style={{ marginTop: 12, width: "100%" }} onClick={() => setSortOpen(false)}>
              Done
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
