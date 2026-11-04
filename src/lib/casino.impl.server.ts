import { isPublicDomain, normalizeDomain } from "@/lib/domain";
import type { CasinoTarget } from "@/lib/casino-target";
import { iconFromHtml } from "@/lib/icon-url";
import { parsePublicPromotions, type CatalogueHit } from "@/lib/public-bonus";
import { accountError, parseSyncUser, type AccountRow } from "@/lib/parse-account";

const UA =
  "Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36";

export type StatusKind = "live" | "slow" | "dead" | "redirect" | "unknown";

type ApiBody = {
  status?: string;
  data?: unknown;
};

function messageOf(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" ? message : "";
}

async function postApi(
  host: string,
  fields: Record<string, string>,
  signal: AbortSignal,
): Promise<ApiBody> {
  const response = await fetch(`https://${host}/api/v1/index.php`, {
    method: "POST",
    redirect: "follow",
    signal,
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      accept: "application/json,text/plain,*/*",
      origin: `https://${host}`,
      referer: `https://${host}/`,
      "user-agent": UA,
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

const iconCache = new Map<string, { url: string; at: number }>();

export async function lookupSiteIcon(rawDomain: string): Promise<string> {
  const domain = normalizeDomain(rawDomain);
  if (!isPublicDomain(domain)) return "";
  const cached = iconCache.get(domain);
  if (cached && Date.now() - cached.at < 86_400_000) return cached.url;
  const url = await readSiteIcon(domain);
  iconCache.set(domain, { url, at: Date.now() });
  return url;
}

async function readSiteIcon(domain: string): Promise<string> {
  try {
    const response = await fetch(`https://${domain}/`, {
      redirect: "follow",
      signal: AbortSignal.timeout(8_000),
      headers: { accept: "text/html", "user-agent": UA },
    });
    if (!response.ok || !response.body) return "";
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let html = "";
    while (html.length < 120_000) {
      const { done, value } = await reader.read();
      if (done) break;
      html += decoder.decode(value, { stream: true });
      if (/<\/head>/i.test(html)) break;
    }
    await reader.cancel().catch(() => undefined);
    return iconFromHtml(html, response.url || `https://${domain}/`);
  } catch {
    return "";
  }
}

export async function inspectCasino(rawDomain: string): Promise<CasinoTarget> {
  const domain = normalizeDomain(rawDomain);
  if (!isPublicDomain(domain)) {
    return { domain: domain || "domain", ok: false, code: "other", message: "Enter a real site domain" };
  }
  const signal = AbortSignal.timeout(18_000);
  try {
    const home = await fetch(`https://${domain}/`, {
      redirect: "follow",
      signal,
      headers: {
        accept: "text/html",
        "user-agent": UA,
      },
    });
    const finalHost = normalizeDomain(new URL(home.url).hostname);
    const host = isPublicDomain(finalHost) ? finalHost : domain;
    const html = (await home.text()).slice(0, 2_000_000);
    const merchantId = html.match(/MERCHANTID\s*=\s*(\d+)/)?.[1] ?? "";
    if (merchantId || /api\/v1\/index\.php|cdn\.vefrop\.com\/mobile\/wallet\/app\.js/.test(html)) {
      return { domain, ok: true, host, merchantId };
    }
    const blocked =
      home.status === 401 ||
      home.status === 403 ||
      home.status === 429 ||
      /just a moment|cf-browser-verification|challenge-platform|attention required/i.test(html);
    if (blocked) return { domain, ok: false, code: "blocked", message: "Page blocked" };
    if (html.trim().length < 400) return { domain, ok: false, code: "empty", message: "Empty page" };
    return { domain, ok: false, code: "unsupported", message: "Different login system" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const row = classifyFailure(domain, message, "Could not reach site");
    if (row.ok) return { domain, ok: false, code: "other", message: "Could not reach site" };
    return { domain, ok: false, code: row.code, message: row.message };
  }
}

export async function resolveCasinoTargets(domains: string[]): Promise<CasinoTarget[]> {
  const out: CasinoTarget[] = new Array(domains.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(6, domains.length) }, async () => {
      for (;;) {
        const i = cursor++;
        if (i >= domains.length) return;
        out[i] = await inspectCasino(domains[i] ?? "");
      }
    }),
  );
  return out;
}

export async function loadPublicCatalogue(rawDomains: string[]): Promise<CatalogueHit[]> {
  const domains = rawDomains.slice(0, 4);
  const targets = await resolveCasinoTargets(domains);
  return Promise.all(
    targets.map(async (target): Promise<CatalogueHit> => {
      if (!target.ok) return { domain: target.domain, ok: false, message: target.message };
      if (!target.merchantId) {
        return { domain: target.domain, ok: false, message: "This site did not publish a bonus list" };
      }
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
          AbortSignal.timeout(18_000),
        );
        if (pub.status !== "SUCCESS") {
          return { domain: target.domain, ok: false, message: "Bonus list did not load" };
        }
        const body = pub.data && typeof pub.data === "object" ? (pub.data as { promotions?: unknown }) : null;
        return { domain: target.domain, ok: true, bonuses: parsePublicPromotions(body?.promotions) };
      } catch {
        return { domain: target.domain, ok: false, message: "Could not reach the bonus list" };
      }
    }),
  );
}

