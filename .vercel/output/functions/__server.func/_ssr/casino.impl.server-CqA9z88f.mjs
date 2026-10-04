import { n as normalizeDomain, t as isPublicDomain } from "./domain-CILCWuBu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/casino.impl.server-CqA9z88f.js
function num(value) {
	if (value == null || value === "") return null;
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : null;
}
function cleanName(value) {
	return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&/gi, "&").replace(/&#39;|'/gi, "'").replace(/"/gi, "\"").replace(/\s+/g, " ").trim();
}
function moneyCompact(amount) {
	const rounded = Math.round(amount * 100) / 100;
	return Number.isInteger(rounded) ? `$${rounded}` : `$${rounded.toFixed(2)}`;
}
function categoryOf(name, custom) {
	const c = custom.toLowerCase();
	const n = name.toLowerCase();
	if (c.includes("share")) return "share";
	if (c.includes("commission")) return "commission";
	if (c.includes("rebate")) return "rebate";
	if (c.includes("refer") || c.includes("downline") || c.includes("invite")) return "referral";
	if (c.includes("welcome") || c.includes("signup") || c.includes("newmember")) return "new";
	if (n.includes("commission")) return "commission";
	if (n.includes("share")) return "share";
	if (n.includes("rebate") || n.includes("cashback") || n.includes("cash back")) return "rebate";
	if (n.includes("refer") || n.includes("invite") || n.includes("downline") || n.includes("mate")) return "referral";
	if (n.includes("welcome") || n.includes("sign up") || n.includes("signup") || n.includes("new member")) return "new";
	return null;
}
function asRecord(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	return value;
}
function parseClaimConfig(value) {
	if (typeof value === "string") try {
		return asRecord(JSON.parse(value)) ?? {};
	} catch {
		return {};
	}
	return asRecord(value) ?? {};
}
function parseSyncUser(domain, user) {
	const row = asRecord(user) ?? {};
	const wallets = [];
	const walletRaw = Array.isArray(row.wallet) ? row.wallet : [];
	for (const item of walletRaw) {
		const wallet = asRecord(item);
		if (!wallet) continue;
		wallets.push({
			id: String(wallet.id ?? ""),
			name: cleanName(String(wallet.name ?? "Balance")) || "Balance",
			balance: num(wallet.balance) ?? 0
		});
	}
	let cash = num(row.cash) ?? 0;
	let cashWalletName = "Balance";
	for (const wallet of wallets) if (wallet.balance > .001) {
		cash = wallet.balance;
		cashWalletName = wallet.name;
	}
	const minRaw = num(row.minWithdraw);
	const maxRaw = num(row.maxWithdraw);
	const cashMinWithdrawal = minRaw != null && minRaw > 0 ? minRaw : null;
	const cashMaxWithdrawal = maxRaw != null && maxRaw > 0 ? maxRaw : null;
	const taken = asRecord(row.timebonus) ?? {};
	const buckets = {
		commission: [],
		share: [],
		referral: [],
		new: [],
		rebate: []
	};
	const availableBonuses = [];
	const bonusRaw = Array.isArray(row.bonus) ? row.bonus : [];
	for (const item of bonusRaw) {
		const bonus = asRecord(item);
		if (!bonus) continue;
		const id = String(bonus.id ?? "");
		const maxRound = num(bonus.maxRound) ?? 0;
		const used = num(taken[id]) ?? 0;
		if (maxRound > 0 && used >= maxRound) continue;
		const cfg = parseClaimConfig(bonus.claimConfig);
		const creditLess = num(cfg.creditLessThan);
		if (creditLess != null && creditLess > 0 && cash >= creditLess) continue;
		const name = cleanName(String(bonus.name ?? "Bonus")) || "Bonus";
		const custom = String(cfg.customBonus ?? "");
		const fixed = num(bonus.bonusFixed) ?? 0;
		const percent = num(bonus.bonus) ?? 0;
		const random = asRecord(bonus.bonusRandom);
		const rmin = random ? num(random.min) : null;
		const rmax = random ? num(random.max) : null;
		const rolloverRaw = num(bonus.rollover);
		const rollover = rolloverRaw != null && rolloverRaw > 0 ? rolloverRaw : null;
		let amount = 0;
		let amountDisplay = "";
		let isPercent = false;
		if (fixed > 0) {
			amount = fixed;
			amountDisplay = moneyCompact(fixed);
		} else if (rmin != null && rmax != null && rmax > 0) {
			amount = rmax;
			amountDisplay = `${moneyCompact(rmin)}–${moneyCompact(rmax)}`;
		} else if (percent > 0) {
			amount = 0;
			amountDisplay = `${percent % 1 === 0 ? percent : percent.toFixed(0)}% match`;
			isPercent = true;
		} else continue;
		const view = {
			name,
			amount,
			amountDisplay,
			minWithdrawal: num(cfg.minWithdraw) ?? num(cfg.minWithdrawal),
			maxWithdrawal: num(cfg.maxWithdraw) ?? num(cfg.maxWithdrawal),
			rollover,
			percent: isPercent
		};
		availableBonuses.push(view);
		const key = categoryOf(name, custom);
		if (key) buckets[key].push(view);
	}
	availableBonuses.sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name));
	const pick = (list) => {
		if (!list.length) return null;
		const dollars = list.filter((item) => !item.percent);
		return [...dollars.length ? dollars : list].sort((a, b) => b.amount - a.amount)[0] ?? null;
	};
	const commission = pick(buckets.commission);
	const share = pick(buckets.share);
	const referral = pick(buckets.referral);
	const fresh = pick(buckets.new);
	const rebate = pick(buckets.rebate);
	return {
		domain,
		ok: true,
		hasData: Boolean(cash > .001 || commission || share || referral || fresh || rebate || availableBonuses.length),
		cash,
		cashWalletName,
		cashMinWithdrawal,
		cashMaxWithdrawal,
		wallets,
		commission,
		share,
		referral,
		new: fresh,
		rebate,
		availableBonuses
	};
}
function accountError(domain, code, message) {
	return {
		domain,
		ok: false,
		code,
		message
	};
}
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
	if (text.includes("invalid login")) return accountError(domain, "invalid_login", "Not your account");
	if (text.includes("captcha")) return accountError(domain, "captcha", "Site asked for a captcha");
	if (text.includes("bad-json")) return accountError(domain, "unreachable", "Site did not return account data");
	if (text.includes("abort") || text.includes("timeout")) return accountError(domain, "timeout", "Timed out");
	return accountError(domain, "other", fallback);
}
async function fetchCasinoAccount(input) {
	const domain = normalizeDomain(input.domain);
	if (!isPublicDomain(domain)) return accountError(domain || "domain", "other", "Enter a real site domain");
	const phone = input.phone.replace(/\s+/g, "");
	const password = input.password;
	if (!/^[0-9+]{6,20}$/.test(phone)) return accountError(domain, "other", "Enter the mobile number you use on these sites");
	if (password.length < 4 || password.length > 64) return accountError(domain, "other", "Password should be 4–64 characters");
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
		const html = (await home.text()).slice(0, 5e5);
		const merchantId = html.match(/MERCHANTID\s*=\s*(\d+)/)?.[1] ?? "";
		if (!merchantId && !/api\/v1\/index\.php|cdn\.vefrop\.com\/mobile\/wallet\/app\.js/.test(html)) return accountError(domain, "unsupported", "Different login system");
		const login = await postApi(host, {
			module: "/users/login",
			merchantId,
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
		const synced = await postApi(host, {
			module: "/users/syncData",
			merchantId,
			accessId,
			accessToken,
			walletIsAdmin: "",
			background: "1"
		}, signal);
		if (synced.status !== "SUCCESS") return classifyFailure(domain, messageOf(synced.data), "Signed in, but balances did not load");
		return parseSyncUser(domain, synced.data);
	} catch (error) {
		return classifyFailure(domain, error instanceof Error ? error.message : "", "Could not reach site");
	}
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
export { checkSiteStatus, fetchCasinoAccount };
