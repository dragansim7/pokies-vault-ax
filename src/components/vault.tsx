import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AccountRow } from "@/lib/parse-account";
import { isPublicDomain, normalizeDomain } from "@/lib/domain";
import { clearOwnedList, loadOwnedList, saveOwnedList, siteRecord } from "@/lib/domain-list";
import { INTEL_KEY } from "@/lib/intel-domains";
import { workingSites, type ListedSite } from "@/lib/working-sites";
import { isThemeId, themeById, type ThemeId } from "@/lib/themes";
import { isSortMode } from "@/lib/order";

const KEY = "pokies_vault_v1";
const LIST_ERROR = "The domain list could not be saved on this device, so that change was not kept.";

function writeVault(state: VaultState) {
  const { listOwned: _listOwned, sites: _sites, ...rest } = state;
  localStorage.setItem(KEY, JSON.stringify(rest));
}

function withSavedList(current: VaultState, sites: ListedSite[]): VaultState | null {
  if (!saveOwnedList(sites)) return null;
  return { ...current, listOwned: true, sites };
}

export type ViewMode = "default" | "one" | "two";
export type SortMode =
  | "default"
  | "az"
  | "za"
  | "balance"
  | "turnover"
  | "cashout"
  | "errors"
  | "popular"
  | "norefer"
  | "shareAmount"
  | "shareMax"
  | "shareTurn"
  | "new";
export type BonusMode = "none" | "new" | "share" | "commission" | "referral" | "rebate";

export type FallbackCred = { phone: string; password: string };

export type AttentionMark = { domain: string; code: string };

export type LastFetch = {
  at: number;
  rows: AccountRow[];
};

export type VaultState = {
  visited: string[];
  mine: string[];
  custom: { domain: string; addedAt: string }[];
  removed: string[];
  listOwned: boolean;
  sites: ListedSite[];
  phone: string;
  password: string;
  fallbacks: FallbackCred[];
  logins: Record<string, FallbackCred>;
  lastFetch: LastFetch | null;
  attentionChecked: AttentionMark[];
  view: ViewMode;
  notVisited: boolean;
  wallets: boolean;
  mineOnly: boolean;
  sort: SortMode;
  bonusMode: BonusMode;
  theme: ThemeId;
};

const EMPTY: VaultState = {
  visited: [],
  mine: [],
  custom: [],
  removed: [],
  listOwned: false,
  sites: [],
  phone: "",
  password: "",
  fallbacks: [
    { phone: "", password: "" },
    { phone: "", password: "" },
    { phone: "", password: "" },
  ],
  logins: {},
  lastFetch: null,
  attentionChecked: [],
  view: "default",
  notVisited: false,
  wallets: false,
  mineOnly: false,
  sort: "default",
  bonusMode: "none",
  theme: "vault",
};

function usableLogin(value: unknown): FallbackCred | null {
  if (!value || typeof value !== "object") return null;
  const phone = String((value as FallbackCred).phone ?? "").replace(/\s+/g, "");
  const password = String((value as FallbackCred).password ?? "");
  if (!/^[0-9+]{6,20}$/.test(phone) || password.length < 4 || password.length > 64) return null;
  return { phone, password };
}

function cleanLogins(value: unknown): Record<string, FallbackCred> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, FallbackCred> = {};
  for (const [rawDomain, rawLogin] of Object.entries(value)) {
    const domain = normalizeDomain(rawDomain);
    const login = usableLogin(rawLogin);
    if (!isPublicDomain(domain) || !login) continue;
    out[domain] = login;
  }
  return out;
}

