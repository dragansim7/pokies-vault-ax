import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as normalizeDomain, t as isPublicDomain } from "./domain-CILCWuBu.mjs";
import { d as LoaderCircle, f as Eye, m as ChevronLeft, p as EyeOff } from "../_libs/lucide-react.mjs";
import { n as useVault } from "./router-CSjmOi0t.mjs";
import { c as useServerFn, i as fetchCasinoAccount, n as CATALOG, s as money, t as AppFrame } from "./format-DC-2W_RD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fetch-BWAf31gH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAGE = 12;
function bonusCell(label, bonus) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bonus-cell",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: label }), bonus ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", {
			className: "yes",
			children: ["Yes ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				"(",
				bonus.amountDisplay,
				")"
			] })]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
			className: "no",
			children: "No"
		})]
	});
}
function ResultCard({ row }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "result-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "result-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: row.domain }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `https://${row.domain}/`,
					target: "_blank",
					rel: "noreferrer",
					children: "Open"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "cash",
				children: [money(row.cash), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
					row.cashWalletName,
					row.cashMinWithdrawal != null ? ` · Min ${money(row.cashMinWithdrawal)}` : "",
					row.cashMaxWithdrawal != null ? ` · Max ${money(row.cashMaxWithdrawal)}` : " · No max shown"
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bonus-grid",
				children: [
					bonusCell("Commission", row.commission),
					bonusCell("Share", row.share),
					bonusCell("Referral", row.referral),
					bonusCell("Welcome", row.new),
					bonusCell("Rebate", row.rebate)
				]
			}),
			row.availableBonuses.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "bonus-list",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { children: [
					"All bonuses on this account (",
					row.availableBonuses.length,
					")"
				] }), row.availableBonuses.map((bonus) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bonus-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [bonus.name, bonus.rollover ? ` · ${bonus.rollover}×` : ""] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: bonus.amountDisplay })]
				}, `${bonus.name}-${bonus.amountDisplay}`))]
			}) : null
		]
	});
}
function PageList({ rows }) {
	const [page, setPage] = (0, import_react.useState)(0);
	const pages = Math.max(1, Math.ceil(rows.length / PAGE));
	const safe = Math.min(page, pages - 1);
	const slice = rows.slice(safe * PAGE, safe * PAGE + PAGE);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [pages > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pager",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn",
				disabled: safe === 0,
				onClick: () => setPage(safe - 1),
				children: "Previous"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				"Page ",
				safe + 1,
				" / ",
				pages
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn",
				disabled: safe >= pages - 1,
				onClick: () => setPage(safe + 1),
				children: "Next"
			})
		]
	}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "stack",
		children: slice.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultCard, { row }, row.domain))
	})] });
}
function Fetcher() {
	const { state, patch, rememberAccount, saveFetch } = useVault();
	const fetchOne = useServerFn(fetchCasinoAccount);
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [advanced, setAdvanced] = (0, import_react.useState)(false);
	const [single, setSingle] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("Enter the phone number and password you use on these sites.");
	const [running, setRunning] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)({
		done: 0,
		total: 0
	});
	const [rows, setRows] = (0, import_react.useState)(state.lastFetch?.rows ?? []);
	const [showErrors, setShowErrors] = (0, import_react.useState)(false);
	const [confirmScan, setConfirmScan] = (0, import_react.useState)(false);
	const [diffs, setDiffs] = (0, import_react.useState)([]);
	const stopRef = (0, import_react.useRef)(null);
	const rowsRef = (0, import_react.useRef)(rows);
	rowsRef.current = rows;
	const creds = (0, import_react.useMemo)(() => {
		const list = [{
			phone: state.phone.trim(),
			password: state.password
		}];
		for (const item of state.fallbacks) if (item.phone.trim() && item.password) list.push({
			phone: item.phone.trim(),
			password: item.password
		});
		return list.filter((item) => item.phone && item.password);
	}, [
		state.phone,
		state.password,
		state.fallbacks
	]);
	const valid = rows.filter((row) => row.ok && row.hasData);
	const empty = rows.filter((row) => row.ok && !row.hasData);
	const errors = rows.filter((row) => !row.ok);
	const totalCash = valid.reduce((sum, row) => sum + row.cash, 0);
	function setFallback(index, partial) {
		const fallbacks = state.fallbacks.map((item, i) => i === index ? {
			...item,
			...partial
		} : item);
		patch({ fallbacks });
	}
	async function checkDomain(domain, signal) {
		let last = null;
		for (const cred of creds) {
			if (signal.aborted) throw new DOMException("Aborted", "AbortError");
			const row = await fetchOne({
				data: {
					domain,
					phone: cred.phone,
					password: cred.password
				},
				signal
			});
			if (row.ok) {
				rememberAccount(domain);
				return row;
			}
			last = row;
			if (row.code !== "invalid_login") return row;
		}
		return last ?? {
			domain,
			ok: false,
			code: "other",
			message: "No credentials"
		};
	}
	async function run(domains) {
		if (!creds.length) {
			setStatus("Enter your phone number and password before fetching.");
			return;
		}
		const unique = Array.from(new Set(domains));
		if (!unique.length) {
			setStatus("No sites to check. Save accounts from the list, add a domain, or scan.");
			return;
		}
		const previous = new Map((state.lastFetch?.rows ?? []).filter((row) => row.ok).map((row) => [row.domain, row]));
		stopRef.current?.abort();
		const controller = new AbortController();
		stopRef.current = controller;
		setRunning(true);
		setShowErrors(false);
		setDiffs([]);
		setRows([]);
		setProgress({
			done: 0,
			total: unique.length
		});
		setStatus(unique.length === 1 ? `Checking ${unique[0]}…` : `Checking ${unique.length} sites…`);
		const collected = [];
		let cursor = 0;
		const worker = async () => {
			for (;;) {
				if (controller.signal.aborted) return;
				const index = cursor;
				cursor += 1;
				if (index >= unique.length) return;
				const domain = unique[index] ?? "";
				try {
					const row = await checkDomain(domain, controller.signal);
					collected.push(row);
				} catch (error) {
					if (controller.signal.aborted || error instanceof DOMException && error.name === "AbortError") return;
					collected.push({
						domain,
						ok: false,
						code: "other",
						message: "Check failed"
					});
				}
				setProgress({
					done: collected.length,
					total: unique.length
				});
				setRows([...collected].sort((a, b) => a.domain.localeCompare(b.domain)));
			}
		};
		await Promise.all(Array.from({ length: Math.min(4, unique.length) }, () => worker()));
		const stopped = controller.signal.aborted;
		const finalRows = [...collected].sort((a, b) => a.domain.localeCompare(b.domain));
		setRows(finalRows);
		if (!stopped && finalRows.length) saveFetch(finalRows);
		const notes = [];
		for (const row of finalRows) {
			if (!row.ok) continue;
			const before = previous.get(row.domain);
			if (before?.ok && Math.abs(before.cash - row.cash) >= .01) notes.push(`${row.domain} balance ${money(before.cash)} → ${money(row.cash)}`);
		}
		setDiffs(notes);
		const signedIn = finalRows.filter((row) => row.ok).length;
		setStatus(stopped ? "Stopped. Successful sign-ins stay in My accounts." : `Done. ${signedIn} of ${finalRows.length} signed in. Only those are kept as your accounts.`);
		setRunning(false);
	}
	const mineTargets = state.mine.length ? state.mine : CATALOG.filter((site) => state.visited.includes(site.domain)).map((site) => site.domain);
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
				children: "Fetch bonus data"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "hint",
				children: "Uses the same phone and password across sites that share this login. It signs in, reads your wallet and bonuses, and drops everything else. No fetch limit."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel stack",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Phone number" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "text-input",
							inputMode: "tel",
							autoComplete: "username",
							value: state.phone,
							placeholder: "04…",
							onChange: (event) => patch({ phone: event.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pass-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "text-input",
								type: showPassword ? "text" : "password",
								autoComplete: "current-password",
								value: state.password,
								onChange: (event) => patch({ password: event.target.value })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn",
								"aria-label": showPassword ? "Hide password" : "Show password",
								onClick: () => setShowPassword((value) => !value),
								children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 16 })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-ghost",
						onClick: () => setAdvanced((value) => !value),
						children: advanced ? "Hide fallback logins" : "Fallback logins"
					}),
					advanced ? state.fallbacks.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "stack",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Fallback ",
								index + 2,
								" phone"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "text-input",
								value: item.phone,
								inputMode: "tel",
								onChange: (event) => setFallback(index, { phone: event.target.value })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Fallback ",
								index + 2,
								" password"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "text-input",
								type: "password",
								value: item.password,
								onChange: (event) => setFallback(index, { password: event.target.value })
							})]
						})]
					}, index)) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hint",
						children: "Saved only in this browser. The server uses them to sign in and does not keep them."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "actions",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "btn btn-grad",
								disabled: running,
								onClick: () => void run(mineTargets),
								children: [
									running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { size: 16 }) : null,
									" Fetch my accounts",
									mineTargets.length ? ` (${mineTargets.length})` : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn",
								disabled: !running,
								onClick: () => stopRef.current?.abort(),
								children: "Stop"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn",
								disabled: running || !state.lastFetch,
								onClick: () => {
									setRows(state.lastFetch?.rows ?? []);
									setStatus("Showing the last fetch saved on this device.");
								},
								children: "View last fetch"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "check-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "text-input",
							value: single,
							placeholder: "Check one site, e.g. 9au.com",
							autoCapitalize: "none",
							autoCorrect: "off",
							spellCheck: false,
							onChange: (event) => setSingle(event.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn",
							disabled: running,
							onClick: () => {
								const domain = normalizeDomain(single);
								if (!isPublicDomain(domain)) {
									setStatus("Enter a domain like 9au.com");
									return;
								}
								run([domain]);
							},
							children: "Check"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-ghost",
						disabled: running,
						onClick: () => setConfirmScan(true),
						children: "Scan the full list to find my accounts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "progress-line",
						children: status
					}),
					progress.total > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bar",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${Math.round(progress.done / progress.total * 100)}%` } })
					}) : null
				]
			}),
			diffs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Changes since the previous fetch" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "diff",
					children: diffs.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: note }, note))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "section-label",
				children: [
					"Your accounts · ",
					valid.length,
					valid.length ? ` · ${money(totalCash)} cash` : ""
				]
			}), valid.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageList, { rows: valid }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "hint",
				children: "Nothing with a balance or bonus yet."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "section-label",
				children: ["Signed in, nothing waiting · ", empty.length]
			}), empty.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageList, { rows: empty }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "hint",
				children: "None."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "section-label",
				children: ["Not your account or unreachable · ", errors.length]
			}), errors.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "btn",
				onClick: () => setShowErrors((value) => !value),
				children: [showErrors ? "Hide" : "Show", " rejected sites"]
			}), showErrors ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "stack",
				style: { marginTop: 8 },
				children: errors.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "result-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: row.domain }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hint",
						children: row.message
					})]
				}, row.domain))
			}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "hint",
				children: "Rejected sites are not saved."
			})] }),
			confirmScan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal-backdrop",
				onClick: () => setConfirmScan(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "modal-card stack",
					onClick: (event) => event.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Scan every listed site?" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "hint",
							children: [
								"This tries your password on ",
								CATALOG.length,
								" domains and keeps only the ones that sign in. It can take several minutes. You can stop it at any time."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn",
								onClick: () => setConfirmScan(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-grad",
								onClick: () => {
									setConfirmScan(false);
									run(CATALOG.map((site) => site.domain));
								},
								children: "Scan my login"
							})]
						})
					]
				})
			}) : null
		]
	});
}
function FetchPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fetcher, {}) });
}
//#endregion
export { FetchPage as component };
