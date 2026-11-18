import { o as __toESM } from "../_runtime.mjs";
import { C as useRouter, S as Navigate, Z as require_react, m as useRouterState, q as isRedirect, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { i as signOut } from "./client-1vAx-gM_.mjs";
import { a as hasGateSessionMarker } from "./server-CU1Sa2vU.mjs";
import { t as authMiddleware } from "./middleware-C7GUMxR7.mjs";
import { d as Plus, f as Menu, h as Gift, i as UserRound, m as House, n as X, o as Trash2, t as Zap, u as Radar } from "../_libs/lucide-react.mjs";
import { i as THEMES, n as useVault } from "./router-BfFQn0Bu.mjs";
import { n as useCurrentUserState, t as useCurrentUser } from "./use-current-user-BYyFvsCd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-0JW2-gGZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var lookupSiteIconFn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("d6dcb3ec797f6fb8fba45a87a42d4b110d1b41556623d96dd7ec64fcc2dbf4f7"));
var loadPublicCatalogueFn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("8976c06a41e71ce80386f094b7ae1c94bf1e89802315a2bbba940c7383532984"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("31be5b99ae9ca7c2d3b8e9741a2c29430bf663b3f4938f9ae4aa643a22c14f45"));
var fetchCasinoBatchFn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("461c07027b2a8c58a6fe2f0a00682e43be45789d096410e713e3e5b3f4767738"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("ebe8291f863c16ed3e14ae9e7b736039ffc8d725902aaa7faa157aee4a434259"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(createSsrRpc("d9ddaf3cd55cea64846bc1a1e505c6cac9b7643a2d5b411dac8b9b0034e31ace"));
var fetchAllStatusesFn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(createSsrRpc("bbaccc3e2239274bbee08332c5f8909ed44347b3bf93b9b721830ca8434ad3bf"));
var checkSiteStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("74839dc983bbaacaaaed2f59d289f93c284acf8e34a8e5f8f2b0a8b1a890e640"));
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function AppFrame({ children }) {
	const path = useRouterState({ select: (state) => state.location.pathname });
	const { state, addDomain, clearAll, patch } = useVault();
	const { user, isPending } = useCurrentUserState();
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [domain, setDomain] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
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
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "wrap",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "hint",
			style: { padding: "28px 0" },
			children: "Opening Pokies Vault…"
		})
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "wrap",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "header-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "brand grad-text",
					children: "POKIES VAULT"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "header-actions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/fetch",
						className: "icon-action",
						"aria-label": "Open fetcher",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fetcher" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: menu ? "icon-action menu-open" : "icon-action",
						"aria-expanded": menu,
						"aria-label": "Open menu",
						onClick: () => setMenu(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Menu" })]
					})]
				})]
			}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "foot",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "age",
						children: "18+"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Gamble responsibly." }),
					" Only use money you can afford to lose. Need help?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://www.gamblinghelponline.org.au/",
						target: "_blank",
						rel: "noreferrer",
						children: "Gambling Help Online"
					}),
					" ",
					"— 1800 858 858 ·",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://www.betstop.gov.au/",
						target: "_blank",
						rel: "noreferrer",
						children: "BetStop"
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					style: { marginTop: 8 },
					children: ["Pokies Vault checks sites you already use. It does not take bets, sell fetches, or rent listings. Passwords stay in this browser.", path === "/fetch" ? "" : ` ${state.mine.length} saved account${state.mine.length === 1 ? "" : "s"}.`]
				})]
			}),
			menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "drawer-backdrop",
				onClick: () => setMenu(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "drawer",
					onClick: (event) => event.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "header-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Menu" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "menu-note",
								children: "Password stays on this device."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "pin",
								"aria-label": "Close menu",
								onClick: () => setMenu(false),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "menu-group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "menu-label",
								children: "Account"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "account-chip",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "menu-group",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "menu-label",
									children: "Go"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/",
									className: path === "/" ? "drawer-item on" : "drawer-item",
									onClick: () => setMenu(false),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Main list" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Domains and account cards" })] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/fetch",
									className: path === "/fetch" ? "drawer-item on" : "drawer-item",
									onClick: () => setMenu(false),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Fetcher" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Balances, share, referral, rebate" })] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/intel",
									className: path === "/intel" ? "drawer-item on" : "drawer-item",
									onClick: () => setMenu(false),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Domain Intel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Add, remove, and check domains" })] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/bonuses",
									className: path === "/bonuses" ? "drawer-item on" : "drawer-item",
									onClick: () => setMenu(false),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Bonus Finder" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Signup, share, daily, birthday" })] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "menu-group",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "menu-label",
									children: "List"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "drawer-item",
									onClick: () => {
										patch({ mineOnly: true });
										setMenu(false);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "My accounts" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
										state.mine.length,
										" site",
										state.mine.length === 1 ? "" : "s",
										" saved"
									] })] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "drawer-item",
									onClick: () => {
										setAdding(true);
										setMenu(false);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Add a domain" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Save a site into your accounts" })] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "menu-group",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "menu-label",
									children: "Device"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "theme-list",
									children: THEMES.map((theme) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: state.theme === theme.id ? "theme-card on" : "theme-card",
										onClick: () => patch({ theme: theme.id }),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "theme-swatch",
											style: { background: `linear-gradient(135deg, ${theme.a}, ${theme.b} 46%, ${theme.c})` }
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: theme.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: theme.hint })] })]
									}, theme.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "drawer-item danger",
									onClick: () => {
										if (window.confirm("Clear saved sites, domain intel, visits, and the password stored on this device?")) {
											clearAll();
											setMenu(false);
										}
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Clear this device" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Removes local vault data" })] })]
								})
							]
						})
					]
				})
			}) : null,
			adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal-backdrop",
				onClick: () => setAdding(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "modal-card stack",
					onClick: (event) => event.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Add a domain" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hint",
							children: "It is saved as one of your accounts and can be fetched with the same phone and password."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "text-input",
							value: domain,
							placeholder: "9au.com",
							autoCapitalize: "none",
							autoCorrect: "off",
							spellCheck: false,
							onChange: (event) => setDomain(event.target.value),
							onKeyDown: (event) => {
								if (event.key === "Enter") submitDomain();
							}
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "error-line",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn",
								onClick: () => setAdding(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-grad",
								onClick: submitDomain,
								children: "Save site"
							})]
						})
					]
				})
			}) : null
		]
	});
}
//#endregion
export { fetchCasinoBatchFn as a, useServerFn as c, fetchAllStatusesFn as i, checkSiteStatus as n, loadPublicCatalogueFn as o, createSsrRpc as r, lookupSiteIconFn as s, AppFrame as t };
