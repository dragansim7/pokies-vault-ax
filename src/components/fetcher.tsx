import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { CATALOG } from "@/data/sites";
import { useVault, type FallbackCred } from "@/components/vault";
import { fetchCasinoAccount } from "@/lib/casino.functions";
import { isPublicDomain, normalizeDomain } from "@/lib/domain";
import { money } from "@/lib/format";
import type { AccountOk, AccountRow, BonusView } from "@/lib/parse-account";

const PAGE = 12;

function bonusCell(label: string, bonus: BonusView | null) {
  return (
    <div className="bonus-cell">
      <b>{label}</b>
      {bonus ? (
        <em className="yes">
          Yes <span>({bonus.amountDisplay})</span>
        </em>
      ) : (
        <em className="no">No</em>
      )}
    </div>
  );
}

function ResultCard({ row }: { row: AccountOk }) {
  return (
    <article className="result-card">
      <div className="result-head">
        <strong>{row.domain}</strong>
        <a href={`https://${row.domain}/`} target="_blank" rel="noreferrer">
          Open
        </a>
      </div>
      <p className="cash">
        {money(row.cash)}
        <small>
          {row.cashWalletName}
          {row.cashMinWithdrawal != null ? ` · Min ${money(row.cashMinWithdrawal)}` : ""}
          {row.cashMaxWithdrawal != null ? ` · Max ${money(row.cashMaxWithdrawal)}` : " · No max shown"}
        </small>
      </p>
      <div className="bonus-grid">
        {bonusCell("Commission", row.commission)}
        {bonusCell("Share", row.share)}
        {bonusCell("Referral", row.referral)}
        {bonusCell("Welcome", row.new)}
        {bonusCell("Rebate", row.rebate)}
      </div>
      {row.availableBonuses.length ? (
        <details className="bonus-list">
          <summary>All bonuses on this account ({row.availableBonuses.length})</summary>
          {row.availableBonuses.map((bonus) => (
            <div className="bonus-row" key={`${bonus.name}-${bonus.amountDisplay}`}>
              <span>
                {bonus.name}
                {bonus.rollover ? ` · ${bonus.rollover}×` : ""}
              </span>
              <span>{bonus.amountDisplay}</span>
            </div>
          ))}
        </details>
      ) : null}
    </article>
  );
}

function PageList({ rows }: { rows: AccountOk[] }) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const safe = Math.min(page, pages - 1);
  const slice = rows.slice(safe * PAGE, safe * PAGE + PAGE);
  return (
    <>
      {pages > 1 ? (
        <div className="pager">
          <button type="button" className="btn" disabled={safe === 0} onClick={() => setPage(safe - 1)}>
            Previous
          </button>
          <span>
            Page {safe + 1} / {pages}
          </span>
          <button
            type="button"
            className="btn"
            disabled={safe >= pages - 1}
            onClick={() => setPage(safe + 1)}
          >
            Next
          </button>
        </div>
      ) : null}
      <div className="stack">
        {slice.map((row) => (
          <ResultCard key={row.domain} row={row} />
        ))}
      </div>
    </>
  );
}

