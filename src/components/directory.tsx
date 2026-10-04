import { useServerFn } from "@tanstack/react-start";
import { ArrowUpDown, Bookmark, Eye, Search, Wallet, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CATALOG, type CatalogSite, type SiteGroup } from "@/data/sites";
import { checkSiteStatus } from "@/lib/casino.functions";
import { formatAdded, initials, money } from "@/lib/format";
import type { AccountOk, AccountRow, BonusView } from "@/lib/parse-account";
import { useVault, type BonusMode, type SortMode } from "@/components/vault";

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
} as const;

type StatusName = keyof typeof STATUS_LABEL;

function bonusOf(row: AccountOk, mode: BonusMode): BonusView | null {
  if (mode === "none") return null;
  return row[mode];
}

function SiteIcon({ domain }: { domain: string }) {
  const tones = ["tone-cyan", "tone-violet", "tone-pink", "tone-live"] as const;
  const tone = tones[domain.charCodeAt(0) % tones.length] ?? "tone-cyan";
  return <span className={`site-fallback ${tone}`}>{initials(domain)}</span>;
}

export function Directory() {
  const { state, patch, markVisited, toggleMine } = useVault();
  const statusFn = useServerFn(checkSiteStatus);
  const [query, setQuery] = useState("");
  const [searchReady, setSearchReady] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, StatusName>>({});
  const seen = useRef(new Set<string>());
  const queue = useRef<string[]>([]);
  const running = useRef(0);
  const statusFnRef = useRef(statusFn);
  statusFnRef.current = statusFn;

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
    const cashOf = (domain: string) => {
      const row = fetchMap.get(domain);
      return row?.ok ? row.cash : -1;
    };
    if (state.sort === "az") list = [...list].sort((a, b) => a.domain.localeCompare(b.domain));
    if (state.sort === "za") list = [...list].sort((a, b) => b.domain.localeCompare(a.domain));
    if (state.sort === "new") {
      list = [...list].sort((a, b) => String(b.addedAt).localeCompare(String(a.addedAt)));
    }
    if (state.sort === "balance") {
      list = [...list].sort((a, b) => cashOf(b.domain) - cashOf(a.domain) || a.domain.localeCompare(b.domain));
    }
    return list;
  }, [sites, query, state.mineOnly, state.mine, state.notVisited, state.visited, state.sort, fetchMap]);

  const grouped = state.sort === "default" && !query.trim() && !state.mineOnly && !state.notVisited;

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-status-domain]");
    const pump = () => {
      while (running.current < 4 && queue.current.length) {
        const domain = queue.current.shift();
        if (!domain) break;
        running.current += 1;
        void statusFnRef
          .current({ data: { domain } })
          .then((result) => {
            setStatuses((current) => ({ ...current, [domain]: result.status }));
            try {
              sessionStorage.setItem(
                `vault-status:${domain}`,
                JSON.stringify({ at: Date.now(), status: result.status }),
              );
            } catch {
              /* ignore */
            }
          })
          .catch(() => {
            setStatuses((current) => ({ ...current, [domain]: "dead" }));
          })
          .finally(() => {
            running.current -= 1;
            pump();
          });
      }
    };
    const enqueue = (domain: string) => {
      if (seen.current.has(domain)) return;
      seen.current.add(domain);
      try {
        const cached = sessionStorage.getItem(`vault-status:${domain}`);
        if (cached) {
          const parsed = JSON.parse(cached) as { at: number; status: StatusName };
          if (Date.now() - parsed.at < 10 * 60 * 1000) {
            setStatuses((current) => ({ ...current, [domain]: parsed.status }));
            return;
          }
        }
      } catch {
        /* ignore */
      }
      setStatuses((current) => ({ ...current, [domain]: "checking" }));
      queue.current.push(domain);
      pump();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const domain = (entry.target as HTMLElement).dataset.statusDomain;
          if (domain) enqueue(domain);
        }
      },
      { rootMargin: "160px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [filtered, grouped, state.view]);

  function renderCard(site: Listed, compact = false) {
    const row = fetchMap.get(site.domain);
    const status = statuses[site.domain] ?? "checking";
    const bonus = row?.ok ? bonusOf(row, state.bonusMode) : null;
    return (
      <article
        key={site.domain}
        className={compact ? "site-card compact" : "site-card"}
        data-status-domain={site.domain}
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
            {(
              [
                ["default", "Featured groups"],
                ["az", "Domain A–Z"],
                ["za", "Domain Z–A"],
                ["new", "Newest added"],
                ["balance", "Wallet balance"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={state.sort === id ? "choice on" : "choice"}
                onClick={() => patch({ sort: id as SortMode })}
              >
                {label}
              </button>
            ))}
            <h3 className="section-label">Show on cards</h3>
            {(
              [
                ["none", "Nothing extra"],
                ["new", "Welcome"],
                ["share", "Share"],
                ["commission", "Commission"],
                ["referral", "Referral"],
                ["rebate", "Rebate"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={state.bonusMode === id ? "choice on" : "choice"}
                onClick={() => patch({ bonusMode: id })}
              >
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
