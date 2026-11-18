//#region node_modules/.nitro/vite/services/ssr/assets/public-bonus-COQM9xVb.js
function num(value) {
	if (value == null || value === "") return null;
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : null;
}
function cleanName(value) {
	return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
}
function moneyCompact(amount) {
	const rounded = Math.round(amount * 100) / 100;
	return Number.isInteger(rounded) ? `$${rounded}` : `$${rounded.toFixed(2)}`;
}
function asRecord(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	return value;
}
function claimConfig(value) {
	if (typeof value === "string") try {
		return asRecord(JSON.parse(value)) ?? {};
	} catch {
		return {};
	}
	return asRecord(value) ?? {};
}
function slotOf(name, custom) {
	const text = `${name} ${custom}`.toLowerCase();
	if (/birth|b-?day/.test(text)) return "birthday";
	if (/share|refer|invite|downline/.test(text)) return "share";
	if (/\bdaily\b|every day/.test(text)) return "daily";
	if (/sign\s?up|register|no deposit|welcome/.test(text)) return "signup";
	return "other";
}
function randomRange(value) {
	const row = typeof value === "string" ? asRecord(JSON.parse(value)) : asRecord(value);
	if (!row) return null;
	const min = num(row.min);
	const max = num(row.max);
	if (min == null || max == null) return null;
	return {
		min,
		max
	};
}
function parsePublicPromotions(raw) {
	if (!Array.isArray(raw)) return [];
	const out = [];
	for (const item of raw) {
		const row = asRecord(item);
		if (!row) continue;
		const name = cleanName(String(row.name ?? ""));
		if (!name) continue;
		const custom = String(claimConfig(row.claimConfig).customBonus ?? "");
		const fixed = num(row.bonusFixed) ?? 0;
		const percent = num(row.bonus) ?? 0;
		let range = null;
		try {
			range = randomRange(row.bonusRandom);
		} catch {
			range = null;
		}
		let kind = "unset";
		let amount = 0;
		let amountDisplay = "—";
		if (fixed > 0) {
			kind = "fixed";
			amount = fixed;
			amountDisplay = moneyCompact(fixed);
		} else if (percent > 0) {
			kind = "percent";
			amount = percent;
			amountDisplay = `${Number.isInteger(percent) ? percent : percent.toFixed(2)}%`;
		} else if (range && (range.min > 0 || range.max > 0)) {
			kind = "random";
			amount = range.max;
			amountDisplay = `${moneyCompact(range.min)}–${moneyCompact(range.max)}`;
		}
		const minWithdraw = num(row.minWithdraw);
		const maxWithdraw = num(row.maxWithdraw);
		const rollover = num(row.rollover);
		const minDeposit = num(row.minTopup);
		out.push({
			id: String(row.id ?? name),
			name,
			slot: slotOf(name, custom),
			kind,
			amount,
			amountDisplay,
			minWithdraw: minWithdraw != null && minWithdraw > 0 ? minWithdraw : null,
			maxWithdraw: maxWithdraw != null && maxWithdraw > 0 ? maxWithdraw : null,
			rollover: rollover != null && rollover > 0 ? rollover : null,
			minDeposit: minDeposit != null && minDeposit > 0 ? minDeposit : null
		});
	}
	return out;
}
function rank(bonus) {
	if (bonus.kind === "fixed") return 3e6 + bonus.amount;
	if (bonus.kind === "percent") return 2e6 + bonus.amount;
	if (bonus.kind === "random") return 1e6 + bonus.amount;
	return 0;
}
function bestBonus(bonuses, slot) {
	const matches = bonuses.filter((bonus) => bonus.slot === slot);
	if (!matches.length) return null;
	return [...matches].sort((a, b) => rank(b) - rank(a))[0] ?? null;
}
//#endregion
export { parsePublicPromotions as n, bestBonus as t };