export function Fetcher() {
  const { state, patch, rememberAccount, saveFetch } = useVault();
  const fetchOne = useServerFn(fetchCasinoAccount);
  const [showPassword, setShowPassword] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [single, setSingle] = useState("");
  const [status, setStatus] = useState("Enter the phone number and password you use on these sites.");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [rows, setRows] = useState<AccountRow[]>(state.lastFetch?.rows ?? []);
  const [showErrors, setShowErrors] = useState(false);
  const [confirmScan, setConfirmScan] = useState(false);
  const [diffs, setDiffs] = useState<string[]>([]);
  const stopRef = useRef<AbortController | null>(null);
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  const creds = useMemo(() => {
    const list = [{ phone: state.phone.trim(), password: state.password }];
    for (const item of state.fallbacks) {
      if (item.phone.trim() && item.password) list.push({ phone: item.phone.trim(), password: item.password });
    }
    return list.filter((item) => item.phone && item.password);
  }, [state.phone, state.password, state.fallbacks]);

  const valid = rows.filter((row): row is AccountOk => row.ok && row.hasData);
  const empty = rows.filter((row): row is AccountOk => row.ok && !row.hasData);
  const errors = rows.filter((row) => !row.ok);
  const totalCash = valid.reduce((sum, row) => sum + row.cash, 0);

  function setFallback(index: number, partial: Partial<FallbackCred>) {
    const fallbacks = state.fallbacks.map((item, i) => (i === index ? { ...item, ...partial } : item));
    patch({ fallbacks });
  }

  async function checkDomain(domain: string, signal: AbortSignal): Promise<AccountRow> {
    let last: AccountRow | null = null;
    for (const cred of creds) {
      if (signal.aborted) throw new DOMException("Aborted", "AbortError");
      const row = await fetchOne({
        data: { domain, phone: cred.phone, password: cred.password },
        signal,
      });
      if (row.ok) {
        rememberAccount(domain);
        return row;
      }
      last = row;
      if (row.code !== "invalid_login") return row;
    }
    return (
      last ?? {
        domain,
        ok: false,
        code: "other",
        message: "No credentials",
      }
    );
  }

  async function run(domains: string[]) {
    if (!creds.length) {
      setStatus("Enter your phone number and password before fetching.");
      return;
    }
    const unique = Array.from(new Set(domains));
    if (!unique.length) {
      setStatus("No sites to check. Save accounts from the list, add a domain, or scan.");
      return;
    }
    const previous = new Map((state.lastFetch?.rows ?? []).filter((row) => row.ok).map((row) => [row.domain, row]));
    stopRef.current?.abort();
    const controller = new AbortController();
    stopRef.current = controller;
    setRunning(true);
    setShowErrors(false);
    setDiffs([]);
    setRows([]);
    setProgress({ done: 0, total: unique.length });
    setStatus(unique.length === 1 ? `Checking ${unique[0]}…` : `Checking ${unique.length} sites…`);
    const collected: AccountRow[] = [];
    let cursor = 0;
    const worker = async () => {
      for (;;) {
        if (controller.signal.aborted) return;
        const index = cursor;
        cursor += 1;
        if (index >= unique.length) return;
        const domain = unique[index] ?? "";
        try {
          const row = await checkDomain(domain, controller.signal);
          collected.push(row);
        } catch (error) {
          if (controller.signal.aborted || (error instanceof DOMException && error.name === "AbortError")) {
            return;
          }
          collected.push({ domain, ok: false, code: "other", message: "Check failed" });
        }
        setProgress({ done: collected.length, total: unique.length });
        setRows([...collected].sort((a, b) => a.domain.localeCompare(b.domain)));
      }
    };
    await Promise.all(Array.from({ length: Math.min(4, unique.length) }, () => worker()));
    const stopped = controller.signal.aborted;
    const finalRows = [...collected].sort((a, b) => a.domain.localeCompare(b.domain));
    setRows(finalRows);
    if (!stopped && finalRows.length) saveFetch(finalRows);
    const notes: string[] = [];
    for (const row of finalRows) {
      if (!row.ok) continue;
      const before = previous.get(row.domain);
      if (before?.ok && Math.abs(before.cash - row.cash) >= 0.01) {
        notes.push(`${row.domain} balance ${money(before.cash)} → ${money(row.cash)}`);
      }
    }
    setDiffs(notes);
    const signedIn = finalRows.filter((row) => row.ok).length;
    setStatus(
      stopped
        ? "Stopped. Successful sign-ins stay in My accounts."
        : `Done. ${signedIn} of ${finalRows.length} signed in. Only those are kept as your accounts.`,
    );
    setRunning(false);
  }

  const mineTargets = state.mine.length
    ? state.mine
    : CATALOG.filter((site) => state.visited.includes(site.domain)).map((site) => site.domain);

  return (
    <section className="stack">
      <Link to="/" className="hint" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        <ChevronLeft size={16} /> Back to the list
      </Link>
      <div>
        <h1 className="brand grad-text" style={{ fontSize: "1.7rem" }}>
          Fetch bonus data
        </h1>
        <p className="hint">
          Uses the same phone and password across sites that share this login. It signs in, reads your wallet
          and bonuses, and drops everything else. No fetch limit.
        </p>
      </div>

      <div className="panel stack">
        <label className="field">
          <span>Phone number</span>
          <input
            className="text-input"
            inputMode="tel"
            autoComplete="username"
            value={state.phone}
            placeholder="04…"
            onChange={(event) => patch({ phone: event.target.value })}
          />
        </label>
        <label className="field">
          <span>Password</span>
          <div className="pass-row">
            <input
              className="text-input"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={state.password}
              onChange={(event) => patch({ password: event.target.value })}
            />
            <button
              type="button"
              className="btn"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>
        <button type="button" className="btn btn-ghost" onClick={() => setAdvanced((value) => !value)}>
          {advanced ? "Hide fallback logins" : "Fallback logins"}
        </button>
        {advanced
          ? state.fallbacks.map((item, index) => (
              <div className="stack" key={index}>
                <label className="field">
                  <span>Fallback {index + 2} phone</span>
                  <input
                    className="text-input"
                    value={item.phone}
                    inputMode="tel"
                    onChange={(event) => setFallback(index, { phone: event.target.value })}
                  />
                </label>
                <label className="field">
                  <span>Fallback {index + 2} password</span>
                  <input
                    className="text-input"
                    type="password"
                    value={item.password}
                    onChange={(event) => setFallback(index, { password: event.target.value })}
                  />
                </label>
              </div>
            ))
          : null}
        <p className="hint">
          Saved only in this browser. The server uses them to sign in and does not keep them.
        </p>
        <div className="actions">
          <button
            type="button"
            className="btn btn-grad"
            disabled={running}
            onClick={() => void run(mineTargets)}
          >
            {running ? <Loader2 size={16} /> : null} Fetch my accounts
            {mineTargets.length ? ` (${mineTargets.length})` : ""}
          </button>
          <button type="button" className="btn" disabled={!running} onClick={() => stopRef.current?.abort()}>
            Stop
          </button>
          <button
            type="button"
            className="btn"
            disabled={running || !state.lastFetch}
            onClick={() => {
              setRows(state.lastFetch?.rows ?? []);
              setStatus("Showing the last fetch saved on this device.");
            }}
          >
            View last fetch
          </button>
        </div>
        <div className="check-row">
          <input
            className="text-input"
            value={single}
            placeholder="Check one site, e.g. 9au.com"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            onChange={(event) => setSingle(event.target.value)}
          />
          <button
            type="button"
            className="btn"
            disabled={running}
            onClick={() => {
              const domain = normalizeDomain(single);
              if (!isPublicDomain(domain)) {
                setStatus("Enter a domain like 9au.com");
                return;
              }
              void run([domain]);
            }}
          >
            Check
          </button>
        </div>
        <button type="button" className="btn btn-ghost" disabled={running} onClick={() => setConfirmScan(true)}>
          Scan the full list to find my accounts
        </button>
        <p className="progress-line">{status}</p>
        {progress.total > 0 ? (
          <div className="bar" aria-hidden="true">
            <span style={{ width: `${Math.round((progress.done / progress.total) * 100)}%` }} />
          </div>
        ) : null}
      </div>

      {diffs.length ? (
        <div className="panel">
          <strong>Changes since the previous fetch</strong>
          <ul className="diff">
            {diffs.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <h2 className="section-label">
          Your accounts · {valid.length}
          {valid.length ? ` · ${money(totalCash)} cash` : ""}
        </h2>
        {valid.length ? <PageList rows={valid} /> : <p className="hint">Nothing with a balance or bonus yet.</p>}
      </div>
      <div>
        <h2 className="section-label">Signed in, nothing waiting · {empty.length}</h2>
        {empty.length ? <PageList rows={empty} /> : <p className="hint">None.</p>}
      </div>
      <div>
        <h2 className="section-label">Not your account or unreachable · {errors.length}</h2>
        {errors.length ? (
          <>
            <button type="button" className="btn" onClick={() => setShowErrors((value) => !value)}>
              {showErrors ? "Hide" : "Show"} rejected sites
            </button>
            {showErrors ? (
              <div className="stack" style={{ marginTop: 8 }}>
                {errors.map((row) => (
                  <div className="result-card" key={row.domain}>
                    <strong>{row.domain}</strong>
                    <p className="hint">{row.message}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <p className="hint">Rejected sites are not saved.</p>
        )}
      </div>

      {confirmScan ? (
        <div className="modal-backdrop" onClick={() => setConfirmScan(false)}>
          <div className="modal-card stack" onClick={(event) => event.stopPropagation()}>
            <h3>Scan every listed site?</h3>
            <p className="hint">
              This tries your password on {CATALOG.length} domains and keeps only the ones that sign in. It can
              take several minutes. You can stop it at any time.
            </p>
            <div className="actions">
              <button type="button" className="btn" onClick={() => setConfirmScan(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-grad"
                onClick={() => {
                  setConfirmScan(false);
                  void run(CATALOG.map((site) => site.domain));
                }}
              >
                Scan my login
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
