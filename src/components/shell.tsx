import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Plus, Shield, Trash2, UserRound, X, Zap } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useVault } from "@/components/vault";

export function AppFrame({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const { state, addDomain, clearAll, patch } = useVault();
  const [menu, setMenu] = useState(false);
  const [adding, setAdding] = useState(false);
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");

  function submitDomain() {
    const message = addDomain(domain);
    if (message) {
      setError(message);
      return;
    }
    setDomain("");
    setError("");
    setAdding(false);
    setMenu(false);
  }

  return (
    <main className="wrap">
      <header className="header-row">
        <Link to="/" className="brand grad-text">
          POKIES VAULT
        </Link>
        <div className="header-actions">
          <Link to="/fetch" className="icon-action" aria-label="Open fetcher">
            <Zap size={16} />
            <span>Fetcher</span>
          </Link>
          <button
            type="button"
            className={menu ? "icon-action menu-open" : "icon-action"}
            aria-expanded={menu}
            aria-label="Open menu"
            onClick={() => setMenu(true)}
          >
            <Menu size={16} />
            <span>Menu</span>
          </button>
        </div>
      </header>
      {children}
      <footer className="foot">
        <p>
          <span className="age">18+</span>
          <strong>Gamble responsibly.</strong> Only use money you can afford to lose.
          Need help?{" "}
          <a href="https://www.gamblinghelponline.org.au/" target="_blank" rel="noreferrer">
            Gambling Help Online
          </a>{" "}
          — 1800 858 858 ·{" "}
          <a href="https://www.betstop.gov.au/" target="_blank" rel="noreferrer">
            BetStop
          </a>
        </p>
        <p style={{ marginTop: 8 }}>
          Pokies Vault checks sites you already use. It does not take bets, sell
          fetches, or rent listings. Passwords stay in this browser.
          {path === "/fetch" ? "" : ` ${state.mine.length} saved account${state.mine.length === 1 ? "" : "s"}.`}
        </p>
      </footer>

      {menu ? (
        <div className="drawer-backdrop" onClick={() => setMenu(false)}>
          <aside className="drawer" onClick={(event) => event.stopPropagation()}>
            <div className="header-row">
              <div>
                <h2>Menu</h2>
                <p>Your list only. No credits, no rentals.</p>
              </div>
              <button type="button" className="pin" aria-label="Close menu" onClick={() => setMenu(false)}>
                <X size={18} />
              </button>
            </div>
            <button
              type="button"
              className="drawer-item"
              onClick={() => {
                patch({ mineOnly: true });
                setMenu(false);
              }}
            >
              <UserRound size={18} />
              <span>
                <strong>My accounts</strong>
                <small>{state.mine.length} site{state.mine.length === 1 ? "" : "s"} saved</small>
              </span>
            </button>
            <button
              type="button"
              className="drawer-item"
              onClick={() => {
                setAdding(true);
                setMenu(false);
              }}
            >
              <Plus size={18} />
              <span>
                <strong>Add a domain</strong>
                <small>Save a site into your accounts</small>
              </span>
            </button>
            <Link to="/fetch" className="drawer-item" onClick={() => setMenu(false)}>
              <Zap size={18} />
              <span>
                <strong>Bonus fetcher</strong>
                <small>Balances, share, referral, rebate</small>
              </span>
            </Link>
            <div className="drawer-item">
              <Shield size={18} />
              <span>
                <strong>Same login on each site</strong>
                <small>Phone and password, this browser only</small>
              </span>
            </div>
            <button
              type="button"
              className="drawer-item"
              onClick={() => {
                if (window.confirm("Clear saved sites, visits, and the password stored on this device?")) {
                  clearAll();
                  setMenu(false);
                }
              }}
            >
              <Trash2 size={18} />
              <span>
                <strong>Clear this device</strong>
                <small>Removes local vault data</small>
              </span>
            </button>
          </aside>
        </div>
      ) : null}

      {adding ? (
        <div className="modal-backdrop" onClick={() => setAdding(false)}>
          <div className="modal-card stack" onClick={(event) => event.stopPropagation()}>
            <h3>Add a domain</h3>
            <p className="hint">
              It is saved as one of your accounts and can be fetched with the same phone and password.
            </p>
            <input
              className="text-input"
              value={domain}
              placeholder="9au.com"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              onChange={(event) => setDomain(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submitDomain();
              }}
            />
            {error ? <p className="error-line">{error}</p> : null}
            <div className="actions">
              <button type="button" className="btn" onClick={() => setAdding(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-grad" onClick={submitDomain}>
                Save site
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
