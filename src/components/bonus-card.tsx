import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { SiteIcon } from "@/components/site-icon";
import { moneyShort } from "@/lib/format";
import { bestBonus, type BonusSlot, type PublicBonus } from "@/lib/public-bonus";

const SLOTS: { key: BonusSlot; label: string }[] = [
  { key: "signup", label: "SIGNUP" },
  { key: "share", label: "SHARE" },
  { key: "daily", label: "DAILY" },
  { key: "birthday", label: "BIRTHDAY" },
];

function bound(value: number | null): string {
  return value != null && value > 0 ? moneyShort(value) : "—";
}

export function BonusCard({
  domain,
  rank,
  bonuses,
  message,
}: {
  domain: string;
  rank?: number;
  bonuses: PublicBonus[] | null;
  message?: string;
}) {
  const [open, setOpen] = useState(false);
  const listed = bonuses ?? [];

  return (
    <article className="acct">
      <header className="acct-head">
        <SiteIcon domain={domain} />
        <div className="acct-id">
          <div className="acct-title">
            {rank != null ? <span className="acct-rank">{rank}.</span> : null}
            <a className="acct-domain" href={`https://${domain}/`} target="_blank" rel="noreferrer">
              {domain}
            </a>
          </div>
          <span className="acct-age">
            {bonuses == null ? "Not loaded" : message ? message : `${listed.length} published`}
          </span>
        </div>
        <div className="acct-side">
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
      <div className="acct-chips slots">
        {SLOTS.map((slot) => {
          const found = bestBonus(listed, slot.key);
          const bonus = found && found.kind !== "unset" ? found : null;
          return (
            <div key={slot.key} className={bonus ? "acct-chip hot" : "acct-chip"}>
              <span>{slot.label}</span>
              <strong>{bonus ? bonus.amountDisplay : "—"}</strong>
              <small>
                ↓ {bound(bonus?.minWithdraw ?? null)} ↑ {bound(bonus?.maxWithdraw ?? null)}
              </small>
            </div>
          );
        })}
      </div>
      {open ? (
        <div className="acct-drop">
          {listed.length ? (
            listed.map((bonus) => (
              <div className="acct-bonus" key={`${bonus.id}-${bonus.name}`}>
                <div>
                  <strong>{bonus.name}</strong>
                  <span>
                    {bonus.slot === "other" ? "Other" : bonus.slot} · {bonus.kind}
                    {bonus.rollover != null ? ` · Rollover ${bonus.rollover}x` : ""}
                    {bonus.minDeposit != null ? ` · Deposit ${moneyShort(bonus.minDeposit)}` : ""}
                    {` · Min ${bound(bonus.minWithdraw)} · Max ${bound(bonus.maxWithdraw)}`}
                  </span>
                </div>
                <b>{bonus.amountDisplay}</b>
              </div>
            ))
          ) : (
            <p className="hint">{message || "No public bonuses loaded for this domain yet."}</p>
          )}
        </div>
      ) : null}
    </article>
  );
}
