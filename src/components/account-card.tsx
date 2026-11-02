import { Bookmark, ChevronDown, ChevronUp, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteIcon } from "@/components/site-icon";
import { moneyShort, timeAgo } from "@/lib/format";
import type { AccountOk, BonusView } from "@/lib/parse-account";

type StatusName = "checking" | "live" | "slow" | "redirect" | "dead" | "unknown";

const STATUS_LABEL: Record<StatusName, string> = {
  checking: "Checking",
  live: "Live",
  slow: "Slow",
  redirect: "Redirect",
  dead: "Down",
  unknown: "Unknown",
};

const CHIPS: { key: "commission" | "share" | "referral" | "new" | "rebate"; label: string; bet: boolean }[] = [
  { key: "commission", label: "COM", bet: true },
  { key: "share", label: "SHARE", bet: false },
  { key: "referral", label: "REF", bet: false },
  { key: "new", label: "NEW", bet: false },
  { key: "rebate", label: "REBATE", bet: false },
];

function walletOf(account: AccountOk | null | undefined): number {
  if (!account) return 0;
  const held = account.wallets.filter((wallet) => wallet.balance > 0.001);
  if (held.length) return held.reduce((sum, wallet) => sum + wallet.balance, 0);
  return account.cash > 0.001 ? account.cash : 0;
}

function chipLine(bonus: BonusView | null, bet: boolean): string {
  const max = bonus?.maxWithdrawal != null && bonus.maxWithdrawal > 0 ? moneyShort(bonus.maxWithdrawal) : "—";
  if (bet) {
    const roll = bonus?.rollover != null && bonus.rollover > 0 ? moneyShort(bonus.rollover) : "—";
    return `Bet ${roll} ↑ ${max}`;
  }
  const min = bonus?.minWithdrawal != null && bonus.minWithdrawal > 0 ? moneyShort(bonus.minWithdrawal) : "—";
  return `↓ ${min} ↑ ${max}`;
}

function limitLine(bonus: BonusView): string {
  const min = bonus.minWithdrawal != null && bonus.minWithdrawal > 0 ? moneyShort(bonus.minWithdrawal) : "—";
  const max = bonus.maxWithdrawal != null && bonus.maxWithdrawal > 0 ? moneyShort(bonus.maxWithdrawal) : "—";
  return `Min ${min} · Max ${max}`;
}

export function AccountCard({
  domain,
  rank,
  addedAt,
  status,
  account,
  saved,
  onToggleSave,
  onVisit,
}: {
  domain: string;
  rank?: number;
  addedAt?: string | null;
  status?: StatusName;
  account?: AccountOk | null;
  saved?: boolean;
  onToggleSave?: () => void;
  onVisit?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [age, setAge] = useState("");
  useEffect(() => {
    setAge(timeAgo(addedAt));
  }, [addedAt]);

  const bonuses = account?.availableBonuses ?? [];

  return (
    <article className="acct">
      <header className="acct-head">
        <SiteIcon domain={domain} />
        <div className="acct-id">
          <div className="acct-title">
            {rank != null ? <span className="acct-rank">{rank}.</span> : null}
            <a
              className="acct-domain"
              href={`https://${domain}/`}
              target="_blank"
              rel="noreferrer"
              onClick={onVisit}
            >
              {domain}
            </a>
            {onToggleSave ? (
              <button
                type="button"
                className={saved ? "acct-save on" : "acct-save"}
                aria-label={saved ? `Remove ${domain} from my accounts` : `Save ${domain}`}
                onClick={onToggleSave}
              >
                <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
              </button>
            ) : null}
          </div>
          {age ? <span className="acct-age">{age}</span> : null}
        </div>
        <div className="acct-side">
          {status ? (
            <span className={`acct-live ${status}`}>
              <i />
              {STATUS_LABEL[status]}
            </span>
          ) : null}
          <b className="acct-cash">{moneyShort(walletOf(account))}</b>
          <button
            type="button"
            className="acct-toggle"
            aria-expanded={open}
            aria-label={open ? "Hide bonuses" : "Show bonuses"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </header>

      <div className="acct-chips">
        {CHIPS.map((chip) => {
          const bonus = account?.[chip.key] ?? null;
          const hot = Boolean(bonus && (bonus.amount > 0 || bonus.amountDisplay));
          return (
            <div key={chip.key} className={hot ? "acct-chip hot" : "acct-chip"}>
              <span>{chip.label}</span>
              <strong>
                {bonus ? bonus.amountDisplay || moneyShort(bonus.amount) : "—"}
                {chip.key === "new" && bonus && bonus.amount <= 0 ? <i /> : null}
              </strong>
              <small>{chipLine(bonus, chip.bet)}</small>
            </div>
          );
        })}
      </div>

      {open ? (
        <div className="acct-drop">
          {bonuses.length ? (
            bonuses.map((bonus, index) => (
              <div className="acct-bonus" key={`${bonus.name}-${index}`}>
                <div>
                  <strong>
                    {index === 0 ? <Star size={12} /> : null}
                    {bonus.name}
                  </strong>
                  <span>{limitLine(bonus)}</span>
                </div>
                <b>
                  {bonus.amount > 0 ? <i /> : null}
                  {bonus.amountDisplay || moneyShort(bonus.amount)}
                </b>
              </div>
            ))
          ) : (
            <p className="hint">No bonus data for this domain yet.</p>
          )}
        </div>
      ) : null}
    </article>
  );
}