export async function fetchCasinoAccount(input: {
  domain: string;
  phone: string;
  password: string;
}): Promise<AccountRow> {
  const domain = normalizeDomain(input.domain);
  if (!isPublicDomain(domain)) {
    return accountError(domain || "domain", "other", "Enter a real site domain");
  }
  const phone = input.phone.replace(/\s+/g, "");
  const password = input.password;
  if (!/^[0-9+]{6,20}$/.test(phone)) {
    return accountError(domain, "other", "Enter the mobile number you use on these sites");
  }
  if (password.length < 4 || password.length > 64) {
    return accountError(domain, "other", "Password should be 4–64 characters");
  }

  const target = await inspectCasino(domain);
  if (!target.ok) return accountError(target.domain, target.code, target.message);

  const signal = AbortSignal.timeout(18_000);
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
      return classifyFailure(
        domain,
        messageOf(login.data),
        "Could not sign in",
      );
    }

    const session = login.data as { id?: unknown; token?: unknown } | null;
    const accessId = session && typeof session.id === "string" ? session.id : "";
    const accessToken =
      session && typeof session.token === "string" ? session.token : "";
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
      return classifyFailure(
        domain,
        messageOf(synced.data),
        "Signed in, but balances did not load",
      );
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
    const message = error instanceof Error ? error.message : "";
    return classifyFailure(domain, message, "Could not reach site");
  }
}

export async function fetchCasinoBatch(input: {
  domains: string[];
  phone: string;
  password: string;
}): Promise<AccountRow[]> {
  const { domains, phone, password } = input;
  const out: AccountRow[] = new Array(domains.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(6, domains.length) }, async () => {
      for (;;) {
        const i = cursor++;
        if (i >= domains.length) return;
        out[i] = await fetchCasinoAccount({ domain: domains[i] ?? "", phone, password });
      }
    }),
  );
  return out;
}

export async function fetchAllStatuses(): Promise<Record<string, StatusKind>> {
  const response = await fetch("https://intel.bestpokieslist.online/public/statuses", {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(12_000),
  });
  const body: unknown = await response.json();
  const list = Array.isArray(body)
    ? body
    : body && typeof body === "object" && Array.isArray((body as { domains?: unknown }).domains)
      ? (body as { domains: unknown[] }).domains
      : body && typeof body === "object" && Array.isArray((body as { statuses?: unknown }).statuses)
        ? (body as { statuses: unknown[] }).statuses
        : [];
  const map: Record<string, StatusKind> = {};
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const domain = normalizeDomain(String((item as { domain?: unknown }).domain ?? ""));
    if (!isPublicDomain(domain)) continue;
    const raw = String((item as { status?: unknown }).status ?? "").toLowerCase();
    const status: StatusKind =
      raw === "live" || raw === "up" || raw === "ok"
        ? "live"
        : raw === "slow"
          ? "slow"
          : raw === "redirect"
            ? "redirect"
            : raw === "unknown"
              ? "unknown"
              : "dead";
    map[domain] = status;
  }
  return map;
}

export async function checkSiteStatus(rawDomain: string): Promise<{
  domain: string;
  status: StatusKind;
  ms: number;
}> {
  const domain = normalizeDomain(rawDomain);
  if (!isPublicDomain(domain)) {
    return { domain, status: "dead", ms: 0 };
  }
  const started = Date.now();
  try {
    const response = await fetch(`https://${domain}/`, {
      method: "GET",
      redirect: "manual",
      signal: AbortSignal.timeout(7_000),
      headers: {
        accept: "text/html",
        "user-agent": UA,
      },
    });
    await response.body?.cancel();
    const ms = Date.now() - started;
    if (response.status >= 300 && response.status < 400) {
      return { domain, status: "redirect", ms };
    }
    if (response.status >= 200 && response.status < 400) {
      return { domain, status: ms > 2800 ? "slow" : "live", ms };
    }
    return { domain, status: "dead", ms };
  } catch {
    return { domain, status: "dead", ms: Date.now() - started };
  }
}
