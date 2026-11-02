import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-D9-wnKzf.js
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
export { formatAdded as n, money as r, SiteIcon as t };