function load(): VaultState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<VaultState>;
    return {
      ...EMPTY,
      ...parsed,
      visited: Array.isArray(parsed.visited) ? parsed.visited : [],
      mine: Array.isArray(parsed.mine) ? parsed.mine : [],
      custom: Array.isArray(parsed.custom) ? parsed.custom : [],
      removed: Array.isArray(parsed.removed)
        ? Array.from(
            new Set(
              parsed.removed
                .map((item) => normalizeDomain(String(item)))
                .filter(isPublicDomain),
            ),
          )
        : [],
      listOwned: false,
      sites: [],
      fallbacks:
        Array.isArray(parsed.fallbacks) && parsed.fallbacks.length === 3
          ? parsed.fallbacks
          : EMPTY.fallbacks,
      logins: cleanLogins(parsed.logins),
      sort: isSortMode(parsed.sort) ? parsed.sort : EMPTY.sort,
      bonusMode: parsed.bonusMode ?? EMPTY.bonusMode,
      theme: isThemeId(parsed.theme) ? parsed.theme : EMPTY.theme,
      attentionChecked: Array.isArray(parsed.attentionChecked)
        ? parsed.attentionChecked.filter(
            (item): item is AttentionMark =>
              !!item &&
              typeof item === "object" &&
              typeof (item as AttentionMark).domain === "string" &&
              typeof (item as AttentionMark).code === "string",
          )
        : [],
    };
  } catch {
    return EMPTY;
  }
}

type VaultApi = {
  ready: boolean;
  state: VaultState;
  patch: (partial: Partial<VaultState>) => void;
  toggleVisited: (domain: string) => void;
  markVisited: (domain: string) => void;
  toggleMine: (domain: string) => void;
  addDomain: (raw: string) => string | null;
  addManaged: (raws: string[]) => { added: number; error: string | null };
  removeManaged: (domains: string[]) => string | null;
  rememberAccount: (domain: string) => void;
  rememberLogins: (updates: { domain: string; login: FallbackCred | null }[]) => void;
  saveFetch: (rows: AccountRow[]) => void;
  clearAll: () => void;
};

const VaultContext = createContext<VaultApi | null>(null);

