import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/casino.functions-CHqn-ocf.js
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
	const { fetchCasinoAccount: run } = await import("./casino.impl.server-CqA9z88f.mjs");
	return run(data);
});
var checkSiteStatus_createServerFn_handler = createServerRpc({
	id: "74839dc983bbaacaaaed2f59d289f93c284acf8e34a8e5f8f2b0a8b1a890e640",
	name: "checkSiteStatus",
	filename: "src/lib/casino.functions.ts"
}, (opts) => checkSiteStatus.__executeServer(opts));
var checkSiteStatus = createServerFn({ method: "POST" }).validator((data) => data).handler(checkSiteStatus_createServerFn_handler, async ({ data }) => {
	const { checkSiteStatus: run } = await import("./casino.impl.server-CqA9z88f.mjs");
	return run(data.domain);
});
//#endregion
export { checkSiteStatus_createServerFn_handler, fetchCasinoAccount_createServerFn_handler };
