import { n as normalizeDomain, t as isPublicDomain } from "./domain-CILCWuBu.mjs";
import { n as parseSyncUser, t as accountError } from "./parse-account-Bm3y7cgd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/casino.impl.server-CWmf-w80.js
var UA = "Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36";
function messageOf(data) {
	if (!data || typeof data !== "object") return "";
	const message = data.message;
	return typeof message === "string" ? message : "";
}
async function postApi(host, fields, signal) {
	const text = await (await fetch(`https://${host}/api/v1/index.php`, {
		method: "POST",
		redirect: "follow",
		signal,
		headers: {
			"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
			accept: "application/json,text/plain,*/*",
			origin: `https://${host}`,
			referer: `https://${host}/`,
			"user-agent": UA
		},
		body: new URLSearchParams(fields)
	})).text();
	try {
		return JSON.parse(text);
	} catch {
		throw new Error("bad-json");
	}
}
function classifyFailure(domain, message, fallback) {
	const text = message.toLowerCase();
	if (text.includes("invalid login") || text.includes("invalid password")) return accountError(domain, "invalid_login", "Not your account");
	if (text.includes("captcha")) return accountError(domain, "captcha", "Site asked for a captcha");
	if (text.includes("bad-json")) return accountError(domain, "unreachable", "Site did not return account data");
	if (text.includes("abort") || text.includes("timeout")) return accountError(domain, "timeout", "Timed out");
	return accountError(domain, "other", fallback);
}
async function inspectCasino(rawDomain) {
	const domain = normalizeDomain(rawDomain);
	if (!isPublicDomain(domain)) return {
		domain: domain || "domain",
		ok: false,
		code: "other",
		message: "Enter a real site domain"
	};
	const signal = AbortSignal.timeout(18e3);
	try {
		const home = await fetch(`https://${domain}/`, {
			redirect: "follow",
			signal,
			headers: {
				accept: "text/html",
				"user-agent": UA
			}
		});
		const finalHost = normalizeDomain(new URL(home.url).hostname);
		const host = isPublicDomain(finalHost) ? finalHost : domain;
		const html = (await home.text()).slice(0, 2e6);
		const merchantId = html.match(/MERCHANTID\s*=\s*(\d+)/)?.[1] ?? "";
		if (merchantId || /api\/v1\/index\.php|cdn\.vefrop\.com\/mobile\/wallet\/app\.js/.test(html)) return {
			domain,
			ok: true,
			host,
			merchantId
		};
		if (home.status === 401 || home.status === 403 || home.status === 429 || /just a moment|cf-browser-verification|challenge-platform|attention required/i.test(html)) return {
			domain,
			ok: false,
			code: "blocked",
			message: "Page blocked"
		};
		if (html.trim().length < 400) return {
			domain,
			ok: false,
			code: "empty",
			message: "Empty page"
		};
		return {
			domain,
			ok: false,
			code: "unsupported",
			message: "Different login system"
		};
	} catch (error) {
		const row = classifyFailure(domain, error instanceof Error ? error.message : "", "Could not reach site");
		if (row.ok) return {
			domain,
			ok: false,
			code: "other",
			message: "Could not reach site"
		};
		return {
			domain,
			ok: false,
			code: row.code,
			message: row.message
		};
	}
}
async function resolveCasinoTargets(domains) {
	const out = new Array(domains.length);
	let cursor = 0;
	await Promise.all(Array.from({ length: Math.min(6, domains.length) }, async () => {
		for (;;) {
			const i = cursor++;
			if (i >= domains.length) return;
			out[i] = await inspectCasino(domains[i] ?? "");
		}
	}));
	return out;
}
async function fetchCasinoAccount(input) {
	const domain = normalizeDomain(input.domain);
	if (!isPublicDomain(domain)) return accountError(domain || "domain", "other", "Enter a real site domain");
	const phone = input.phone.replace(/\s+/g, "");
	const password = input.password;
	if (!/^[0-9+]{6,20}$/.test(phone)) return accountError(domain, "other", "Enter the mobile number you use on these sites");
	if (password.length < 4 || password.length > 64) return accountError(domain, "other", "Password should be 4–64 characters");
	const target = await inspectCasino(domain);
	if (!target.ok) return accountError(target.domain, target.code, target.message);
	const signal = AbortSignal.timeout(18e3);
	try {
		const login = await postApi(target.host, {
			module: "/users/login",
			merchantId: target.merchantId,
			accessId: "",
			accessToken: "",
			walletIsAdmin: "",
			mobile: phone,
			password
		}, signal);
		if (login.status !== "SUCCESS") return classifyFailure(domain, messageOf(login.data), "Could not sign in");
		const session = login.data;
		const accessId = session && typeof session.id === "string" ? session.id : "";
		const accessToken = session && typeof session.token === "string" ? session.token : "";
		if (!accessId || !accessToken) return accountError(domain, "other", "Sign-in did not return a session");
		const synced = await postApi(target.host, {
			module: "/users/syncData",
			merchantId: target.merchantId,
			accessId,
			accessToken,
			walletIsAdmin: "",
			background: "1"
		}, signal);
		if (synced.status !== "SUCCESS") return classifyFailure(domain, messageOf(synced.data), "Signed in, but balances did not load");
		const syncedRow = synced.data && typeof synced.data === "object" ? synced.data : null;
		let promotions;
		if (!syncedRow || !Array.isArray(syncedRow.bonus)) try {
			const pub = await postApi(target.host, {
				module: "/merchants/getPublicInfo",
				merchantId: target.merchantId,
				accessId: "",
				accessToken: "",
				walletIsAdmin: ""
			}, signal);
			promotions = (pub.data && typeof pub.data === "object" ? pub.data : null)?.promotions;
		} catch {
			promotions = void 0;
		}
		return parseSyncUser(domain, synced.data, promotions);
	} catch (error) {
		return classifyFailure(domain, error instanceof Error ? error.message : "", "Could not reach site");
	}
}
async function fetchCasinoBatch(input) {
	const { domains, phone, password } = input;
	const out = new Array(domains.length);
	let cursor = 0;
	await Promise.all(Array.from({ length: Math.min(6, domains.length) }, async () => {
		for (;;) {
			const i = cursor++;
			if (i >= domains.length) return;
			out[i] = await fetchCasinoAccount({
				domain: domains[i] ?? "",
				phone,
				password
			});
		}
	}));
	return out;
}
async function fetchAllStatuses() {
	const body = await (await fetch("https://intel.bestpokieslist.online/public/statuses", {
		headers: { accept: "application/json" },
		signal: AbortSignal.timeout(12e3)
	})).json();
	const list = Array.isArray(body) ? body : body && typeof body === "object" && Array.isArray(body.domains) ? body.domains : body && typeof body === "object" && Array.isArray(body.statuses) ? body.statuses : [];
	const map = {};
	for (const item of list) {
		if (!item || typeof item !== "object") continue;
		const domain = normalizeDomain(String(item.domain ?? ""));
		if (!isPublicDomain(domain)) continue;
		const raw = String(item.status ?? "").toLowerCase();
		map[domain] = raw === "live" || raw === "up" || raw === "ok" ? "live" : raw === "slow" ? "slow" : raw === "redirect" ? "redirect" : raw === "unknown" ? "unknown" : "dead";
	}
	return map;
}
async function checkSiteStatus(rawDomain) {
	const domain = normalizeDomain(rawDomain);
	if (!isPublicDomain(domain)) return {
		domain,
		status: "dead",
		ms: 0
	};
	const started = Date.now();
	try {
		const response = await fetch(`https://${domain}/`, {
			method: "GET",
			redirect: "manual",
			signal: AbortSignal.timeout(7e3),
			headers: {
				accept: "text/html",
				"user-agent": UA
			}
		});
		await response.body?.cancel();
		const ms = Date.now() - started;
		if (response.status >= 300 && response.status < 400) return {
			domain,
			status: "redirect",
			ms
		};
		if (response.status >= 200 && response.status < 400) return {
			domain,
			status: ms > 2800 ? "slow" : "live",
			ms
		};
		return {
			domain,
			status: "dead",
			ms
		};
	} catch {
		return {
			domain,
			status: "dead",
			ms: Date.now() - started
		};
	}
}
//#endregion
export { checkSiteStatus, fetchAllStatuses, fetchCasinoAccount, fetchCasinoBatch, resolveCasinoTargets };
