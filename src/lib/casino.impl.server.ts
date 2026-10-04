import { isPublicDomain, normalizeDomain } from "@/lib/domain";
import {
  accountError,
  parseSyncUser,
  type AccountRow,
} from "@/lib/parse-account";

const UA =
  "Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36";

export type StatusKind = "live" | "slow" | "dead" | "redirect";

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
  if (text.includes("invalid login")) {
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
    const html = (await home.text()).slice(0, 500_000);
    const merchantId = html.match(/MERCHANTID\s*=\s*(\d+)/)?.[1] ?? "";
    if (!merchantId && !/api\/v1\/index\.php|cdn\.vefrop\.com\/mobile\/wallet\/app\.js/.test(html)) {
      return accountError(domain, "unsupported", "Different login system");
    }

    const login = await postApi(
      host,
      {
        module: "/users/login",
        merchantId,
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
      host,
      {
        module: "/users/syncData",
        merchantId,
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

    return parseSyncUser(domain, synced.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    return classifyFailure(domain, message, "Could not reach site");
  }
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
