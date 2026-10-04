//#region node_modules/.nitro/vite/services/ssr/assets/domain-CILCWuBu.js
function normalizeDomain(value) {
	let domain = value.trim().toLowerCase();
	domain = domain.replace(/^https?:\/\//, "");
	domain = domain.split("/")[0] ?? "";
	domain = domain.split("?")[0] ?? "";
	domain = domain.split(":")[0] ?? "";
	domain = domain.replace(/^www\./, "");
	return domain;
}
function isPublicDomain(domain) {
	if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/.test(domain)) return false;
	if (domain.length > 253) return false;
	if (/^\d+\.\d+\.\d+\.\d+$/.test(domain)) return false;
	if (domain === "localhost" || domain.endsWith(".local") || domain.endsWith(".internal") || domain.endsWith(".localhost")) return false;
	return true;
}
//#endregion
export { normalizeDomain as n, isPublicDomain as t };
