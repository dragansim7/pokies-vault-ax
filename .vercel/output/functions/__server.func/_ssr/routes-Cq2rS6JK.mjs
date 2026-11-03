import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as Eye, l as Search, n as X, r as Wallet, x as ArrowUpDown } from "../_libs/lucide-react.mjs";
import { i as compareSites, n as useVault, o as visibleSites } from "./router-C9f5wAn0.mjs";
import { n as checkSiteStatus, o as useServerFn, r as fetchAllStatusesFn, t as AppFrame } from "./casino.functions-BkJvSt0N.mjs";
import { t as AccountCard } from "./account-card-CPdVCeql.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cq2rS6JK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GROUP_LABEL = {
	new: "New",
	best: "Best",
	unverified: "Unverified",
	share: "Instant share bonuses",
	latest: "Latest",
	custom: "Added by you"
};
var STATUS_CACHE_KEY = "vault-statuses";
var STATUS_CACHE_TTL = 9e5;
function readStatusCache() {
	if (typeof localStorage === "undefined") return null;
	try {
		const raw = localStorage.getItem(STATUS_CACHE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed.at || !parsed.map || Date.now() - parsed.at >= STATUS_CACHE_TTL) return null;
		return parsed.map;
	} catch {
		return null;
	}
}
function writeStatusCache(map) {
	try {
		localStorage.setItem(STATUS_CACHE_KEY, JSON.stringify({
			at: Date.now(),
			map
		}));
	} catch {}
}
function bonusSortName(mode) {
	if (mode === "new") return "Signup bonus";
	if (mode === "commission") return "Commission";
	if (mode === "referral") return "Referral";
	if (mode === "rebate") return "Rebate";
	return "Share";
}
function Directory() {
	const { state, patch, markVisited, toggleMine } = useVault();
	const statusFn = useServerFn(checkSiteStatus);
	const allStatusesFn = useServerFn(fetchAllStatusesFn);
	const statusFnRef = (0, import_react.useRef)(statusFn);
	const allStatusesFnRef = (0, import_react.useRef)(allStatusesFn);
	statusFnRef.current = statusFn;
	allStatusesFnRef.current = allStatusesFn;
	const [query, setQuery] = (0, import_react.useState)("");
	const [searchReady, setSearchReady] = (0, import_react.useState)(false);
	const [sortOpen, setSortOpen] = (0, import_react.useState)(false);
	const [statuses, setStatuses] = (0, import_react.useState)(() => readStatusCache() ?? {});
	(0, import_react.useEffect)(() => {
		setSearchReady(true);
	}, []);
	const fetchMap = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const row of state.lastFetch?.rows ?? []) map.set(row.domain, row);
		return map;
	}, [state.lastFetch]);
	const sites = (0, import_react.useMemo)(() => visibleSites(state), [state]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		let list = sites.filter((site) => {
			if (state.mineOnly && !state.mine.includes(site.domain)) return false;
			if (state.notVisited && state.visited.includes(site.domain)) return false;
			if (q && !site.domain.includes(q)) return false;
			return true;
		});
		return state.sort === "default" ? list : [...list].sort((a, b) => compareSites(a, b, fetchMap.get(a.domain), fetchMap.get(b.domain), state.sort, state.bonusMode));
	}, [
		sites,
		query,
		state.mineOnly,
		state.mine,
		state.notVisited,
		state.visited,
		state.sort,
		state.bonusMode,
		fetchMap
	]);
	const grouped = state.sort === "default" && !query.trim() && !state.mineOnly && !state.notVisited;
	const domainKey = sites.map((site) => site.domain).join("\n");
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const domains = domainKey ? domainKey.split("\n") : [];
		const probeMissing = async (map) => {
			const missing = domains.filter((domain) => !(domain in map));
			const probe = missing.slice(0, 40);
			const next = { ...map };
			for (const domain of missing.slice(40)) next[domain] = "unknown";
			if (!probe.length || cancelled) return next;
			if (!cancelled) setStatuses({ ...next });
			let cursor = 0;
			const worker = async () => {
				for (;;) {
					if (cancelled) return;
					const index = cursor;
					cursor += 1;
					if (index >= probe.length) return;
					const domain = probe[index] ?? "";
					try {
						const result = await statusFnRef.current({ data: { domain } });
						next[domain] = result.status;
					} catch {
						next[domain] = "dead";
					}
					if (!cancelled) setStatuses({ ...next });
				}
			};
			await Promise.all(Array.from({ length: Math.min(4, probe.length) }, () => worker()));
			return next;
		};
		const cached = readStatusCache();
		if (cached) {
			setStatuses(cached);
			if (domains.filter((domain) => !(domain in cached)).length) probeMissing(cached).then((filled) => {
				if (!cancelled) writeStatusCache(filled);
			});
			return () => {
				cancelled = true;
			};
		}
		(async () => {
			let map = {};
			try {
				map = await allStatusesFnRef.current({ data: {} });
			} catch {
				map = {};
			}
			if (cancelled) return;
			setStatuses(map);
			const filled = await probeMissing(map);
			if (!cancelled) writeStatusCache(filled);
		})();
		return () => {
			cancelled = true;
		};
	}, [domainKey]);
	function renderCard(site, index) {
		const row = fetchMap.get(site.domain);
		const account = row?.ok ? row : null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountCard, {
			domain: site.domain,
			rank: index + 1,
			addedAt: site.addedAt,
			status: statuses[site.domain] ?? "checking",
			account,
			saved: state.mine.includes(site.domain),
			onVisit: () => markVisited(site.domain),
			onToggleSave: () => toggleMine(site.domain)
		}, site.domain);
	}
	const visitedCount = sites.filter((site) => state.visited.includes(site.domain)).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "toolbar",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "tool-row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: state.notVisited ? "tool active" : "tool",
							onClick: () => patch({ notVisited: !state.notVisited }),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
									size: 12,
									style: {
										display: "inline",
										marginRight: 3
									}
								}),
								"Not visited: ",
								state.notVisited ? "On" : "Off"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "tool",
							onClick: () => patch({ view: state.view === "default" ? "one" : state.view === "one" ? "two" : "default" }),
							children: ["View: ", state.view === "default" ? "Groups" : state.view === "one" ? "One" : "Two"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: state.wallets ? "tool active" : "tool",
							onClick: () => patch({ wallets: !state.wallets }),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, {
									size: 12,
									style: {
										display: "inline",
										marginRight: 3
									}
								}),
								"Wallets: ",
								state.wallets ? "On" : "Off"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "tool",
							onClick: () => setSortOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, {
								size: 12,
								style: {
									display: "inline",
									marginRight: 3
								}
							}), "Sort / filter"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "search",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 16 }),
						searchReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							placeholder: "Search casinos or domains",
							"aria-label": "Search casinos or domains",
							onChange: (event) => setQuery(event.target.value)
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "search-ghost",
							children: "Search casinos or domains"
						}),
						query ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "pin",
							"aria-label": "Clear search",
							onClick: () => setQuery(""),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 16 })
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "stats",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Sites ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: sites.length })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Visited ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: visitedCount })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["My accounts ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: state.mine.length })] })
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "banner",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "How your accounts work" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Bookmark a site, then open the fetcher and sign in with the phone number and password you already use. Only sites that accept that login are kept. Nothing here is paid — no fetch packs and no rented cards." })] })
		}),
		filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "empty",
			children: "No matching sites."
		}) : null,
		grouped && state.view === "default" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "feature-frame",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "top-cols",
				children: [
					"new",
					"best",
					"unverified"
				].map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: GROUP_LABEL[group] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "top-col",
					children: filtered.filter((site) => site.group === group).map((site, index) => renderCard(site, index))
				})] }, group))
			})
		}), [
			"share",
			"custom",
			"latest"
		].map((group) => {
			const items = filtered.filter((site) => site.group === group);
			if (!items.length) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "section-label",
				children: [
					GROUP_LABEL[group],
					" · ",
					items.length
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "cards",
				children: items.map((site, index) => renderCard(site, index))
			})] }, group);
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: state.view === "one" ? "cards view-one" : state.view === "two" ? "cards view-two" : "cards",
			children: filtered.map((site, index) => renderCard(site, index))
		}),
		sortOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "modal-backdrop",
			onClick: () => setSortOpen(false),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "modal-card",
				onClick: (event) => event.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "header-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Sort and filter" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "pin",
							"aria-label": "Close",
							onClick: () => setSortOpen(false),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Sort by" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hint",
						children: "Same order for the homepage cards and the bonus fetcher results."
					}),
					[
						["default", "Default order"],
						["az", "Domain name — A → Z"],
						["za", "Domain name — Z → A"],
						["balance", "Highest balance"],
						["turnover", "Best turnover"],
						["cashout", "Lowest cash-out"],
						["errors", "Errors"],
						["popular", "Most popular"],
						["norefer", "Accounts without referlinks"],
						["shareAmount", `${bonusSortName(state.bonusMode)} — biggest amount`],
						["shareMax", `${bonusSortName(state.bonusMode)} — highest max`],
						["shareTurn", `${bonusSortName(state.bonusMode)} — lowest turnover`],
						["new", "Newest"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: state.sort === id ? "choice on" : "choice",
						onClick: () => patch({ sort: id }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "radio" }), label]
					}, id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "section-label",
						children: "Bonus display"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hint",
						children: "Highlights that bonus on every card. The three “chosen bonus” sorts above use it."
					}),
					[
						[
							"none",
							"None",
							""
						],
						[
							"new",
							"Signup bonus",
							"🎁"
						],
						[
							"share",
							"Share bonus",
							"🤝"
						],
						[
							"commission",
							"Commission",
							"💸"
						],
						[
							"referral",
							"Referral bonus",
							"👥"
						],
						[
							"rebate",
							"Rebate bonus",
							"♻️"
						]
					].map(([id, label, emoji]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: state.bonusMode === id ? "choice on" : "choice",
						onClick: () => patch({ bonusMode: id }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "radio" }),
							emoji ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								children: emoji
							}) : null,
							label
						]
					}, id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: state.mineOnly ? "choice on" : "choice",
						onClick: () => patch({ mineOnly: !state.mineOnly }),
						children: "My accounts only"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-grad",
						style: {
							marginTop: 12,
							width: "100%"
						},
						onClick: () => setSortOpen(false),
						children: "Done"
					})
				]
			})
		}) : null
	] });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppFrame, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Directory, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "story",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "One place for the sites you actually use" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "story-grid",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "story-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "The list" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "New, best, unverified, share, and the long tail stay grouped. Search, hide sites you have already opened, and bookmark only the ones that are yours." })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "story-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "The fetch" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The login that worked is remembered for that site and tried first next time. New sites use the phone and password you enter. A hit keeps the site. A rejection does not." })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "story-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "What you see" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Cash, commission, share, referral, welcome, and rebate — plus the rest of the bonuses sitting on the account. Unlimited checks. No credits to buy." })]
				})
			]
		})]
	})] });
}
//#endregion
export { Home as component };
