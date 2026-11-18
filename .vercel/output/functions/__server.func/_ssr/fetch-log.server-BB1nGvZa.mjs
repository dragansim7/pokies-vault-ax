import { r as getSql } from "./db-B1JTYm6Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fetch-log.server-BB1nGvZa.js
async function saveFetchRun(userId, report) {
	const sql = await getSql();
	await sql.query("insert into fetch_runs (user_id, source, report) values ($1, $2, $3::jsonb)", [
		userId,
		report.source,
		JSON.stringify(report)
	]);
	await sql.query(`delete from fetch_runs
     where user_id = $1
       and id not in (
         select id from fetch_runs where user_id = $1 order by id desc limit 30
       )`, [userId]);
}
async function listFetchRuns(userId) {
	return (await (await getSql()).query("select report from fetch_runs where user_id = $1 order by id desc limit 20", [userId])).map((row) => typeof row.report === "string" ? JSON.parse(row.report) : row.report);
}
//#endregion
export { listFetchRuns, saveFetchRun };
