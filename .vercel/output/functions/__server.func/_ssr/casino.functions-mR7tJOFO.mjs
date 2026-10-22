import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/casino.functions-mR7tJOFO.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var fetchCasinoAccount_createServerFn_handler = createServerRpc({
	id: "31be5b99ae9ca7c2d3b8e9741a2c29430bf663b3f4938f9ae4aa643a22c14f45",
	name: "fetchCasinoAccount",
	filename: "src/lib/casino.functions.ts"
}, (opts) => fetchCasinoAccount.__executeServer(opts));
var fetchCasinoAccount = createServerFn({ method: "POST" }).validator((data) => data).handler(fetchCasinoAccount_createServerFn_handler, async ({ data }) => {
	const { fetchCasinoAccount: run } = await import("./casino.impl.server-C1tlkFkI.mjs");
	return run(data);
});
var fetchCasinoBatchFn_createServerFn_handler = createServerRpc({
	id: "461c07027b2a8c58a6fe2f0a00682e43be45789d096410e713e3e5b3f4767738",
	name: "fetchCasinoBatchFn",
	filename: "src/lib/casino.functions.ts"
}, (opts) => fetchCasinoBatchFn.__executeServer(opts));
var fetchCasinoBatchFn = createServerFn({ method: "POST" }).validator((data) => data).handler(fetchCasinoBatchFn_createServerFn_handler, async ({ data }) => {
	const { fetchCasinoBatch } = await import("./casino.impl.server-C1tlkFkI.mjs");
	return fetchCasinoBatch(data);
});
var fetchAllStatusesFn_createServerFn_handler = createServerRpc({
	id: "bbaccc3e2239274bbee08332c5f8909ed44347b3bf93b9b721830ca8434ad3bf",
	name: "fetchAllStatusesFn",
	filename: "src/lib/casino.functions.ts"
}, (opts) => fetchAllStatusesFn.__executeServer(opts));
var fetchAllStatusesFn = createServerFn({ method: "POST" }).validator((data) => data ?? {}).handler(fetchAllStatusesFn_createServerFn_handler, async () => {
	const { fetchAllStatuses } = await import("./casino.impl.server-C1tlkFkI.mjs");
	return fetchAllStatuses();
});
var checkSiteStatus_createServerFn_handler = createServerRpc({
	id: "74839dc983bbaacaaaed2f59d289f93c284acf8e34a8e5f8f2b0a8b1a890e640",
	name: "checkSiteStatus",
	filename: "src/lib/casino.functions.ts"
}, (opts) => checkSiteStatus.__executeServer(opts));
var checkSiteStatus = createServerFn({ method: "POST" }).validator((data) => data).handler(checkSiteStatus_createServerFn_handler, async ({ data }) => {
	const { checkSiteStatus: run } = await import("./casino.impl.server-C1tlkFkI.mjs");
	return run(data.domain);
});
//#endregion
export { checkSiteStatus_createServerFn_handler, fetchAllStatusesFn_createServerFn_handler, fetchCasinoAccount_createServerFn_handler, fetchCasinoBatchFn_createServerFn_handler };
