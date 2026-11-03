import type { CasinoTarget } from "@/lib/casino-target";
import { normalizeDomain } from "@/lib/domain";
import { accountError, parseSyncUser, type AccountCode, type AccountRow } from "@/lib/parse-account";

type ApiBody = {
  status?: string;
  data?: unknown;
};

function messageOf(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" ? message : "";
}

function classifyFailure(domain: string, message: string, fallback: string): AccountRow {
  const text = message.toLowerCase();
  if (text.includes("invalid login") || text.includes("invalid password")) {
    return accountError(domain, "invalid_login", "Not your account");
  }
  if (text.includes("captcha")) {
    return accountError(domain, "captcha", "Site asked for a captcha");
  }
  if (text.includes("bad-json")) {
    return accountError(domain, "unreachable", "Site did not return account data");
  }
  if (text.includes("abort") || text.includes("timeout")) {
    return accountError(domain, "timeout", "Timed out");
  }
  return accountError(domain, "other", fallback);
}

export function isInstalledPhone(): boolean {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { standalone?: boolean };
  const standalone =
    nav.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches;
  const phone =
    window.matchMedia("(max-width: 900px)").matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  return standalone && phone;
}

async function postApi(
  host: string,
  fields: Record<string, string>,
  signal?: AbortSignal,
): Promise<ApiBody> {
  const response = await fetch(`https://${host}/api/v1/index.php`, {
    method: "POST",
    signal,
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      accept: "application/json,text/plain,*/*",
    },
    body: new URLSearchParams(fields),
  });
  const text = await response.text();
  try {
    return JSON.parse(text) as ApiBody;
  } catch {
    throw new Error("bad-json");
  }
}

async function fetchOne(
  target: Extract<CasinoTarget, { ok: true }>,
  phone: string,
  password: string,
  signal?: AbortSignal,
): Promise<AccountRow> {
  const domain = target.domain;
  if (!/^[0-9+]{6,20}$/.test(phone)) {
    return accountError(domain, "other", "Enter the mobile number you use on these sites");
  }
  if (password.length < 4 || password.length > 64) {
    return accountError(domain, "other", "Password should be 4–64 characters");
  }
  try {
    const login = await postApi(
      target.host,
      {
        module: "/users/login",
        merchantId: target.merchantId,
        accessId: "",
        accessToken: "",
        walletIsAdmin: "",
        mobile: phone,
        password,
      },
      signal,
    );
    if (login.status !== "SUCCESS") {
      return classifyFailure(domain, messageOf(login.data), "Could not sign in");
    }
    const session = login.data as { id?: unknown; token?: unknown } | null;
    const accessId = session && typeof session.id === "string" ? session.id : "";
    const accessToken = session && typeof session.token === "string" ? session.token : "";
    if (!accessId || !accessToken) {
      return accountError(domain, "other", "Sign-in did not return a session");
    }
    const synced = await postApi(
      target.host,
      {
        module: "/users/syncData",
        merchantId: target.merchantId,
        accessId,
        accessToken,
        walletIsAdmin: "",
        background: "1",
      },
      signal,
    );
    if (synced.status !== "SUCCESS") {
      return classifyFailure(domain, messageOf(synced.data), "Signed in, but balances did not load");
    }
    const syncedRow = synced.data && typeof synced.data === "object" ? (synced.data as { bonus?: unknown }) : null;
    let promotions: unknown;
    if (!syncedRow || !Array.isArray(syncedRow.bonus)) {
      try {
        const pub = await postApi(
          target.host,
          {
            module: "/merchants/getPublicInfo",
            merchantId: target.merchantId,
            accessId: "",
            accessToken: "",
            walletIsAdmin: "",
          },
          signal,
        );
        const body = pub.data && typeof pub.data === "object" ? (pub.data as { promotions?: unknown }) : null;
        promotions = body?.promotions;
      } catch {
        promotions = undefined;
      }
    }
    return parseSyncUser(domain, synced.data, promotions);
  } catch (error) {
    if (signal?.aborted || (error instanceof DOMException && error.name === "AbortError")) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "";
    return classifyFailure(domain, message, "Could not reach site");
  }
}

export async function fetchAccountsOnDevice(input: {
  domains: string[];
  phone: string;
  password: string;
  signal?: AbortSignal;
  resolve: (domains: string[]) => Promise<CasinoTarget[]>;
}): Promise<AccountRow[]> {
  if (input.signal?.aborted) throw new DOMException("Aborted", "AbortError");
  const targets = await input.resolve(input.domains);
  const out: AccountRow[] = new Array(input.domains.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(3, input.domains.length) }, async () => {
      for (;;) {
        if (input.signal?.aborted) throw new DOMException("Aborted", "AbortError");
        const index = cursor++;
        if (index >= input.domains.length) return;
        const domain = normalizeDomain(input.domains[index] ?? "");
        const target = targets[index];
        if (!target || !target.ok) {
          const code: AccountCode = target && !target.ok ? target.code : "other";
          const message = target && !target.ok ? target.message : "Check failed";
          out[index] = accountError(target?.domain || domain, code, message);
          continue;
        }
        out[index] = await fetchOne(target, input.phone, input.password, input.signal);
      }
    }),
  );
  return out;
}
