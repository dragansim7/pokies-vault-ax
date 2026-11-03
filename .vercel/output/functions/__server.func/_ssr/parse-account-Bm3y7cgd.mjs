//#region node_modules/.nitro/vite/services/ssr/assets/parse-account-Bm3y7cgd.js
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
function intId(value) {
	const n = parseInt(String(value ?? "0"), 10);
	return Number.isFinite(n) ? n : 0;
}
function holdsAmount(value) {
	if (value === 0 || value === "0") return true;
	if (value == null || value === "") return false;
	if (typeof value === "number") return Number.isFinite(value);
	if (typeof value === "string") return value.trim() !== "" && Number.isFinite(Number(value));
	return false;
}
function matchKey(bonus) {
	return `${intId(bonus.id)}:${intId(bonus.transactionId)}:${intId(bonus.angpaoId)}:${intId(bonus.luckyId)}`;
}
function inWindow(bonus, now) {
	const start = Date.parse(String(bonus.startDateTime ?? ""));
	const end = Date.parse(String(bonus.endDateTime ?? ""));
	if (Number.isFinite(start) && now < start) return false;
	if (Number.isFinite(end) && now > end) return false;
	return true;
}
function claimDisplay(bonus) {
	if (parseInt(String(bonus.displayAmount ?? ""), 10) === 0) return {
		amount: num(bonus.amount) ?? 0,
		amountDisplay: "?"
	};
	const amount = num(bonus.amount) ?? 0;
	if (amount) return {
		amount,
		amountDisplay: moneyCompact(amount)
	};
	return {
		amount: 0,
		amountDisplay: "?"
	};
}
function periodOf(reset) {
	if (reset === "DAILY") return "day";
	if (reset === "WEEKLY") return "week";
	if (reset === "MONTHLY") return "month";
	return "hour";
}
function detailOf(bonus, cfg) {
	if (parseInt(String(cfg.displayDescriptionOnly ?? ""), 10)) return "";
	const parts = [];
	const turnover = num(bonus.minBet);
	if (turnover != null && turnover >= .01) parts.push(`Turnover ${moneyCompact(turnover)}`);
	const hideMin = parseInt(String(cfg.minWithdrawTimeAmount ?? ""), 10);
	const minWithdraw = num(bonus.minWithdraw);
	if (!hideMin && minWithdraw != null && minWithdraw >= .01) parts.push(`Min ${moneyCompact(minWithdraw)}`);
	const maxWithdraw = num(bonus.maxWithdraw);
	if (maxWithdraw != null && maxWithdraw >= .01) {
		const angpao = String(bonus.transactionType ?? "").toUpperCase() === "ANGPAO" && maxWithdraw < 1;
		parts.push(`Max ${angpao ? `${Math.round(maxWithdraw * 100)}%` : moneyCompact(maxWithdraw)}`);
	}
	const minTop = num(bonus.minTopup);
	const maxTop = num(bonus.maxTopup);
	if (minTop && maxTop) parts.push(`Deposit ${moneyCompact(minTop)}–${moneyCompact(maxTop)}`);
	else if (minTop) parts.push(`Min deposit ${moneyCompact(minTop)}`);
	else if (maxTop) parts.push(`Max deposit ${moneyCompact(maxTop)}`);
	const minRound = num(bonus.minRound);
	if (minRound != null && minRound > 0) parts.push(`Deposits ${minRound}`);
	const maxRound = num(bonus.maxRound);
	const reset = String(bonus.reset ?? "");
	if (maxRound && reset) parts.push(`Limited to ${String(maxRound)} claim per ${periodOf(reset)}`);
	if (bonus.startDateTime || bonus.endDateTime) {
		const from = bonus.startDateTime ? String(bonus.startDateTime) : "—";
		const to = bonus.endDateTime ? String(bonus.endDateTime) : "—";
		parts.push(`${from} – ${to}`);
	}
	return parts.join(" · ");
}
function visiblePacket(bonus, cfg) {
	const tx = String(bonus.transactionType ?? "").toUpperCase();
	const name = cleanName(String(bonus.name ?? ""));
	if (tx === "REBATE" || tx === "COMMISSION" || tx === "ANGPAO" || name === "Lucky Draw") return true;
	if (parseInt(String(cfg.showIfAmount ?? ""), 10) === 1 && !bonus.amount) return false;
	return true;
}
function promoSection(bonus) {
	const tx = String(bonus.transactionType ?? "").toUpperCase();
	if (tx === "REBATE") return "rebate";
	if (tx === "COMMISSION") return "commission";
	const cfg = parseClaimConfig(bonus.claimConfig);
	const custom = String(cfg.customBonus ?? "");
	const name = cleanName(String(bonus.name ?? ""));
	const key = categoryOf(name, custom);
	if (key === "rebate") return "rebate";
	if (!key && /cash ?back/i.test(`${custom} ${name}`)) return "rebate";
	if (key === "commission") return "commission";
	if (key === "share" || key === "referral") return "referral";
	return "other";
}
function promoBoxesFrom(bonusRaw) {
	let rebate = 0;
	let commission = 0;
	let referral = 0;
	const others = [];
	for (const item of bonusRaw) {
		const bonus = asRecord(item);
		if (!bonus) continue;
		const amount = num(bonus.amount);
		if (!holdsAmount(bonus.amount) || amount == null || amount <= 0) continue;
		const section = promoSection(bonus);
		if (section === "rebate") rebate += amount;
		else if (section === "commission") commission += amount;
		else if (section === "referral") referral += amount;
		else others.push({
			label: cleanName(String(bonus.name ?? "")) || "Bonus",
			amount
		});
	}
	const boxes = [];
	if (rebate > 0) boxes.push({
		label: "Rebate",
		amount: Math.round(rebate * 100) / 100
	});
	if (commission > 0) boxes.push({
		label: "Commission",
		amount: Math.round(commission * 100) / 100
	});
	if (referral > 0) boxes.push({
		label: "Referral / Downline Share Bonus",
		amount: Math.round(referral * 100) / 100
	});
	boxes.push(...others);
	return boxes;
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
function parseSyncUser(domain, user, promotions) {
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
	const buckets = {
		commission: [],
		share: [],
		referral: [],
		new: [],
		rebate: []
	};
	const availableBonuses = [];
	const accountPackets = Array.isArray(row.bonus) ? row.bonus : null;
	const packets = accountPackets ?? (Array.isArray(promotions) ? promotions : []);
	const accountBound = accountPackets != null;
	const seen = /* @__PURE__ */ new Set();
	const now = Date.now();
	for (const item of packets) {
		const bonus = asRecord(item);
		if (!bonus) continue;
		const key = matchKey(bonus);
		if (seen.has(key)) continue;
		seen.add(key);
		const cfg = parseClaimConfig(bonus.claimConfig);
		if (!visiblePacket(bonus, cfg)) continue;
		const lit = accountBound && holdsAmount(bonus.amount) && inWindow(bonus, now);
		const shown = lit ? claimDisplay(bonus) : {
			amount: 0,
			amountDisplay: ""
		};
		const hideMin = parseInt(String(cfg.minWithdrawTimeAmount ?? ""), 10);
		const minWithdraw = num(bonus.minWithdraw);
		const maxWithdraw = num(bonus.maxWithdraw);
		const turnover = num(bonus.minBet);
		const angpao = String(bonus.transactionType ?? "").toUpperCase() === "ANGPAO" && maxWithdraw != null && maxWithdraw < 1;
		const name = cleanName(String(bonus.name ?? "Bonus")) || "Bonus";
		const view = {
			name,
			amount: shown.amount,
			amountDisplay: shown.amountDisplay,
			minWithdrawal: !hideMin && minWithdraw != null && minWithdraw >= .01 ? minWithdraw : null,
			maxWithdrawal: maxWithdraw != null && maxWithdraw >= .01 ? maxWithdraw : null,
			maxDisplay: maxWithdraw != null && maxWithdraw >= .01 ? angpao ? `${Math.round(maxWithdraw * 100)}%` : moneyCompact(maxWithdraw) : null,
			rollover: turnover != null && turnover >= .01 ? turnover : null,
			percent: false,
			lit,
			id: intId(bonus.id),
			transactionId: intId(bonus.transactionId),
			angpaoId: intId(bonus.angpaoId),
			luckyId: intId(bonus.luckyId),
			host: domain,
			detail: detailOf(bonus, cfg)
		};
		availableBonuses.push(view);
		if (!lit) continue;
		const category = categoryOf(name, String(cfg.customBonus ?? ""));
		if (category) buckets[category].push(view);
	}
	availableBonuses.sort((a, b) => Number(b.lit) - Number(a.lit) || b.amount - a.amount || a.name.localeCompare(b.name));
	const pick = (list) => {
		const lit = list.filter((item) => item.lit);
		if (!lit.length) return null;
		return [...lit].sort((a, b) => b.amount - a.amount)[0] ?? null;
	};
	const commission = pick(buckets.commission);
	const share = pick(buckets.share);
	const referral = pick(buckets.referral);
	const fresh = pick(buckets.new);
	const rebate = pick(buckets.rebate);
	const promoBoxes = promoBoxesFrom(packets.filter((item) => {
		const bonus = asRecord(item);
		return Boolean(bonus && accountBound && holdsAmount(bonus.amount) && inWindow(bonus, now));
	}));
	const unclaimed = availableBonuses.some((bonus) => bonus.lit);
	return {
		domain,
		ok: true,
		hasData: Boolean(wallets.some((wallet) => wallet.balance > .001) || cash > .001 || unclaimed || promoBoxes.length),
		unclaimed,
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
		availableBonuses,
		promoBoxes
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
//#endregion
export { parseSyncUser as n, accountError as t };
