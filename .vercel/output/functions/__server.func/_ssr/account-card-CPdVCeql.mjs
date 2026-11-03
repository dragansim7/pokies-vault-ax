import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as ChevronUp, b as Bookmark, s as Star, y as ChevronDown } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-card-CPdVCeql.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SiteIcon({ domain }) {
	const [src, setSrc] = (0, import_react.useState)(`https://intel.bestpokieslist.online/favicon/${domain}`);
	(0, import_react.useEffect)(() => setSrc(`https://intel.bestpokieslist.online/favicon/${domain}`), [domain]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		className: "site-icon",
		src,
		alt: "",
		referrerPolicy: "no-referrer",
		loading: "lazy",
		decoding: "async",
		onError: () => setSrc((current) => current === "/site-fallback.jpg" ? current : "/site-fallback.jpg")
	});
}
function money(amount) {
	const value = Number(amount ?? 0);
	if (!Number.isFinite(value)) return "$0.00";
	return new Intl.NumberFormat("en-AU", {
		style: "currency",
		currency: "AUD",
		maximumFractionDigits: 2
	}).format(value);
}
function moneyShort(amount) {
	const value = Number(amount ?? 0);
	if (!Number.isFinite(value)) return "$0";
	const rounded = Math.round(value * 100) / 100;
	if (Number.isInteger(rounded)) return `$${rounded.toLocaleString("en-AU")}`;
	return `$${rounded.toLocaleString("en-AU", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})}`;
}
function timeAgo(value) {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	const minutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 6e4));
	if (minutes < 1) return "just now";
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.round(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.round(hours / 24);
	if (days < 30) return `${days}d ago`;
	const months = Math.round(days / 30);
	if (months < 12) return `${months}mo ago`;
	return `${Math.round(days / 365)}y ago`;
}
function formatAdded(value) {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return `${new Intl.DateTimeFormat("en-AU", {
		timeZone: "Australia/Melbourne",
		day: "2-digit",
		month: "2-digit",
		year: "numeric"
	}).format(date)} · ${new Intl.DateTimeFormat("en-AU", {
		timeZone: "Australia/Melbourne",
		hour: "numeric",
		minute: "2-digit",
		hour12: true
	}).format(date)}`;
}
var STATUS_LABEL = {
	checking: "Checking",
	live: "Live",
	slow: "Slow",
	redirect: "Redirect",
	dead: "Down",
	unknown: "Unknown"
};
var CHIPS = [
	{
		key: "commission",
		label: "COM",
		bet: true
	},
	{
		key: "share",
		label: "SHARE",
		bet: false
	},
	{
		key: "referral",
		label: "REF",
		bet: false
	},
	{
		key: "new",
		label: "NEW",
		bet: false
	},
	{
		key: "rebate",
		label: "REBATE",
		bet: false
	}
];
function walletOf(account) {
	if (!account) return 0;
	const held = account.wallets.filter((wallet) => wallet.balance > .001);
	if (held.length) return held.reduce((sum, wallet) => sum + wallet.balance, 0);
	return account.cash > .001 ? account.cash : 0;
}
function chipLine(bonus, bet) {
	const max = bonus?.maxDisplay ?? "—";
	if (bet) return `Bet ${bonus?.rollover != null && bonus.rollover > 0 ? moneyShort(bonus.rollover) : "—"} ↑ ${max}`;
	return `↓ ${bonus?.minWithdrawal != null && bonus.minWithdrawal > 0 ? moneyShort(bonus.minWithdrawal) : "—"} ↑ ${max}`;
}
function AccountCard({ domain, rank, addedAt, status, account, saved, onToggleSave, onVisit }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [age, setAge] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setAge(timeAgo(addedAt));
	}, [addedAt]);
	const bonuses = account?.availableBonuses ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "acct",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "acct-head",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteIcon, { domain }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "acct-id",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "acct-title",
							children: [
								rank != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "acct-rank",
									children: [rank, "."]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "acct-domain",
									href: `https://${domain}/`,
									target: "_blank",
									rel: "noreferrer",
									onClick: onVisit,
									children: domain
								}),
								account?.unclaimed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "acct-unclaimed",
									children: "Unclaimed"
								}) : null,
								onToggleSave ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: saved ? "acct-save on" : "acct-save",
									"aria-label": saved ? `Remove ${domain} from my accounts` : `Save ${domain}`,
									onClick: onToggleSave,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, {
										size: 14,
										fill: saved ? "currentColor" : "none"
									})
								}) : null
							]
						}), age ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "acct-age",
							children: age
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "acct-side",
						children: [
							status ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `acct-live ${status}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), STATUS_LABEL[status]]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								className: "acct-cash",
								children: moneyShort(walletOf(account))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "acct-toggle",
								"aria-expanded": open,
								"aria-label": open ? "Hide bonuses" : "Show bonuses",
								onClick: () => setOpen((value) => !value),
								children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { size: 18 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { size: 18 })
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "acct-chips",
				children: CHIPS.map((chip) => {
					const bonus = account?.[chip.key] ?? null;
					const hot = Boolean(bonus?.lit);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: hot ? "acct-chip hot" : "acct-chip",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: chip.label }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [hot ? bonus?.amountDisplay || "?" : "—", chip.key === "new" && hot && (bonus?.amount ?? 0) <= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}) : null] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: hot ? chipLine(bonus ?? null, chip.bet) : chip.bet ? "Bet — ↑ —" : "↓ — ↑ —" })
						]
					}, chip.key);
				})
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "acct-drop",
				children: bonuses.length ? bonuses.map((bonus) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: bonus.lit ? "acct-bonus" : "acct-bonus grey",
					"data-id": bonus.id,
					"data-transaction-id": bonus.transactionId,
					"data-angpao-id": bonus.angpaoId,
					"data-lucky-id": bonus.luckyId,
					"data-host": bonus.host,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [bonus.lit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { size: 12 }) : null, bonus.name] }), bonus.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: bonus.detail }) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [bonus.lit && bonus.amount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}) : null, bonus.lit ? bonus.amountDisplay || "?" : "—"] })]
				}, `${bonus.host}-${bonus.id}-${bonus.transactionId}-${bonus.angpaoId}-${bonus.luckyId}`)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hint",
					children: "No bonus data for this domain yet."
				})
			}) : null
		]
	});
}
//#endregion
export { money as i, SiteIcon as n, formatAdded as r, AccountCard as t };
