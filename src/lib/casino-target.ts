import type { AccountCode } from "@/lib/parse-account";

export type CasinoTarget =
  | { domain: string; ok: true; host: string; merchantId: string }
  | { domain: string; ok: false; code: AccountCode; message: string };
