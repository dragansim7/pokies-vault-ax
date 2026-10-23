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
import { isThemeId, themeById, type ThemeId } from "@/lib/themes";
import { isSortMode } from "@/lib/order";

const KEY = "pokies_vault_v1";

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
    setState(load());
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
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore quota */
    }
  }, []);

  const patch = useCallback(
    (partial: Partial<VaultState>) => {
      setState((current) => {
        const next = { ...current, ...partial };
        try {
          localStorage.setItem(KEY, JSON.stringify(next));
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
        localStorage.setItem(KEY, JSON.stringify(next));
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
        localStorage.setItem(KEY, JSON.stringify(next));
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
        localStorage.setItem(KEY, JSON.stringify(next));
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
        localStorage.setItem(KEY, JSON.stringify(next));
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
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const addDomain = useCallback((raw: string) => {
    const domain = normalizeDomain(raw);
    if (!isPublicDomain(domain)) return "Enter a domain like 9au.com";
    setState((current) => {
      const custom = current.custom.some((item) => item.domain === domain)
        ? current.custom
        : [{ domain, addedAt: new Date().toISOString() }, ...current.custom];
      const mine = current.mine.includes(domain) ? current.mine : [...current.mine, domain];
      const next = { ...current, custom, mine };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
    return null;
  }, []);

  const saveFetch = useCallback((rows: AccountRow[]) => {
    const lastFetch: LastFetch = { at: Date.now(), rows };
    setState((current) => {
      const found = rows.filter((row) => row.ok).map((row) => row.domain);
      const mine = Array.from(new Set([...current.mine, ...found]));
      const next = { ...current, lastFetch, mine };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
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
