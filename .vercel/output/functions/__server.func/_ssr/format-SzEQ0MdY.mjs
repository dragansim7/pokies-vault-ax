import { i as __toESM } from "../_runtime.mjs";
import { G as isRedirect, S as require_jsx_runtime, Y as require_react, b as Link, p as useRouterState, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { d as Menu, i as UserRound, l as Plus, n as X, o as Trash2, s as Shield, t as Zap, u as Palette } from "../_libs/lucide-react.mjs";
import { n as useVault, s as THEMES } from "./router-Bnqcnrzc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-SzEQ0MdY.js
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
function AppFrame({ children }) {
	const path = useRouterState({ select: (state) => state.location.pathname });
	const { state, addDomain, clearAll, patch } = useVault();
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("list");
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Settings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your list only. No credits, no rentals." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "pin",
								"aria-label": "Close menu",
								onClick: () => setMenu(false),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "drawer-tabs",
							role: "tablist",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "tab",
								"aria-selected": tab === "list",
								className: tab === "list" ? "drawer-tab on" : "drawer-tab",
								onClick: () => setTab("list"),
								children: "List"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								role: "tab",
								"aria-selected": tab === "theme",
								className: tab === "theme" ? "drawer-tab on" : "drawer-tab",
								onClick: () => setTab("theme"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { size: 14 }), "Theme"]
							})]
						}),
						tab === "theme" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
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
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/fetch",
								className: "drawer-item",
								onClick: () => setMenu(false),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Bonus fetcher" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Balances, share, referral, rebate" })] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "drawer-item",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Same login on each site" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Phone and password, this browser only" })] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "drawer-item",
								onClick: () => {
									if (window.confirm("Clear saved sites, visits, and the password stored on this device?")) {
										clearAll();
										setMenu(false);
									}
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Clear this device" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Removes local vault data" })] })]
							})
						] })
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
function SiteIcon({ domain }) {
	const [src, setSrc] = (0, import_react.useState)(`https://intel.bestpokieslist.online/favicon/${domain}`);
	(0, import_react.useEffect)(() => setSrc(`https://intel.bestpokieslist.online/favicon/${domain}`), [domain]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		className: "site-icon",
		src,
		alt: "",
		referrerPolicy: "no-referrer",
		loading: "lazy",
		decoding: "async",
		onError: () => setSrc((current) => current === "/site-fallback.jpg" ? current : "/site-fallback.jpg")
	});
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
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("31be5b99ae9ca7c2d3b8e9741a2c29430bf663b3f4938f9ae4aa643a22c14f45"));
var fetchCasinoBatchFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("461c07027b2a8c58a6fe2f0a00682e43be45789d096410e713e3e5b3f4767738"));
var fetchAllStatusesFn = createServerFn({ method: "POST" }).validator((data) => data ?? {}).handler(createSsrRpc("bbaccc3e2239274bbee08332c5f8909ed44347b3bf93b9b721830ca8434ad3bf"));
var checkSiteStatus = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("74839dc983bbaacaaaed2f59d289f93c284acf8e34a8e5f8f2b0a8b1a890e640"));
function money(amount) {
	const value = Number(amount ?? 0);
	if (!Number.isFinite(value)) return "$0.00";
	return new Intl.NumberFormat("en-AU", {
		style: "currency",
		currency: "AUD",
		maximumFractionDigits: 2
	}).format(value);
}
function formatAdded(value) {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return `${new Intl.DateTimeFormat("en-AU", {
		timeZone: "Australia/Melbourne",
		day: "2-digit",
		month: "2-digit",
		year: "numeric"
	}).format(date)} · ${new Intl.DateTimeFormat("en-AU", {
		timeZone: "Australia/Melbourne",
		hour: "numeric",
		minute: "2-digit",
		hour12: true
	}).format(date)}`;
}
//#endregion
export { fetchCasinoBatchFn as a, useServerFn as c, fetchAllStatusesFn as i, SiteIcon as n, formatAdded as o, checkSiteStatus as r, money as s, AppFrame as t };
