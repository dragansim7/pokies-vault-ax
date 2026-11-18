import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-C7GUMxR7.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fetch-log.functions-B2upcEC-.js
var recordFetchRunFn_createServerFn_handler = createServerRpc({
	id: "4f37c24d7e8a5fc6bb8ca7f63b49bf82b8fda1485c8f313c556d283d15bbaef1",
	name: "recordFetchRunFn",
	filename: "src/lib/fetch-log.functions.ts"
}, (opts) => recordFetchRunFn.__executeServer(opts));
var recordFetchRunFn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(recordFetchRunFn_createServerFn_handler, async ({ data, context }) => {
	const { saveFetchRun } = await import("./fetch-log.server-BB1nGvZa.mjs");
	await saveFetchRun(context.userId, data);
	return { ok: true };
});
var listFetchRunsFn_createServerFn_handler = createServerRpc({
	id: "0b3a5afae0e015ef4f66aa85b7fb9200debb67476643ab437da977692aea2306",
	name: "listFetchRunsFn",
	filename: "src/lib/fetch-log.functions.ts"
}, (opts) => listFetchRunsFn.__executeServer(opts));
var listFetchRunsFn = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listFetchRunsFn_createServerFn_handler, async ({ context }) => {
	const { listFetchRuns } = await import("./fetch-log.server-BB1nGvZa.mjs");
	return listFetchRuns(context.userId);
});
//#endregion
export { listFetchRunsFn_createServerFn_handler, recordFetchRunFn_createServerFn_handler };
