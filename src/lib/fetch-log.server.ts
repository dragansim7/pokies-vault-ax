import { getSql } from "@/lib/db";

export type FetchRunReport = {
  at: number;
  source: "phone" | "vault";
  total: number;
  signedIn: number;
  rejected: number;
  attempts: number;
  retries: number;
  workers: number;
  peak: number;
  wallMs: number;
  counts: Record<string, number>;
  signedInDomains: string[];
};

export async function saveFetchRun(userId: string, report: FetchRunReport): Promise<void> {
  const sql = await getSql();
  await sql.query("insert into fetch_runs (user_id, source, report) values ($1, $2, $3::jsonb)", [
    userId,
    report.source,
    JSON.stringify(report),
  ]);
  await sql.query(
    `delete from fetch_runs
     where user_id = $1
       and id not in (
         select id from fetch_runs where user_id = $1 order by id desc limit 30
       )`,
    [userId],
  );
}

export async function listFetchRuns(userId: string): Promise<FetchRunReport[]> {
  const sql = await getSql();
  const rows = await sql.query<{ report: FetchRunReport | string }>(
    "select report from fetch_runs where user_id = $1 order by id desc limit 20",
    [userId],
  );
  return rows.map((row) => (typeof row.report === "string" ? (JSON.parse(row.report) as FetchRunReport) : row.report));
}
