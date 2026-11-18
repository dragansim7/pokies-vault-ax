import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as useServerFn, s as lookupSiteIconFn } from "./shell-0JW2-gGZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-DEur2zEy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CACHE_KEY = "pokies_vault_site_icons_v1";
var FALLBACK = "/site-fallback.jpg";
var memory = /* @__PURE__ */ new Map();
var pending = /* @__PURE__ */ new Map();
var active = 0;
var queue = [];
function readStore() {
	if (typeof sessionStorage === "undefined") return {};
	try {
		const parsed = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "{}");
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		return {};
	}
}
function remembered(domain) {
	if (memory.has(domain)) return memory.get(domain);
	const stored = readStore()[domain];
	if (typeof stored === "string") {
		memory.set(domain, stored);
		return stored;
	}
}
function remember(domain, url) {
	memory.set(domain, url);
	try {
		const next = readStore();
		next[domain] = url;
		sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
	} catch {}
}
function runNext() {
	if (active >= 4) return;
	const job = queue.shift();
	if (job) job();
}
function SiteIcon({ domain }) {
	const lookup = useServerFn(lookupSiteIconFn);
	const lookupRef = (0, import_react.useRef)(lookup);
	lookupRef.current = lookup;
	const [src, setSrc] = (0, import_react.useState)(() => remembered(domain) || "");
	(0, import_react.useEffect)(() => {
		const known = remembered(domain);
		if (known !== void 0) {
			setSrc(known || FALLBACK);
			return;
		}
		let cancelled = false;
		const task = pending.get(domain) ?? new Promise((resolve) => {
			const run = () => {
				active += 1;
				lookupRef.current({ data: { domain } }).then((url) => {
					const next = typeof url === "string" ? url : "";
					remember(domain, next);
					resolve(next);
				}).catch(() => {
					remember(domain, "");
					resolve("");
				}).finally(() => {
					active -= 1;
					pending.delete(domain);
					runNext();
				});
			};
			if (active < 4) run();
			else queue.push(run);
		});
		pending.set(domain, task);
		task.then((url) => {
			if (!cancelled) setSrc(url || FALLBACK);
		});
		return () => {
			cancelled = true;
		};
	}, [domain]);
	if (!src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "site-icon" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		className: "site-icon",
		src,
		alt: "",
		referrerPolicy: "no-referrer",
		loading: "lazy",
		decoding: "async",
		onError: () => setSrc(FALLBACK)
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
//#endregion
export { timeAgo as a, moneyShort as i, formatAdded as n, money as r, SiteIcon as t };
