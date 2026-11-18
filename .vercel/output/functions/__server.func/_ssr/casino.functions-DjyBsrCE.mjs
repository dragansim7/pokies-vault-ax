import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-C7GUMxR7.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/casino.functions-DjyBsrCE.js
var lookupSiteIconFn_createServerFn_handler = createServerRpc({
	id: "d6dcb3ec797f6fb8fba45a87a42d4b110d1b41556623d96dd7ec64fcc2dbf4f7",
	name: "lookupSiteIconFn",
	filename: "src/lib/casino.functions.ts"
}, (opts) => lookupSiteIconFn.__executeServer(opts));
var lookupSiteIconFn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(lookupSiteIconFn_createServerFn_handler, async ({ data }) => {
	const { lookupSiteIcon } = await import("./casino.impl.server-Bp-lrfZx.mjs");
	return lookupSiteIcon(data.domain);
});
var loadPublicCatalogueFn_createServerFn_handler = createServerRpc({
	id: "8976c06a41e71ce80386f094b7ae1c94bf1e89802315a2bbba940c7383532984",
	name: "loadPublicCatalogueFn",
	filename: "src/lib/casino.functions.ts"
}, (opts) => loadPublicCatalogueFn.__executeServer(opts));
var loadPublicCatalogueFn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(loadPublicCatalogueFn_createServerFn_handler, async ({ data }) => {
	const { loadPublicCatalogue } = await import("./casino.impl.server-Bp-lrfZx.mjs");
	return loadPublicCatalogue(data.domains);
});
var fetchCasinoAccount_createServerFn_handler = createServerRpc({
	id: "31be5b99ae9ca7c2d3b8e9741a2c29430bf663b3f4938f9ae4aa643a22c14f45",
	name: "fetchCasinoAccount",
	filename: "src/lib/casino.functions.ts"
}, (opts) => fetchCasinoAccount.__executeServer(opts));
var fetchCasinoAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(fetchCasinoAccount_createServerFn_handler, async ({ data }) => {
	const { fetchCasinoAccount: run } = await import("./casino.impl.server-Bp-lrfZx.mjs");
	return run(data);
});
var fetchCasinoBatchFn_createServerFn_handler = createServerRpc({
	id: "461c07027b2a8c58a6fe2f0a00682e43be45789d096410e713e3e5b3f4767738",
	name: "fetchCasinoBatchFn",
	filename: "src/lib/casino.functions.ts"
}, (opts) => fetchCasinoBatchFn.__executeServer(opts));
var fetchCasinoBatchFn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(fetchCasinoBatchFn_createServerFn_handler, async ({ data }) => {
	const { fetchCasinoBatch } = await import("./casino.impl.server-Bp-lrfZx.mjs");
	return fetchCasinoBatch(data);
});
var resolveCasinoTargetsFn_createServerFn_handler = createServerRpc({
	id: "ebe8291f863c16ed3e14ae9e7b736039ffc8d725902aaa7faa157aee4a434259",
	name: "resolveCasinoTargetsFn",
	filename: "src/lib/casino.functions.ts"
}, (opts) => resolveCasinoTargetsFn.__executeServer(opts));
var resolveCasinoTargetsFn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(resolveCasinoTargetsFn_createServerFn_handler, async ({ data }) => {
	const { resolveCasinoTargets } = await import("./casino.impl.server-Bp-lrfZx.mjs");
	return resolveCasinoTargets(data.domains);
});
var lookupEgressFn_createServerFn_handler = createServerRpc({
	id: "d9ddaf3cd55cea64846bc1a1e505c6cac9b7643a2d5b411dac8b9b0034e31ace",
	name: "lookupEgressFn",
	filename: "src/lib/casino.functions.ts"
}, (opts) => lookupEgressFn.__executeServer(opts));
var lookupEgressFn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(lookupEgressFn_createServerFn_handler, async () => {
	const { lookupEgress } = await import("./casino.impl.server-Bp-lrfZx.mjs");
	return lookupEgress();
});
var fetchAllStatusesFn_createServerFn_handler = createServerRpc({
	id: "bbaccc3e2239274bbee08332c5f8909ed44347b3bf93b9b721830ca8434ad3bf",
	name: "fetchAllStatusesFn",
	filename: "src/lib/casino.functions.ts"
}, (opts) => fetchAllStatusesFn.__executeServer(opts));
var fetchAllStatusesFn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(fetchAllStatusesFn_createServerFn_handler, async () => {
	const { fetchAllStatuses } = await import("./casino.impl.server-Bp-lrfZx.mjs");
	return fetchAllStatuses();
});
var checkSiteStatus_createServerFn_handler = createServerRpc({
	id: "74839dc983bbaacaaaed2f59d289f93c284acf8e34a8e5f8f2b0a8b1a890e640",
	name: "checkSiteStatus",
	filename: "src/lib/casino.functions.ts"
}, (opts) => checkSiteStatus.__executeServer(opts));
var checkSiteStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(checkSiteStatus_createServerFn_handler, async ({ data }) => {
	const { checkSiteStatus: run } = await import("./casino.impl.server-Bp-lrfZx.mjs");
	return run(data.domain);
});
//#endregion
export { checkSiteStatus_createServerFn_handler, fetchAllStatusesFn_createServerFn_handler, fetchCasinoAccount_createServerFn_handler, fetchCasinoBatchFn_createServerFn_handler, loadPublicCatalogueFn_createServerFn_handler, lookupEgressFn_createServerFn_handler, lookupSiteIconFn_createServerFn_handler, resolveCasinoTargetsFn_createServerFn_handler };
