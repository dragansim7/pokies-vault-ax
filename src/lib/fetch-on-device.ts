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

const CALL_MS = 18_000;

function callSignal(signal?: AbortSignal): { signal: AbortSignal; timedOut: () => boolean } {
  const timeout = AbortSignal.timeout(CALL_MS);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
  return { signal: combined, timedOut: () => timeout.aborted && !signal?.aborted };
}

async function postApi(
  host: string,
  fields: Record<string, string>,
  signal?: AbortSignal,
): Promise<ApiBody> {
  const timed = callSignal(signal);
  let response: Response;
  try {
    response = await fetch(`https://${host}/api/v1/index.php`, {
      method: "POST",
      signal: timed.signal,
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        accept: "application/json,text/plain,*/*",
      },
      body: new URLSearchParams(fields),
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    if (timed.timedOut()) throw new Error("timeout");
    throw error;
  }
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
  knownPromotions?: unknown,
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
    let promotions = knownPromotions;
    if (!syncedRow || !Array.isArray(syncedRow.bonus)) {
      if (promotions === undefined) {
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

async function probeSite(
  domain: string,
  signal?: AbortSignal,
): Promise<{ ok: true; promotions?: unknown } | { ok: false; code: AccountCode; message: string }> {
  let response: Response;
  const timed = callSignal(signal);
  try {
    response = await fetch(`https://${domain}/api/v1/index.php`, {
      method: "POST",
      signal: timed.signal,
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        accept: "application/json,text/plain,*/*",
      },
      body: new URLSearchParams({
        module: "/merchants/getPublicInfo",
        merchantId: "",
        accessId: "",
        accessToken: "",
        walletIsAdmin: "",
      }),
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    if (timed.timedOut() || message.includes("timeout") || message.includes("abort")) {
      return { ok: false, code: "timeout", message: "Timed out" };
    }
    return { ok: false, code: "unreachable", message: "Could not reach site" };
  }
  const text = await response.text();
  const trimmed = text.trim();
  if (
    response.status === 401 ||
    response.status === 403 ||
    response.status === 429 ||
    /just a moment|cf-browser-verification|challenge-platform|attention required/i.test(trimmed)
  ) {
    return { ok: false, code: "blocked", message: "Page blocked" };
  }
  let body: ApiBody | null = null;
  try {
    const parsed = JSON.parse(trimmed) as ApiBody;
    if (parsed && (parsed.status === "SUCCESS" || parsed.status === "ERROR")) body = parsed;
  } catch {
    body = null;
  }
  if (!body) return { ok: false, code: "unsupported", message: "Different login system" };
  if (body.status === "SUCCESS") {
    const data = body.data && typeof body.data === "object" ? (body.data as { promotions?: unknown }) : null;
    return { ok: true, promotions: data?.promotions };
  }
  const message = messageOf(body.data).toLowerCase();
  if (message.includes("captcha")) return { ok: false, code: "captcha", message: "Site asked for a captcha" };
  return { ok: true };
}
export async function fetchAccountOnDevice(input: {
  domain: string;
  phone: string;
  password: string;
  signal?: AbortSignal;
  knownSystem?: boolean;
}): Promise<{ row: AccountRow; confirmed: boolean }> {
  const domain = normalizeDomain(input.domain);
  let promotions: unknown;
  if (!input.knownSystem) {
    const probed = await probeSite(domain, input.signal);
    if (!probed.ok) return { row: accountError(domain, probed.code, probed.message), confirmed: false };
    promotions = probed.promotions;
  }
  return {
    row: await fetchOne(
      { domain, ok: true, host: domain, merchantId: "" },
      input.phone,
      input.password,
      input.signal,
      promotions,
    ),
    confirmed: true,
  };
}

export async function fetchAccountsOnDevice(input: {
  domains: string[];
  phone: string;
  password: string;
  signal?: AbortSignal;
}): Promise<AccountRow[]> {
  if (input.signal?.aborted) throw new DOMException("Aborted", "AbortError");
  const out: AccountRow[] = new Array(input.domains.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(3, input.domains.length) }, async () => {
      for (;;) {
        if (input.signal?.aborted) throw new DOMException("Aborted", "AbortError");
        const index = cursor++;
        if (index >= input.domains.length) return;
        const domain = normalizeDomain(input.domains[index] ?? "");
        const probed = await probeSite(domain, input.signal);
        if (!probed.ok) {
          out[index] = accountError(domain, probed.code, probed.message);
          continue;
        }
        out[index] = await fetchOne(
          { domain, ok: true, host: domain, merchantId: "" },
          input.phone,
          input.password,
          input.signal,
        );
      }
    }),
  );
  return out;
}