export function VaultProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VaultState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = load();
    const owned = loadOwnedList();
    if (owned) {
      setState({ ...saved, listOwned: true, sites: owned });
    } else if (saved.removed.length || saved.custom.length) {
      const sites = workingSites(saved.custom, saved.removed);
      setState(saveOwnedList(sites) ? { ...saved, listOwned: true, sites } : saved);
    } else {
      setState(saved);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    const theme = themeById(state.theme);
    document.documentElement.dataset.theme = theme.id;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme.bg);
  }, [state.theme]);

  const persist = useCallback((next: VaultState) => {
    setState(next);
    try {
      writeVault(next);
    } catch {
      /* ignore quota */
    }
  }, []);

  const patch = useCallback(
    (partial: Partial<VaultState>) => {
      setState((current) => {
        const next = { ...current, ...partial };
        try {
          writeVault(next);
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [],
  );

  const markVisited = useCallback((domain: string) => {
    setState((current) => {
      if (current.visited.includes(domain)) return current;
      const next = { ...current, visited: [...current.visited, domain] };
      try {
        writeVault(next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const toggleVisited = useCallback((domain: string) => {
    setState((current) => {
      const visited = current.visited.includes(domain)
        ? current.visited.filter((item) => item !== domain)
        : [...current.visited, domain];
      const next = { ...current, visited };
      try {
        writeVault(next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const toggleMine = useCallback((domain: string) => {
    setState((current) => {
      const mine = current.mine.includes(domain)
        ? current.mine.filter((item) => item !== domain)
        : [...current.mine, domain];
      const next = { ...current, mine };
      try {
        writeVault(next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const rememberAccount = useCallback((domain: string) => {
    setState((current) => {
      if (current.mine.includes(domain)) return current;
      const next = { ...current, mine: [...current.mine, domain] };
      try {
        writeVault(next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const rememberLogins = useCallback((updates: { domain: string; login: FallbackCred | null }[]) => {
    if (!updates.length) return;
    setState((current) => {
      const logins = { ...current.logins };
      let changed = false;
      for (const update of updates) {
        const domain = normalizeDomain(update.domain);
        if (!isPublicDomain(domain)) continue;
        const login = usableLogin(update.login);
        if (!login) {
          if (domain in logins) {
            delete logins[domain];
            changed = true;
          }
          continue;
        }
        const prev = logins[domain];
        if (prev && prev.phone === login.phone && prev.password === login.password) continue;
        logins[domain] = login;
        changed = true;
      }
      if (!changed) return current;
      const next = { ...current, logins };
      try {
        writeVault(next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const addDomain = useCallback((raw: string) => {
    const domain = normalizeDomain(raw);
    if (!isPublicDomain(domain)) return "Enter a domain like 9au.com";
    let error: string | null = null;
    setState((current) => {
      const base = current.listOwned ? current.sites : workingSites(current.custom, current.removed);
      const exists = base.some((site) => site.domain === domain);
      let next = current;
      if (!exists) {
        const saved = withSavedList(current, [siteRecord(domain, new Date().toISOString()), ...base]);
        if (!saved) {
          error = LIST_ERROR;
          return current;
        }
        next = saved;
      }
      const custom = next.custom.some((item) => item.domain === domain)
        ? next.custom
        : [{ domain, addedAt: new Date().toISOString() }, ...next.custom];
      const mine = next.mine.includes(domain) ? next.mine : [...next.mine, domain];
      const removed = next.removed.filter((item) => item !== domain);
      const stored = { ...next, custom, mine, removed };
      try {
        writeVault(stored);
      } catch {
        /* the domain list is already in its own save */
      }
      return stored;
    });
    return error;
  }, []);

  const addManaged = useCallback((raws: string[]) => {
    const incoming = Array.from(new Set(raws.map((item) => normalizeDomain(item)).filter(isPublicDomain)));
    if (!incoming.length) return { added: 0, error: null };
    let added = 0;
    let error: string | null = null;
    setState((current) => {
      const base = current.listOwned ? current.sites : workingSites(current.custom, current.removed);
      const have = new Set(base.map((site) => site.domain));
      const sites = [...base];
      const stamp = new Date().toISOString();
      for (const domain of incoming) {
        if (have.has(domain)) continue;
        sites.push(siteRecord(domain, stamp));
        have.add(domain);
        added += 1;
      }
      if (!added) return current;
      const saved = withSavedList(current, sites);
      if (!saved) {
        error = LIST_ERROR;
        added = 0;
        return current;
      }
      return saved;
    });
    return { added, error };
  }, []);

  const removeManaged = useCallback((domains: string[]) => {
    const drop = new Set(domains.map((item) => normalizeDomain(item)).filter(isPublicDomain));
    if (!drop.size) return null;
    let error: string | null = null;
    setState((current) => {
      const base = current.listOwned ? current.sites : workingSites(current.custom, current.removed);
      const sites = base.filter((site) => !drop.has(site.domain));
      const saved = withSavedList(current, sites);
      if (!saved) {
        error = LIST_ERROR;
        return current;
      }
      const custom = current.custom.filter((item) => !drop.has(item.domain));
      const mine = current.mine.filter((item) => !drop.has(item));
      const lastFetch = current.lastFetch
        ? { ...current.lastFetch, rows: current.lastFetch.rows.filter((row) => !drop.has(row.domain)) }
        : current.lastFetch;
      const next = { ...saved, custom, mine, lastFetch };
      try {
        writeVault(next);
      } catch {
        /* domain list already saved separately */
      }
      return next;
    });
    return error;
  }, []);

  const saveFetch = useCallback((rows: AccountRow[]) => {
    const lastFetch: LastFetch = { at: Date.now(), rows };
    setState((current) => {
      const found = rows.filter((row) => row.ok).map((row) => row.domain);
      const mine = Array.from(new Set([...current.mine, ...found]));
      const next = { ...current, lastFetch, mine };
      try {
        writeVault(next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    clearOwnedList();
    try {
      localStorage.removeItem(INTEL_KEY);
    } catch {
      /* ignore */
    }
    persist(EMPTY);
  }, [persist]);

  const api = useMemo<VaultApi>(
    () => ({
      ready,
      state,
      patch,
      toggleVisited,
      markVisited,
      toggleMine,
      addDomain,
      addManaged,
      removeManaged,
      rememberAccount,
      rememberLogins,
      saveFetch,
      clearAll,
    }),
    [
      ready,
      state,
      patch,
      toggleVisited,
      markVisited,
      toggleMine,
      addDomain,
      addManaged,
      removeManaged,
      rememberAccount,
      rememberLogins,
      saveFetch,
      clearAll,
    ],
  );

  return <VaultContext.Provider value={api}>{children}</VaultContext.Provider>;
}

export function useVault(): VaultApi {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error("Vault missing");
  return ctx;
}
