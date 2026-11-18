import { o as __toESM } from "../_runtime.mjs";
import { S as Navigate, Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-1vAx-gM_.mjs";
import { t as GROK_PROVIDERS } from "./server-CU1Sa2vU.mjs";
import { n as useCurrentUserState } from "./use-current-user-BYyFvsCd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CZcMZlay.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "login-page",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "hint",
			children: "Opening Pokies Vault…"
		})
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	async function submitEmail(event) {
		event.preventDefault();
		setError("");
		setBusy(true);
		try {
			const result = mode === "up" ? await authClient.signUp.email({
				email: email.trim(),
				password,
				name: name.trim() || email.trim().split("@")[0] || "Member",
				callbackURL: "/"
			}) : await authClient.signIn.email({
				email: email.trim(),
				password,
				callbackURL: "/"
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "login-page",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "login-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "login-mark",
					src: "/__grok/icon-180.png",
					alt: "",
					width: 72,
					height: 72
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "login-kicker",
					children: "Private accounts"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "brand grad-text login-title",
					children: "Pokies Vault"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hint login-lead",
					children: "Sign in so your fetch history stays yours. Casino passwords stay on this phone."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "login-providers",
						children: GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn login-provider",
							onClick: () => signIn(provider.providerId, { callbackURL: "/" }),
							children: ["Continue with ", provider.label]
						}, provider.providerId))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "login-or",
						children: "or use email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "stack",
						onSubmit: submitEmail,
						children: [
							mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "text-input",
									autoComplete: "name",
									value: name,
									onChange: (event) => setName(event.target.value)
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "text-input",
									type: "email",
									autoComplete: "email",
									required: true,
									value: email,
									onChange: (event) => setEmail(event.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "text-input",
									type: "password",
									autoComplete: mode === "up" ? "new-password" : "current-password",
									required: true,
									minLength: 8,
									value: password,
									onChange: (event) => setPassword(event.target.value)
								})]
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "error-line",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "btn btn-grad",
								disabled: busy,
								children: busy ? "Please wait…" : mode === "up" ? "Create account" : "Sign in"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-ghost login-switch",
						onClick: () => {
							setMode((value) => value === "in" ? "up" : "in");
							setError("");
						},
						children: mode === "in" ? "Need an account? Create one" : "Already have an account? Sign in"
					})
				] })
			]
		})
	});
}
//#endregion
export { Login as component };
