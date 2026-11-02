import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as normalizeDomain, t as isPublicDomain } from "./domain-CILCWuBu.mjs";
import { g as ChevronLeft, p as LoaderCircle } from "../_libs/lucide-react.mjs";
import { c as INTEL_KEY, l as domainsFromText, n as useVault, s as workingSites } from "./router-ColQBS1E.mjs";
import { a as useServerFn, n as checkSiteStatus, r as fetchAllStatusesFn, t as AppFrame } from "./casino.functions-BDU87UJW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/intel-Dy5TNPL5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = INTEL_KEY;
var DIRECT_LIMIT = 40;
var LABEL = {
	checking: "Checking",
	live: "Up",
	slow: "Slow",
	redirect: "Redirect",
	dead: "Down",
	unknown: "Unknown"
};
function readSaved() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return {
			domains: [],
			checks: {}
		};
		const parsed = JSON.parse(raw);
		const domains = Array.isArray(parsed.domains) ? parsed.domains.map((item) => normalizeDomain(String(item))).filter(isPublicDomain) : [];
		const checks = {};
		if (parsed.checks && typeof parsed.checks === "object") for (const [domain, value] of Object.entries(parsed.checks)) {
			if (!value || value.status === "checking") continue;
			checks[domain] = value;
		}
		return {
			domains: Array.from(new Set(domains)),
			checks
		};
	} catch {
		return {
			domains: [],
			checks: {}
		};
	}
}
function DomainIntel() {
	const { ready: vaultReady, state, addManaged, removeManaged } = useVault();
	const statusFn = useServerFn(checkSiteStatus);
	const allStatusesFn = useServerFn(fetchAllStatusesFn);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [checks, setChecks] = (0, import_react.useState)({});
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [entry, setEntry] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [running, setRunning] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)({
		done: 0,
		total: 0
	});
	const stopRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const allRef = (0, import_react.useRef)(null);
	const domains = (0, import_react.useMemo)(() => workingSites(state.custom, state.removed).map((site) => site.domain), [state.custom, state.removed]);
	const shown = (0, import_react.useMemo)(() => {
		const q = filter.trim().toLowerCase();
		return q ? domains.filter((domain) => domain.includes(q)) : domains;
	}, [domains, filter]);
	const migrated = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!vaultReady || migrated.current) return;
		migrated.current = true;
		const saved = readSaved();
		setChecks(saved.checks);
		if (saved.domains.length) {
			addManaged(saved.domains);
			try {
				localStorage.setItem(KEY, JSON.stringify({ checks: saved.checks }));
			} catch {}
		}
		setReady(true);
	}, [vaultReady, addManaged]);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		try {
			localStorage.setItem(KEY, JSON.stringify({ checks }));
		} catch {}
	}, [ready, checks]);
	const allSelected = shown.length > 0 && shown.every((domain) => selected.has(domain));
	const someSelected = shown.some((domain) => selected.has(domain)) && !allSelected;
	(0, import_react.useEffect)(() => {
		if (allRef.current) allRef.current.indeterminate = someSelected;
	}, [someSelected]);
	const counts = (0, import_react.useMemo)(() => {
		let up = 0;
		let slow = 0;
		let redirect = 0;
		let down = 0;
		for (const domain of domains) {
			const status = checks[domain]?.status;
			if (status === "live") up += 1;
			else if (status === "slow") slow += 1;
			else if (status === "redirect") redirect += 1;
			else if (status === "dead") down += 1;
		}
		return {
			up,
			slow,
			redirect,
			down
		};
	}, [domains, checks]);
	function submitOne() {
		const domain = normalizeDomain(entry);
		if (!isPublicDomain(domain)) {
			setError("Enter a domain like yeah96.com");
			setNote("");
			return;
		}
		if (!addManaged([domain])) {
			setError("That domain is already in the list.");
			setNote("");
			return;
		}
		setEntry("");
		setError("");
		setNote(`Added ${domain}. It is on the main list and in the fetcher.`);
	}
	function onFile(file) {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			const text = typeof reader.result === "string" ? reader.result : "";
			const found = domainsFromText(text);
			if (!found.length) {
				setError("No domains found. Use one domain per line.");
				setNote("");
				return;
			}
			const added = addManaged(found);
			setError("");
			setNote(`Imported ${added} new domain${added === 1 ? "" : "s"} from ${found.length} in the file.`);
		};
		reader.readAsText(file);
		if (fileRef.current) fileRef.current.value = "";
	}
	function toggle(domain) {
		setSelected((current) => {
			const next = new Set(current);
			if (next.has(domain)) next.delete(domain);
			else next.add(domain);
			return next;
		});
	}
	function toggleShown() {
		setSelected((current) => {
			const next = new Set(current);
			if (allSelected) for (const domain of shown) next.delete(domain);
			else for (const domain of shown) next.add(domain);
			return next;
		});
	}
	function removeSelected() {
		if (!selected.size) return;
		const drop = [...selected];
		removeManaged(drop);
		setChecks((current) => {
			const next = { ...current };
			for (const domain of drop) delete next[domain];
			return next;
		});
		setNote(`Removed ${drop.length}. Gone from the main list and the fetcher too.`);
		setError("");
		setSelected(/* @__PURE__ */ new Set());
	}
	async function runCheck() {
		const targets = selected.size ? domains.filter((domain) => selected.has(domain)) : [...domains];
		if (!targets.length) {
			setError("Add a domain before checking.");
			return;
		}
		stopRef.current?.abort();
		const controller = new AbortController();
		stopRef.current = controller;
		setRunning(true);
		setError("");
		if (targets.length > DIRECT_LIMIT) {
			setNote(`Checking ${targets.length} domains from the live status list…`);
			setProgress({
				done: 0,
				total: targets.length
			});
			try {
				const map = await allStatusesFn({ data: {} });
				if (controller.signal.aborted) return;
				const now = Date.now();
				setChecks((current) => {
					const next = { ...current };
					for (const domain of targets) next[domain] = {
						status: map[domain] ?? "unknown",
						ms: 0,
						at: now
					};
					return next;
				});
				setProgress({
					done: targets.length,
					total: targets.length
				});
				setNote(`Checked ${targets.length} domains.`);
			} catch {
				if (!controller.signal.aborted) setError("The live status list did not load.");
			}
			setRunning(false);
			return;
		}
		setNote(selected.size ? `Checking ${targets.length} selected…` : `Checking ${targets.length} domains…`);
		setProgress({
			done: 0,
			total: targets.length
		});
		let cursor = 0;
		let done = 0;
		const worker = async () => {
			for (;;) {
				if (controller.signal.aborted) return;
				const index = cursor;
				cursor += 1;
				if (index >= targets.length) return;
				const domain = targets[index] ?? "";
				setChecks((current) => ({
					...current,
					[domain]: {
						status: "checking",
						ms: 0,
						at: Date.now()
					}
				}));
				try {
					const result = await statusFn({
						data: { domain },
						signal: controller.signal
					});
					if (controller.signal.aborted) return;
					setChecks((current) => ({
						...current,
						[domain]: {
							status: result.status,
							ms: result.ms,
							at: Date.now()
						}
					}));
				} catch {
					if (controller.signal.aborted) return;
					setChecks((current) => ({
						...current,
						[domain]: {
							status: "dead",
							ms: 0,
							at: Date.now()
						}
					}));
				}
				done += 1;
				setProgress({
					done,
					total: targets.length
				});
			}
		};
		await Promise.all(Array.from({ length: Math.min(4, targets.length) }, () => worker()));
		const stopped = controller.signal.aborted;
		setRunning(false);
		if (!stopped) setNote(`Checked ${targets.length} domain${targets.length === 1 ? "" : "s"}.`);
		else setNote("Stopped. Finished checks stay in the list.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "stack",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "hint",
				style: {
					display: "inline-flex",
					alignItems: "center",
					gap: 4
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 }), " Back to the list"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "brand grad-text",
				style: { fontSize: "1.7rem" },
				children: "Domain Intel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "hint",
				children: "This is the same list as the main page and the fetcher. Add or remove a domain here and it changes in both places."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "intel-counts",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [domains.length, " total"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "up",
						children: [counts.up, " up"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "slow",
						children: [counts.slow, " slow"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "redirect",
						children: [counts.redirect, " redirect"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "down",
						children: [counts.down, " down"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel stack",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "check-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "text-input",
							value: entry,
							placeholder: "yeah96.com or https://yeah96.com",
							autoCapitalize: "none",
							autoCorrect: "off",
							spellCheck: false,
							onChange: (event) => setEntry(event.target.value),
							onKeyDown: (event) => {
								if (event.key === "Enter") submitOne();
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-grad",
							onClick: submitOne,
							children: "Add"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "text-input",
						value: filter,
						placeholder: "Find a domain",
						autoCapitalize: "none",
						autoCorrect: "off",
						spellCheck: false,
						onChange: (event) => setFilter(event.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "intel-tools",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn",
								onClick: () => fileRef.current?.click(),
								children: "Import text file"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: ".txt,text/plain",
								hidden: true,
								onChange: (event) => onFile(event.target.files?.[0])
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "btn btn-grad",
								disabled: running || !domains.length,
								onClick: () => void runCheck(),
								children: [running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
									size: 16,
									className: "spin"
								}) : null, running ? `${progress.done}/${progress.total}` : selected.size ? `Check ${selected.size}` : "Check status"]
							}),
							running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn",
								onClick: () => stopRef.current?.abort(),
								children: "Stop"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "btn",
								disabled: !selected.size,
								onClick: removeSelected,
								children: ["Remove", selected.size ? ` ${selected.size}` : ""]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hint",
						children: "One domain per line in a text file. Check status tests a selection directly. Checking the whole list uses the live status feed."
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "error-line",
						children: error
					}) : null,
					note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hint",
						children: note
					}) : null
				]
			}),
			shown.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "stack",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "intel-select",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: allRef,
						type: "checkbox",
						checked: allSelected,
						onChange: toggleShown
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: filter.trim() ? `Select ${shown.length} shown` : "Select all" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "intel-list",
					children: shown.map((domain) => {
						const check = checks[domain];
						const status = check?.status ?? "unknown";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "intel-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: selected.has(domain),
									onChange: () => toggle(domain)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: domain }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `site-meta ${status}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
										check ? LABEL[status] : "Not checked",
										check && check.status !== "checking" && check.ms > 0 ? ` · ${check.ms} ms` : ""
									]
								})
							]
						}, domain);
					})
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "panel",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hint",
					style: { margin: 0 },
					children: domains.length ? "No domains match that search." : "No domains yet. Add one above, or import a .txt file."
				})
			})
		]
	});
}
function IntelPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DomainIntel, {}) });
}
//#endregion
export { IntelPage as component };
