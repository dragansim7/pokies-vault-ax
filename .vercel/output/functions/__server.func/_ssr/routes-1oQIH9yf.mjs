import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Search, f as Eye, g as ArrowUpDown, h as Bookmark, n as X, r as Wallet } from "../_libs/lucide-react.mjs";
import { n as useVault } from "./router-CSjmOi0t.mjs";
import { a as formatAdded, c as useServerFn, n as CATALOG, o as initials, r as checkSiteStatus, s as money, t as AppFrame } from "./format-DC-2W_RD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-1oQIH9yf.js
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
var STATUS_LABEL = {
	checking: "Checking",
	live: "Live",
	slow: "Slow",
	redirect: "Redirect",
	dead: "Down"
};
function bonusOf(row, mode) {
	if (mode === "none") return null;
	return row[mode];
}
function SiteIcon({ domain }) {
	const tones = [
		"tone-cyan",
		"tone-violet",
		"tone-pink",
		"tone-live"
	];
	const tone = tones[domain.charCodeAt(0) % tones.length] ?? "tone-cyan";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `site-fallback ${tone}`,
		children: initials(domain)
	});
}
function Directory() {
	const { state, patch, markVisited, toggleMine } = useVault();
	const statusFn = useServerFn(checkSiteStatus);
	const [query, setQuery] = (0, import_react.useState)("");
	const [searchReady, setSearchReady] = (0, import_react.useState)(false);
	const [sortOpen, setSortOpen] = (0, import_react.useState)(false);
	const [statuses, setStatuses] = (0, import_react.useState)({});
	const seen = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const queue = (0, import_react.useRef)([]);
	const running = (0, import_react.useRef)(0);
	const statusFnRef = (0, import_react.useRef)(statusFn);
	statusFnRef.current = statusFn;
	(0, import_react.useEffect)(() => {
		setSearchReady(true);
	}, []);
	const fetchMap = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const row of state.lastFetch?.rows ?? []) map.set(row.domain, row);
		return map;
	}, [state.lastFetch]);
	const sites = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const site of CATALOG) map.set(site.domain, site);
		for (const site of state.custom) if (!map.has(site.domain)) map.set(site.domain, {
			domain: site.domain,
			group: "custom",
			addedAt: site.addedAt
		});
		return [...map.values()];
	}, [state.custom]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		let list = sites.filter((site) => {
			if (state.mineOnly && !state.mine.includes(site.domain)) return false;
			if (state.notVisited && state.visited.includes(site.domain)) return false;
			if (q && !site.domain.includes(q)) return false;
			return true;
		});
		const cashOf = (domain) => {
			const row = fetchMap.get(domain);
			return row?.ok ? row.cash : -1;
		};
		if (state.sort === "az") list = [...list].sort((a, b) => a.domain.localeCompare(b.domain));
		if (state.sort === "za") list = [...list].sort((a, b) => b.domain.localeCompare(a.domain));
		if (state.sort === "new") list = [...list].sort((a, b) => String(b.addedAt).localeCompare(String(a.addedAt)));
		if (state.sort === "balance") list = [...list].sort((a, b) => cashOf(b.domain) - cashOf(a.domain) || a.domain.localeCompare(b.domain));
		return list;
	}, [
		sites,
		query,
		state.mineOnly,
		state.mine,
		state.notVisited,
		state.visited,
		state.sort,
		fetchMap
	]);
	const grouped = state.sort === "default" && !query.trim() && !state.mineOnly && !state.notVisited;
	(0, import_react.useEffect)(() => {
		const nodes = document.querySelectorAll("[data-status-domain]");
		const pump = () => {
			while (running.current < 4 && queue.current.length) {
				const domain = queue.current.shift();
				if (!domain) break;
				running.current += 1;
				statusFnRef.current({ data: { domain } }).then((result) => {
					setStatuses((current) => ({
						...current,
						[domain]: result.status
					}));
					try {
						sessionStorage.setItem(`vault-status:${domain}`, JSON.stringify({
							at: Date.now(),
							status: result.status
						}));
					} catch {}
				}).catch(() => {
					setStatuses((current) => ({
						...current,
						[domain]: "dead"
					}));
				}).finally(() => {
					running.current -= 1;
					pump();
				});
			}
		};
		const enqueue = (domain) => {
			if (seen.current.has(domain)) return;
			seen.current.add(domain);
			try {
				const cached = sessionStorage.getItem(`vault-status:${domain}`);
				if (cached) {
					const parsed = JSON.parse(cached);
					if (Date.now() - parsed.at < 6e5) {
						setStatuses((current) => ({
							...current,
							[domain]: parsed.status
						}));
						return;
					}
				}
			} catch {}
			setStatuses((current) => ({
				...current,
				[domain]: "checking"
			}));
			queue.current.push(domain);
			pump();
		};
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				const domain = entry.target.dataset.statusDomain;
				if (domain) enqueue(domain);
			}
		}, { rootMargin: "160px" });
		nodes.forEach((node) => observer.observe(node));
		return () => observer.disconnect();
	}, [
		filtered,
		grouped,
		state.view
	]);
	function renderCard(site, compact = false) {
		const row = fetchMap.get(site.domain);
		const status = statuses[site.domain] ?? "checking";
		const bonus = row?.ok ? bonusOf(row, state.bonusMode) : null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: compact ? "site-card compact" : "site-card",
			"data-status-domain": site.domain,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				className: "site-hit",
				href: `https://${site.domain}/`,
				target: "_blank",
				rel: "noreferrer",
				onClick: () => markVisited(site.domain),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteIcon, { domain: site.domain }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "site-copy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "site-domain",
							children: site.domain
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `site-meta ${status}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
								STATUS_LABEL[status],
								site.addedAt ? ` · ${formatAdded(site.addedAt)}` : ""
							]
						}),
						state.wallets ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: row && !row.ok ? "wallet-line warn" : "wallet-line",
							children: !row ? "No fetch yet" : row.ok ? `${money(row.cash)} ${row.cashWalletName}` : row.message
						}) : null,
						bonus ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "wallet-line",
							children: [
								bonus.name,
								" ",
								bonus.amountDisplay
							]
						}) : null
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: state.mine.includes(site.domain) ? "pin on" : "pin",
				"aria-label": state.mine.includes(site.domain) ? `Remove ${site.domain} from my accounts` : `Save ${site.domain}`,
				onClick: () => toggleMine(site.domain),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, {
					size: 16,
					fill: state.mine.includes(site.domain) ? "currentColor" : "none"
				})
			})]
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
					children: filtered.filter((site) => site.group === group).map((site) => renderCard(site, true))
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
				children: items.map((site) => renderCard(site))
			})] }, group);
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: state.view === "one" ? "cards view-one" : state.view === "two" ? "cards view-two" : "cards",
			children: filtered.map((site) => renderCard(site, state.view !== "one"))
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
					[
						["default", "Featured groups"],
						["az", "Domain A–Z"],
						["za", "Domain Z–A"],
						["new", "Newest added"],
						["balance", "Wallet balance"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: state.sort === id ? "choice on" : "choice",
						onClick: () => patch({ sort: id }),
						children: label
					}, id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "section-label",
						children: "Show on cards"
					}),
					[
						["none", "Nothing extra"],
						["new", "Welcome"],
						["share", "Share"],
						["commission", "Commission"],
						["referral", "Referral"],
						["rebate", "Rebate"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: state.bonusMode === id ? "choice on" : "choice",
						onClick: () => patch({ bonusMode: id }),
						children: label
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "The fetch" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The same phone and password is tried on the wallet login these sites share. A hit keeps the site. A rejection does not." })]
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
