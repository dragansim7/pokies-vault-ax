import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (isPending) {
    return (
      <main className="login-page">
        <p className="hint">Opening Pokies Vault…</p>
      </main>
    );
  }
  if (user) return <Navigate to="/" />;

  async function submitEmail(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result =
        mode === "up"
          ? await authClient.signUp.email({
              email: email.trim(),
              password,
              name: name.trim() || email.trim().split("@")[0] || "Member",
              callbackURL: "/",
            })
          : await authClient.signIn.email({
              email: email.trim(),
              password,
              callbackURL: "/",
            });
      if (result.error) {
        setError(result.error.message || "That email and password were not accepted.");
        setBusy(false);
        return;
      }
      window.location.assign("/");
    } catch {
      setError("Could not reach sign-in. Try again.");
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <img className="login-mark" src="/__grok/icon-180.png" alt="" width={72} height={72} />
        <p className="login-kicker">Private accounts</p>
        <h1 className="brand grad-text login-title">Pokies Vault</h1>
        <p className="hint login-lead">
          Sign in so your fetch history stays yours. Casino passwords stay on this phone.
        </p>

        {authEnabled ? (
          <>
            <div className="login-providers">
              {GROK_PROVIDERS.map((provider) => (
                <button
                  key={provider.providerId}
                  type="button"
                  className="btn login-provider"
                  onClick={() => signIn(provider.providerId, { callbackURL: "/" })}
                >
                  Continue with {provider.label}
                </button>
              ))}
            </div>

            <p className="login-or">or use email</p>

            <form className="stack" onSubmit={submitEmail}>
              {mode === "up" ? (
                <label className="field">
                  <span>Name</span>
                  <input
                    className="text-input"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </label>
              ) : null}
              <label className="field">
                <span>Email</span>
                <input
                  className="text-input"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              <label className="field">
                <span>Password</span>
                <input
                  className="text-input"
                  type="password"
                  autoComplete={mode === "up" ? "new-password" : "current-password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              {error ? <p className="error-line">{error}</p> : null}
              <button type="submit" className="btn btn-grad" disabled={busy}>
                {busy ? "Please wait…" : mode === "up" ? "Create account" : "Sign in"}
              </button>
            </form>
            <button
              type="button"
              className="btn btn-ghost login-switch"
              onClick={() => {
                setMode((value) => (value === "in" ? "up" : "in"));
                setError("");
              }}
            >
              {mode === "in" ? "Need an account? Create one" : "Already have an account? Sign in"}
            </button>
          </>
        ) : (
          <p className="hint">Sign-in is not available yet.</p>
        )}
      </section>
    </main>
  );
}
