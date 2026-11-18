import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as ChevronDown, v as ChevronUp } from "../_libs/lucide-react.mjs";
import { a as visibleSites, n as useVault } from "./router-BfFQn0Bu.mjs";
import { c as useServerFn, o as loadPublicCatalogueFn, t as AppFrame } from "./shell-0JW2-gGZ.mjs";
import { t as bestBonus } from "./public-bonus-COQM9xVb.mjs";
import { i as moneyShort, t as SiteIcon } from "./format-DEur2zEy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bonuses-Bn0E8Qgi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SLOTS = [
	{
		key: "signup",
		label: "SIGNUP"
	},
	{
		key: "share",
		label: "SHARE"
	},
	{
		key: "daily",
		label: "DAILY"
	},
	{
		key: "birthday",
		label: "BIRTHDAY"
	}
];
function bound(value) {
	return value != null && value > 0 ? moneyShort(value) : "—";
}
function BonusCard({ domain, rank, bonuses, message }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const listed = bonuses ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "acct",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "acct-head",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteIcon, { domain }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "acct-id",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "acct-title",
							children: [rank != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "acct-rank",
								children: [rank, "."]
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "acct-domain",
								href: `https://${domain}/`,
								target: "_blank",
								rel: "noreferrer",
								children: domain
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "acct-age",
							children: bonuses == null ? "Not loaded" : message ? message : `${listed.length} published`
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "acct-side",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "acct-toggle",
							"aria-expanded": open,
							"aria-label": open ? "Hide bonuses" : "Show bonuses",
							onClick: () => setOpen((value) => !value),
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { size: 18 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { size: 18 })
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "acct-chips slots",
				children: SLOTS.map((slot) => {
					const found = bestBonus(listed, slot.key);
					const bonus = found && found.kind !== "unset" ? found : null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: bonus ? "acct-chip hot" : "acct-chip",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: slot.label }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: bonus ? bonus.amountDisplay : "—" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
								"↓ ",
								bound(bonus?.minWithdraw ?? null),
								" ↑ ",
								bound(bonus?.maxWithdraw ?? null)
							] })
						]
					}, slot.key);
				})
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "acct-drop",
				children: listed.length ? listed.map((bonus) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "acct-bonus",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: bonus.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						bonus.slot === "other" ? "Other" : bonus.slot,
						" · ",
						bonus.kind,
						bonus.rollover != null ? ` · Rollover ${bonus.rollover}x` : "",
						bonus.minDeposit != null ? ` · Deposit ${moneyShort(bonus.minDeposit)}` : "",
						` · Min ${bound(bonus.minWithdraw)} · Max ${bound(bonus.maxWithdraw)}`
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: bonus.amountDisplay })]
				}, `${bonus.id}-${bonus.name}`)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hint",
					children: message || "No public bonuses loaded for this domain yet."
				})
			}) : null
		]
	});
}
var CACHE_KEY = "pokies_vault_bonus_catalogue_v1";
var PAGE = 20;
var EMPTY_FILTERS = {
	slots: [],
	kind: "any",
	amountMin: "",
	amountMax: "",
	rollMin: "",
	rollMax: "",
	maxMin: "",
	maxMax: "",
	sort: "list"
};
function readCache() {
	if (typeof localStorage === "undefined") return {};
	try {
		const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		return {};
	}
}
function writeCache(cache) {
	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
	} catch {}
}
function numberOrNull(value) {
	if (!value.trim()) return null;
	const n = Number(value);
	return Number.isFinite(n) ? n : null;
}
function passes(bonus, filters) {
	if (filters.slots.length && (bonus.slot === "other" || !filters.slots.includes(bonus.slot))) return false;
	if (filters.kind !== "any" && bonus.kind !== filters.kind) return false;
	const amountMin = numberOrNull(filters.amountMin);
	const amountMax = numberOrNull(filters.amountMax);
	const rollMin = numberOrNull(filters.rollMin);
	const rollMax = numberOrNull(filters.rollMax);
	const maxMin = numberOrNull(filters.maxMin);
	const maxMax = numberOrNull(filters.maxMax);
	if (amountMin != null && bonus.amount < amountMin) return false;
	if (amountMax != null && bonus.amount > amountMax) return false;
	if (rollMin != null && (bonus.rollover == null || bonus.rollover < rollMin)) return false;
	if (rollMax != null && (bonus.rollover == null || bonus.rollover > rollMax)) return false;
	if (maxMin != null && (bonus.maxWithdraw == null || bonus.maxWithdraw < maxMin)) return false;
	if (maxMax != null && (bonus.maxWithdraw == null || bonus.maxWithdraw > maxMax)) return false;
	return true;
}
function filtersActive(filters) {
	return filters.slots.length > 0 || filters.kind !== "any" || filters.amountMin !== "" || filters.amountMax !== "" || filters.rollMin !== "" || filters.rollMax !== "" || filters.maxMin !== "" || filters.maxMax !== "";
}
function score(bonuses, filters) {
	const pool = bonuses.filter((bonus) => passes(bonus, filters));
	if (filters.sort === "rollover") {
		const rolls = pool.map((bonus) => bonus.rollover).filter((value) => value != null);
		return rolls.length ? Math.min(...rolls) : Number.POSITIVE_INFINITY;
	}
	if (filters.sort === "cashout") {
		const maxes = pool.map((bonus) => bonus.maxWithdraw).filter((value) => value != null);
		return maxes.length ? Math.max(...maxes) : -1;
	}
	return pool.reduce((best, bonus) => Math.max(best, bonus.amount), 0);
}
function BonusFinder() {
	const { state } = useVault();
	const loadFn = useServerFn(loadPublicCatalogueFn);
	const loadRef = (0, import_react.useRef)(loadFn);
	loadRef.current = loadFn;
	const [query, setQuery] = (0, import_react.useState)("");
	const [filters, setFilters] = (0, import_react.useState)(EMPTY_FILTERS);
	const [cache, setCache] = (0, import_react.useState)({});
	const [page, setPage] = (0, import_react.useState)(0);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)({
		done: 0,
		total: 0
	});
	const [status, setStatus] = (0, import_react.useState)("Same domains as the main list. Load bonuses to fill the cards.");
	const stopRef = (0, import_react.useRef)(null);
	const ready = (0, import_react.useRef)(false);
	const domains = (0, import_react.useMemo)(() => visibleSites(state).map((site) => site.domain), [state]);
	(0, import_react.useEffect)(() => {
		const saved = readCache();
		const allowed = new Set(domains);
		const next = {};
		for (const [domain, row] of Object.entries(saved)) if (allowed.has(domain)) next[domain] = row;
		setCache(next);
		if (Object.keys(next).length !== Object.keys(saved).length) writeCache(next);
		ready.current = true;
	}, [domains]);
	(0, import_react.useEffect)(() => {
		if (!ready.current) return;
		writeCache(cache);
	}, [cache]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		let list = domains.filter((domain) => !q || domain.includes(q));
		if (filtersActive(filters)) list = list.filter((domain) => {
			const row = cache[domain];
			if (!row) return false;
			return row.bonuses.some((bonus) => passes(bonus, filters));
		});
		if (filters.sort === "az") return [...list].sort((a, b) => a.localeCompare(b));
		if (filters.sort === "list") return list;
		const direction = filters.sort === "rollover" ? 1 : -1;
		return [...list].sort((a, b) => {
			return (score(cache[a]?.bonuses ?? [], filters) - score(cache[b]?.bonuses ?? [], filters)) * direction || a.localeCompare(b);
		});
	}, [
		domains,
		query,
		filters,
		cache
	]);
	const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
	const safePage = Math.min(page, pages - 1);
	const slice = filtered.slice(safePage * PAGE, safePage * PAGE + PAGE);
	function toggleSlot(slot) {
		setPage(0);
		setFilters((current) => ({
			...current,
			slots: current.slots.includes(slot) ? current.slots.filter((item) => item !== slot) : [...current.slots, slot]
		}));
	}
	async function load(domainsToLoad) {
		const unique = Array.from(new Set(domainsToLoad));
		if (!unique.length) {
			setStatus("No domains to load.");
			return;
		}
		stopRef.current?.abort();
		const controller = new AbortController();
		stopRef.current = controller;
		setRunning(true);
		setProgress({
			done: 0,
			total: unique.length
		});
		setStatus(`Loading public bonuses for ${unique.length} domains…`);
		let done = 0;
		let cursor = 0;
		const worker = async () => {
			for (;;) {
				if (controller.signal.aborted) return;
				const index = cursor;
				cursor += 4;
				const batch = unique.slice(index, index + 4);
				if (!batch.length) return;
				try {
					const result = await loadRef.current({
						data: { domains: batch },
						signal: controller.signal
					});
					if (controller.signal.aborted) return;
					setCache((current) => {
						const next = { ...current };
						for (const row of result) next[row.domain] = row.ok ? { bonuses: row.bonuses } : {
							bonuses: [],
							message: row.message
						};
						return next;
					});
				} catch {
					if (controller.signal.aborted) return;
					setCache((current) => {
						const next = { ...current };
						for (const domain of batch) if (!next[domain]) next[domain] = {
							bonuses: [],
							message: "Could not load"
						};
						return next;
					});
				}
				done += batch.length;
				setProgress({
					done: Math.min(done, unique.length),
					total: unique.length
				});
			}
		};
		await Promise.all(Array.from({ length: Math.min(2, Math.ceil(unique.length / 4)) }, () => worker()));
		setRunning(false);
		setStatus(controller.signal.aborted ? "Stopped." : "Public bonuses loaded. No password was used.");
	}
	const loadedCount = domains.filter((domain) => cache[domain]).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "stack",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "section-label",
						children: "Bonus Finder"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hint",
						children: "The same domains as the main list. Add or remove one in Domain Intel and it changes here. Bonuses are the public signup, share, daily, and birthday offers. No sign-in."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "search",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							placeholder: "Search this list",
							"aria-label": "Search domains",
							onChange: (event) => {
								setQuery(event.target.value);
								setPage(0);
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "finder-slots",
						children: [
							["signup", "Signup"],
							["share", "Share"],
							["daily", "Daily"],
							["birthday", "Birthday"]
						].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: filters.slots.includes(id) ? "tool active" : "tool",
							onClick: () => toggleSlot(id),
							children: label
						}, id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "finder-grid",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Sort", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filters.sort,
								onChange: (event) => {
									setPage(0);
									setFilters((current) => ({
										...current,
										sort: event.target.value
									}));
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "list",
										children: "List order"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "az",
										children: "Domain A–Z"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "amount",
										children: "Highest amount"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "rollover",
										children: "Lowest rollover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "cashout",
										children: "Highest max cashout"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Amount type", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filters.kind,
								onChange: (event) => {
									setPage(0);
									const kind = event.target.value;
									setFilters((current) => ({
										...current,
										kind: kind === "fixed" || kind === "percent" || kind === "random" ? kind : "any"
									}));
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "any",
										children: "Any"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "fixed",
										children: "Fixed amount"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "percent",
										children: "Percent"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "random",
										children: "Random range"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Amount from", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								inputMode: "decimal",
								value: filters.amountMin,
								onChange: (event) => setFilters((current) => ({
									...current,
									amountMin: event.target.value
								}))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Amount to", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								inputMode: "decimal",
								value: filters.amountMax,
								onChange: (event) => setFilters((current) => ({
									...current,
									amountMax: event.target.value
								}))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Rollover from", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								inputMode: "decimal",
								value: filters.rollMin,
								onChange: (event) => setFilters((current) => ({
									...current,
									rollMin: event.target.value
								}))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Rollover to", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								inputMode: "decimal",
								value: filters.rollMax,
								onChange: (event) => setFilters((current) => ({
									...current,
									rollMax: event.target.value
								}))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Max cashout from", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								inputMode: "decimal",
								value: filters.maxMin,
								onChange: (event) => setFilters((current) => ({
									...current,
									maxMin: event.target.value
								}))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Max cashout to", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								inputMode: "decimal",
								value: filters.maxMax,
								onChange: (event) => setFilters((current) => ({
									...current,
									maxMax: event.target.value
								}))
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hint",
						children: "Amount is dollars for a fixed bonus and the percent number for a percent bonus."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "actions",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-grad",
								disabled: running || slice.length === 0,
								onClick: () => void load(slice),
								children: "Load this page"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn",
								disabled: running || filtered.length === 0,
								onClick: () => void load(filtered),
								children: "Load list"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn",
								disabled: !running,
								onClick: () => stopRef.current?.abort(),
								children: "Stop"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "progress-line",
						children: [
							status,
							" ",
							domains.length,
							" domains · ",
							loadedCount,
							" loaded",
							running ? ` · ${progress.done} / ${progress.total}` : ""
						]
					})
				]
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "empty",
				children: "No domains match."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "cards",
				children: slice.map((domain, index) => {
					const row = cache[domain];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BonusCard, {
						domain,
						rank: safePage * PAGE + index + 1,
						bonuses: row ? row.bonuses : null,
						message: row?.message
					}, domain);
				})
			}),
			pages > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pager",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn",
						disabled: safePage === 0,
						onClick: () => setPage(safePage - 1),
						children: "Previous"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Page ",
						safePage + 1,
						" / ",
						pages
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn",
						disabled: safePage >= pages - 1,
						onClick: () => setPage(safePage + 1),
						children: "Next"
					})
				]
			}) : null
		]
	});
}
function BonusesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BonusFinder, {}) });
}
//#endregion
export { BonusesPage as component };
