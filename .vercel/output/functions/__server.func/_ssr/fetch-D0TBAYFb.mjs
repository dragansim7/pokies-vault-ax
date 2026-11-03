import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as normalizeDomain, t as isPublicDomain } from "./domain-CILCWuBu.mjs";
import { n as parseSyncUser, t as accountError } from "./parse-account-Bm3y7cgd.mjs";
import { g as EyeOff, h as Eye, m as LoaderCircle, v as ChevronLeft } from "../_libs/lucide-react.mjs";
import { i as compareSites, n as useVault, o as visibleSites, r as catalogMeta } from "./router-C9f5wAn0.mjs";
import { a as resolveCasinoTargetsFn, i as fetchCasinoBatchFn, o as useServerFn, t as AppFrame } from "./casino.functions-BkJvSt0N.mjs";
import { i as money, n as SiteIcon, r as formatAdded, t as AccountCard } from "./account-card-CPdVCeql.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fetch-D0TBAYFb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function messageOf(data) {
	if (!data || typeof data !== "object") return "";
	const message = data.message;
	return typeof message === "string" ? message : "";
}
function classifyFailure(domain, message, fallback) {
	const text = message.toLowerCase();
	if (text.includes("invalid login") || text.includes("invalid password")) return accountError(domain, "invalid_login", "Not your account");
	if (text.includes("captcha")) return accountError(domain, "captcha", "Site asked for a captcha");
	if (text.includes("bad-json")) return accountError(domain, "unreachable", "Site did not return account data");
	if (text.includes("abort") || text.includes("timeout")) return accountError(domain, "timeout", "Timed out");
	return accountError(domain, "other", fallback);
}
function isInstalledPhone() {
	if (typeof window === "undefined") return false;
	const standalone = navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: fullscreen)").matches;
	const phone = window.matchMedia("(max-width: 900px)").matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
	return standalone && phone;
}
async function postApi(host, fields, signal) {
	const text = await (await fetch(`https://${host}/api/v1/index.php`, {
		method: "POST",
		signal,
		headers: {
			"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
			accept: "application/json,text/plain,*/*"
		},
		body: new URLSearchParams(fields)
	})).text();
	try {
		return JSON.parse(text);
	} catch {
		throw new Error("bad-json");
	}
}
async function fetchOne(target, phone, password, signal) {
	const domain = target.domain;
	if (!/^[0-9+]{6,20}$/.test(phone)) return accountError(domain, "other", "Enter the mobile number you use on these sites");
	if (password.length < 4 || password.length > 64) return accountError(domain, "other", "Password should be 4–64 characters");
	try {
		const login = await postApi(target.host, {
			module: "/users/login",
			merchantId: target.merchantId,
			accessId: "",
			accessToken: "",
			walletIsAdmin: "",
			mobile: phone,
			password
		}, signal);
		if (login.status !== "SUCCESS") return classifyFailure(domain, messageOf(login.data), "Could not sign in");
		const session = login.data;
		const accessId = session && typeof session.id === "string" ? session.id : "";
		const accessToken = session && typeof session.token === "string" ? session.token : "";
		if (!accessId || !accessToken) return accountError(domain, "other", "Sign-in did not return a session");
		const synced = await postApi(target.host, {
			module: "/users/syncData",
			merchantId: target.merchantId,
			accessId,
			accessToken,
			walletIsAdmin: "",
			background: "1"
		}, signal);
		if (synced.status !== "SUCCESS") return classifyFailure(domain, messageOf(synced.data), "Signed in, but balances did not load");
		const syncedRow = synced.data && typeof synced.data === "object" ? synced.data : null;
		let promotions;
		if (!syncedRow || !Array.isArray(syncedRow.bonus)) try {
			const pub = await postApi(target.host, {
				module: "/merchants/getPublicInfo",
				merchantId: target.merchantId,
				accessId: "",
				accessToken: "",
				walletIsAdmin: ""
			}, signal);
			promotions = (pub.data && typeof pub.data === "object" ? pub.data : null)?.promotions;
		} catch {
			promotions = void 0;
		}
		return parseSyncUser(domain, synced.data, promotions);
	} catch (error) {
		if (signal?.aborted || error instanceof DOMException && error.name === "AbortError") throw error;
		return classifyFailure(domain, error instanceof Error ? error.message : "", "Could not reach site");
	}
}
async function fetchAccountsOnDevice(input) {
	if (input.signal?.aborted) throw new DOMException("Aborted", "AbortError");
	const targets = await input.resolve(input.domains);
	const out = new Array(input.domains.length);
	let cursor = 0;
	await Promise.all(Array.from({ length: Math.min(3, input.domains.length) }, async () => {
		for (;;) {
			if (input.signal?.aborted) throw new DOMException("Aborted", "AbortError");
			const index = cursor++;
			if (index >= input.domains.length) return;
			const domain = normalizeDomain(input.domains[index] ?? "");
			const target = targets[index];
			if (!target || !target.ok) {
				const code = target && !target.ok ? target.code : "other";
				const message = target && !target.ok ? target.message : "Check failed";
				out[index] = accountError(target?.domain || domain, code, message);
				continue;
			}
			out[index] = await fetchOne(target, input.phone, input.password, input.signal);
		}
	}));
	return out;
}
var PAGE = 12;
var BATCH = 10;
var RUN_KEY = "vault-run";
var IDLE_LIVE = {
	phase: "idle",
	fromPhone: false,
	done: 0,
	total: 0,
	startedAt: null,
	finishedAt: null,
	fetchMs: 0,
	attempts: 0,
	retries: 0,
	peakQueue: 0
};
function formatSpan(ms) {
	const seconds = Math.max(0, Math.round(ms / 1e3));
	const minutes = Math.floor(seconds / 60);
	const rest = seconds % 60;
	if (minutes <= 0) return `${rest}s`;
	return `${minutes}m ${rest}s`;
}
function viaLabel(fromPhone) {
	return fromPhone ? "From this phone" : "From the vault";
}
function readRun() {
	if (typeof localStorage === "undefined") return null;
	try {
		const raw = localStorage.getItem(RUN_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed || !Array.isArray(parsed.done) || !Array.isArray(parsed.rows)) return null;
		return {
			at: typeof parsed.at === "number" ? parsed.at : Date.now(),
			done: parsed.done,
			rows: parsed.rows
		};
	} catch {
		return null;
	}
}
function writeRun(checkpoint) {
	try {
		localStorage.setItem(RUN_KEY, JSON.stringify(checkpoint));
	} catch {}
}
function chunkDomains(domains) {
	const batches = [];
	for (let i = 0; i < domains.length; i += BATCH) batches.push(domains.slice(i, i + BATCH));
	return batches;
}
function loginKey(login) {
	return `${login.phone}\0${login.password}`;
}
function usableLogin(login) {
	if (!login) return null;
	const phone = login.phone.replace(/\s+/g, "");
	if (!/^[0-9+]{6,20}$/.test(phone) || login.password.length < 4 || login.password.length > 64) return null;
	return {
		phone,
		password: login.password
	};
}
function planBatches(domains, form, saved) {
	const groups = /* @__PURE__ */ new Map();
	const fresh = [];
	for (const domain of domains) {
		const known = usableLogin(saved[domain]);
		if (!known) {
			fresh.push(domain);
			continue;
		}
		const key = loginKey(known);
		const group = groups.get(key);
		if (group) group.domains.push(domain);
		else groups.set(key, {
			first: known,
			domains: [domain]
		});
	}
	const batches = [];
	for (const group of groups.values()) {
		const rest = form.filter((cred) => loginKey(cred) !== loginKey(group.first));
		for (const slice of chunkDomains(group.domains)) batches.push({
			domains: slice,
			creds: [group.first, ...rest]
		});
	}
	if (fresh.length && form.length) for (const slice of chunkDomains(fresh)) batches.push({
		domains: slice,
		creds: form
	});
	return {
		batches,
		unseen: form.length ? 0 : fresh.length
	};
}
function cents(amount) {
	return Math.round(amount * 100) / 100;
}
function boxesOf(row) {
	const wallets = row.wallets.filter((wallet) => wallet.balance > .001);
	const walletBoxes = wallets.length ? wallets.map((wallet) => ({
		label: wallet.name,
		amount: wallet.balance,
		kind: "wallet"
	})) : row.cash > .001 ? [{
		label: row.cashWalletName,
		amount: row.cash,
		kind: "wallet"
	}] : [];
	const promos = (row.promoBoxes ?? []).filter((box) => box.amount > .001).map((box) => ({
		label: box.label,
		amount: box.amount,
		kind: "promo"
	}));
	return [...walletBoxes, ...promos];
}
function totalsOf(row) {
	let wallets = 0;
	let claimable = 0;
	for (const box of boxesOf(row)) if (box.kind === "wallet") wallets += box.amount;
	else claimable += box.amount;
	wallets = cents(wallets);
	claimable = cents(claimable);
	return {
		wallets,
		claimable,
		total: cents(wallets + claimable)
	};
}
function boxMap(row) {
	const map = /* @__PURE__ */ new Map();
	for (const box of boxesOf(row)) {
		const key = `${box.kind}\0${box.label}`;
		const current = map.get(key);
		if (current) current.amount = cents(current.amount + box.amount);
		else map.set(key, {
			...box,
			amount: cents(box.amount)
		});
	}
	return map;
}
function changesFor(before, after) {
	if (!before?.ok) {
		const total = totalsOf(after).total;
		if (total <= 0) return [];
		return [{
			id: `${after.domain}:new`,
			domain: after.domain,
			label: "Now showing",
			from: null,
			to: total
		}];
	}
	const prev = boxMap(before);
	const next = boxMap(after);
	const notes = [];
	const keys = /* @__PURE__ */ new Set([...prev.keys(), ...next.keys()]);
	for (const key of keys) {
		const oldBox = prev.get(key);
		const newBox = next.get(key);
		const from = oldBox?.amount ?? null;
		const to = newBox?.amount ?? null;
		if (from != null && to != null && Math.abs(from - to) < .01) continue;
		if (from == null && to == null) continue;
		const label = newBox?.label ?? oldBox?.label ?? "Balance";
		notes.push({
			id: `${after.domain}:${key}`,
			domain: after.domain,
			label,
			from,
			to
		});
	}
	notes.sort((a, b) => Math.abs((b.to ?? 0) - (b.from ?? 0)) - Math.abs((a.to ?? 0) - (a.from ?? 0)));
	return notes;
}
function deltaText(note) {
	if (note.from == null && note.to != null) return note.label === "Now showing" ? money(note.to) : `New ${money(note.to)}`;
	if (note.to == null) return `${money(note.from)} → ${money(0)}`;
	return `${money(note.from)} → ${money(note.to)}`;
}
function deltaClass(note) {
	const from = note.from ?? 0;
	const to = note.to ?? 0;
	if (to > from + .009) return "delta up";
	if (to < from - .009) return "delta down";
	return "delta";
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
		children: slice.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountCard, {
			domain: row.domain,
			rank: safe * PAGE + index + 1,
			addedAt: catalogMeta(row.domain).addedAt,
			account: row
		}, row.domain))
	})] });
}
var CODE_LABEL = {
	captcha: "Captcha",
	invalid_login: "Not your account",
	timeout: "Timed out",
	unreachable: "Unreachable",
	blocked: "Page blocked",
	empty: "Empty page",
	unsupported: "Different login",
	other: "Other"
};
var CODE_ORDER = [
	"captcha",
	"invalid_login",
	"timeout",
	"unreachable",
	"blocked",
	"empty",
	"unsupported",
	"other"
];
function isMarked(marks, domain, code) {
	return marks.some((mark) => mark.domain === domain && mark.code === code);
}
function NeedsAttention({ savedAt, rows, marks, onToggle }) {
	const [showChecked, setShowChecked] = (0, import_react.useState)(false);
	const stamp = savedAt ? formatAdded(new Date(savedAt).toISOString()) : "";
	const counts = CODE_ORDER.map((code) => ({
		code,
		count: rows.filter((row) => row.code === code).length
	})).filter((item) => item.count > 0);
	const hidden = rows.filter((row) => isMarked(marks, row.domain, row.code)).length;
	const visible = showChecked ? rows : rows.filter((row) => !isMarked(marks, row.domain, row.code));
	const groups = counts.map((item) => ({
		...item,
		rows: visible.filter((row) => row.code === item.code)
	})).filter((group) => group.rows.length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel attention",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "section-label",
				children: ["Needs attention · ", rows.length]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "hint",
				children: "Rejected sites are saved with the fetch. A checked row stays hidden until that site comes back with a different code."
			}),
			counts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "attention-counts",
				children: counts.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					CODE_LABEL[item.code],
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.count })
				] }, item.code))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "hint",
				children: "No rejected sites saved yet."
			}),
			hidden > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn",
				onClick: () => setShowChecked((value) => !value),
				children: showChecked ? "Hide checked" : `Show checked (${hidden})`
			}) : null,
			groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "attention-group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [
					CODE_LABEL[group.code],
					" · ",
					group.rows.length
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "attention-table",
					children: group.rows.map((row) => {
						const checked = isMarked(marks, row.domain, row.code);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "attention-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "attention-check",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked,
										onChange: () => onToggle(row.domain, row.code)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sr",
										children: "Checked"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "attention-domain",
									children: row.domain
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "attention-code",
									children: CODE_LABEL[row.code]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "attention-message",
									children: row.message
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
									dateTime: savedAt ? new Date(savedAt).toISOString() : void 0,
									children: stamp
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `https://${row.domain}/`,
									target: "_blank",
									rel: "noreferrer",
									children: "Open"
								})
							]
						}, `${row.domain}-${row.code}`);
					})
				})]
			}, group.code))
		]
	});
}
function Fetcher() {
	const { state, patch, rememberAccount, rememberLogins, saveFetch } = useVault();
	const fetchBatch = useServerFn(fetchCasinoBatchFn);
	const resolveTargets = useServerFn(resolveCasinoTargetsFn);
	const [onDevice, setOnDevice] = (0, import_react.useState)(false);
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [advanced, setAdvanced] = (0, import_react.useState)(false);
	const [single, setSingle] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("Enter the phone number and password you use on these sites.");
	const [running, setRunning] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)({
		done: 0,
		total: 0
	});
	const [live, setLive] = (0, import_react.useState)(IDLE_LIVE);
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	const [rows, setRows] = (0, import_react.useState)(state.lastFetch?.rows ?? []);
	const [showErrors, setShowErrors] = (0, import_react.useState)(false);
	const [confirmScan, setConfirmScan] = (0, import_react.useState)(false);
	const [diffs, setDiffs] = (0, import_react.useState)([]);
	const [comparedAt, setComparedAt] = (0, import_react.useState)(null);
	const [pendingRun, setPendingRun] = (0, import_react.useState)(null);
	const stopRef = (0, import_react.useRef)(null);
	const onDeviceRef = (0, import_react.useRef)(false);
	const liveRef = (0, import_react.useRef)(live);
	const rowsRef = (0, import_react.useRef)(rows);
	rowsRef.current = rows;
	(0, import_react.useEffect)(() => {
		const installed = isInstalledPhone();
		onDeviceRef.current = installed;
		setOnDevice(installed);
	}, []);
	(0, import_react.useEffect)(() => {
		if (live.phase !== "running") return;
		const id = window.setInterval(() => setNow(Date.now()), 500);
		return () => window.clearInterval(id);
	}, [live.phase]);
	const sites = (0, import_react.useMemo)(() => visibleSites(state), [state]);
	(0, import_react.useEffect)(() => {
		const saved = readRun();
		if (saved && saved.done.length < sites.length) setPendingRun(saved);
	}, [sites.length]);
	const creds = (0, import_react.useMemo)(() => {
		const list = [usableLogin({
			phone: state.phone,
			password: state.password
		})];
		for (const item of state.fallbacks) list.push(usableLogin(item));
		const seen = /* @__PURE__ */ new Set();
		const out = [];
		for (const item of list) {
			if (!item || seen.has(loginKey(item))) continue;
			seen.add(loginKey(item));
			out.push(item);
		}
		return out;
	}, [
		state.phone,
		state.password,
		state.fallbacks
	]);
	const valid = rows.filter((row) => row.ok && row.hasData);
	const empty = rows.filter((row) => row.ok && !row.hasData);
	const errors = rows.filter((row) => !row.ok);
	const unsupportedDomains = errors.filter((row) => row.code === "unsupported").map((row) => row.domain);
	const orderOf = (a, b) => compareSites(catalogMeta(a.domain), catalogMeta(b.domain), a, b, state.sort, state.bonusMode);
	const ranked = [...valid].sort(orderOf);
	const quiet = [...empty].sort(orderOf);
	const walletTotal = cents(ranked.reduce((sum, row) => sum + totalsOf(row).wallets, 0));
	const claimableTotal = cents(ranked.reduce((sum, row) => sum + totalsOf(row).claimable, 0));
	const waiting = cents(walletTotal + claimableTotal);
	function setFallback(index, partial) {
		const fallbacks = state.fallbacks.map((item, i) => i === index ? {
			...item,
			...partial
		} : item);
		patch({ fallbacks });
	}
	async function run(domains, resumeFrom, mergeBase) {
		const unique = Array.from(new Set(domains));
		if (!unique.length) {
			setStatus("No sites to check. Save accounts from the list, add a domain, or scan.");
			return;
		}
		const { batches, unseen } = planBatches(unique, creds, state.logins);
		if (!batches.length) {
			setStatus("Enter your phone number and password before fetching.");
			return;
		}
		const fromPhone = onDeviceRef.current;
		const merging = Boolean(mergeBase);
		const previousAt = state.lastFetch?.at ?? null;
		const previous = new Map((state.lastFetch?.rows ?? []).filter((row) => row.ok).map((row) => [row.domain, row]));
		stopRef.current?.abort();
		const controller = new AbortController();
		stopRef.current = controller;
		const collected = resumeFrom ? [...resumeFrom.rows] : mergeBase ? [...mergeBase] : [];
		const done = resumeFrom ? [...resumeFrom.done] : [];
		const total = resumeFrom ? sites.length : unique.length - unseen;
		const started = {
			phase: "running",
			fromPhone,
			done: done.length,
			total,
			startedAt: Date.now(),
			finishedAt: null,
			fetchMs: 0,
			attempts: 0,
			retries: 0,
			peakQueue: Math.max(0, total - done.length)
		};
		liveRef.current = started;
		setLive(started);
		setNow(started.startedAt ?? Date.now());
		setRunning(true);
		setShowErrors(false);
		setDiffs([]);
		setComparedAt(null);
		setRows(collected);
		setProgress({
			done: done.length,
			total
		});
		setStatus(resumeFrom ? `Resuming ${done.length} of ${sites.length}…` : merging ? `Retrying ${unique.length} unsupported sites…` : unique.length === 1 ? `Checking ${unique[0]}…` : unseen ? `Checking ${total} sites that already have a saved login…` : `Checking ${unique.length} sites…`);
		const publish = (batchRows, loginNotes) => {
			rememberLogins(loginNotes);
			for (const row of batchRows) {
				if (row.ok) rememberAccount(row.domain);
				const index = collected.findIndex((item) => item.domain === row.domain);
				if (index >= 0) collected[index] = row;
				else collected.push(row);
				if (!done.includes(row.domain)) done.push(row.domain);
			}
			const snapshot = [...collected].sort((a, b) => a.domain.localeCompare(b.domain));
			setRows(snapshot);
			setProgress({
				done: done.length,
				total
			});
			const queue = Math.max(0, total - done.length);
			liveRef.current = {
				...liveRef.current,
				done: done.length,
				total,
				peakQueue: Math.max(liveRef.current.peakQueue, queue)
			};
			setLive(liveRef.current);
			if (!merging) {
				const checkpoint = {
					at: Date.now(),
					done: [...done],
					rows: snapshot
				};
				writeRun(checkpoint);
				setPendingRun(done.length < sites.length ? checkpoint : null);
			}
		};
		let cursor = 0;
		const worker = async () => {
			for (;;) {
				if (controller.signal.aborted) return;
				const index = cursor;
				cursor += 1;
				if (index >= batches.length) return;
				const batch = batches[index];
				if (!batch) return;
				let pending = batch.domains;
				const settled = /* @__PURE__ */ new Map();
				const loginNotes = [];
				try {
					for (const cred of batch.creds) {
						if (controller.signal.aborted || !pending.length) break;
						const startedTry = Date.now();
						const result = fromPhone ? await fetchAccountsOnDevice({
							domains: pending,
							phone: cred.phone,
							password: cred.password,
							signal: controller.signal,
							resolve: (domains) => resolveTargets({
								data: { domains },
								signal: controller.signal
							})
						}) : await fetchBatch({
							data: {
								domains: pending,
								phone: cred.phone,
								password: cred.password
							},
							signal: controller.signal
						});
						const retry = [];
						const returned = new Set(result.map((row) => row.domain));
						for (const row of result) if (row.ok) {
							settled.set(row.domain, row);
							loginNotes.push({
								domain: row.domain,
								login: cred
							});
						} else if (row.code !== "invalid_login") settled.set(row.domain, row);
						else retry.push(row.domain);
						for (const domain of pending) if (!returned.has(domain) && !settled.has(domain)) retry.push(domain);
						liveRef.current = {
							...liveRef.current,
							fetchMs: liveRef.current.fetchMs + (Date.now() - startedTry),
							attempts: liveRef.current.attempts + Math.max(result.length, pending.length),
							retries: liveRef.current.retries + retry.length
						};
						setLive(liveRef.current);
						pending = retry;
					}
				} catch (error) {
					if (controller.signal.aborted || error instanceof DOMException && error.name === "AbortError") return;
					for (const domain of pending) if (!settled.has(domain)) settled.set(domain, {
						domain,
						ok: false,
						code: "other",
						message: "Check failed"
					});
					pending = [];
				}
				if (controller.signal.aborted) return;
				for (const domain of pending) {
					settled.set(domain, {
						domain,
						ok: false,
						code: "invalid_login",
						message: "Not your account"
					});
					loginNotes.push({
						domain,
						login: null
					});
				}
				publish(batch.domains.map((domain) => settled.get(domain) ?? {
					domain,
					ok: false,
					code: "other",
					message: "Check failed"
				}), loginNotes);
			}
		};
		await Promise.all(Array.from({ length: Math.min(fromPhone ? 2 : 4, batches.length) }, () => worker()));
		const stopped = controller.signal.aborted;
		const finalRows = [...collected].sort((a, b) => a.domain.localeCompare(b.domain));
		setRows(finalRows);
		saveFetch(finalRows);
		if (!merging && !stopped && done.length >= sites.length) {
			try {
				localStorage.removeItem(RUN_KEY);
			} catch {}
			setPendingRun(null);
		}
		const notes = [];
		for (const row of finalRows) {
			if (!row.ok) continue;
			notes.push(...changesFor(previous.get(row.domain), row));
		}
		notes.sort((a, b) => Math.abs((b.to ?? 0) - (b.from ?? 0)) - Math.abs((a.to ?? 0) - (a.from ?? 0)) || a.domain.localeCompare(b.domain));
		setDiffs(notes);
		setComparedAt(previousAt);
		const signedIn = finalRows.filter((row) => row.ok).length;
		liveRef.current = {
			...liveRef.current,
			phase: stopped ? "stopped" : "done",
			finishedAt: Date.now(),
			done: done.length
		};
		setLive(liveRef.current);
		setStatus(stopped ? "Stopped. Successful sign-ins stay in My accounts." : `Done. ${signedIn} of ${finalRows.length} signed in. Only those are kept as your accounts.`);
		setRunning(false);
	}
	const allowed = new Set(sites.map((site) => site.domain));
	const mineTargets = (state.mine.length ? state.mine : sites.filter((site) => state.visited.includes(site.domain)).map((site) => site.domain)).filter((domain) => allowed.has(domain));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "stack",
		"data-fetch-from": onDevice ? "phone" : "server",
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "brand grad-text",
					style: { fontSize: "1.7rem" },
					children: "Fetch bonus data"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hint",
					children: "Each site is signed in with the phone and password that worked there last time. New sites try the login below, then any fallbacks. A hit is remembered on this device and used first next time."
				}),
				Object.keys(state.logins).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "hint",
					children: [Object.keys(state.logins).length, " sites have a saved login."]
				}) : null
			] }),
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
						children: onDevice ? "Saved only on this phone. Sign-in goes straight from this phone to the site. The password is not sent through the vault. Up and down checks still use the vault." : "Saved only in this browser. The server uses them to sign in and does not keep them."
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "btn",
								disabled: running || unsupportedDomains.length === 0,
								onClick: () => void run(unsupportedDomains, void 0, rows),
								children: ["Retry unsupported", unsupportedDomains.length ? ` (${unsupportedDomains.length})` : ""]
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
									setDiffs([]);
									setComparedAt(null);
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
					pendingRun && !running ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "btn",
						onClick: () => {
							const done = new Set(pendingRun.done);
							run(sites.map((site) => site.domain).filter((domain) => !done.has(domain)), pendingRun);
						},
						children: [
							"Resume scan (",
							pendingRun.done.length,
							" of ",
							sites.length,
							")"
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel live-fetch",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "section-label",
								children: "Live fetch"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "live-via",
								children: viaLabel(live.phase === "idle" ? onDevice : live.fromPhone)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "live-count",
								children: [
									live.phase === "idle" ? 0 : live.done,
									" / ",
									live.total,
									" processed · ",
									live.total ? Math.round((live.phase === "idle" ? 0 : live.done) / live.total * 100) : 0,
									"%"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "live-meta",
								children: live.phase === "running" ? "Running" : live.phase === "done" ? "Done" : live.phase === "stopped" ? "Stopped" : "Idle"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "live-meta",
								children: [
									live.phase === "idle" ? 0 : rows.filter((row) => row.ok).length,
									" signed in · ",
									live.phase === "idle" ? 0 : errors.length,
									" rejected · ",
									live.phase === "idle" ? 0 : ranked.length,
									" with a balance · ",
									live.phase === "idle" ? 0 : quiet.length,
									" nothing waiting"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "live-meta",
								children: [
									"Queue ",
									Math.max(0, live.total - (live.phase === "idle" ? 0 : live.done)),
									" · peak ",
									live.peakQueue
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "live-meta",
								children: [
									"Wall ",
									live.startedAt ? formatSpan((live.finishedAt ?? now) - live.startedAt) : "0s",
									" · sign-in ",
									formatSpan(live.fetchMs)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "live-meta",
								children: [
									"Retries ",
									live.retries,
									" · attempts ",
									live.attempts
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "progress-line",
						children: [
							viaLabel(live.phase === "idle" ? onDevice : live.fromPhone),
							". ",
							status
						]
					}),
					progress.total > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bar",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${Math.round(progress.done / progress.total * 100)}%` } })
					}) : null
				]
			}),
			comparedAt != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["Changes since ", formatAdded(new Date(comparedAt).toISOString())] }), diffs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "diff",
					children: diffs.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "diff-copy",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: note.domain }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: note.label })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: deltaClass(note),
						children: deltaText(note)
					})] }, note.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hint",
					children: "No change in wallets or claimable bonuses."
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "result-summary",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "section-label",
						children: ["Your accounts · ", ranked.length]
					}),
					ranked.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "waiting",
						children: [
							money(waiting),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "waiting" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "hint waiting-split",
						children: [
							"Wallets ",
							money(walletTotal),
							" + claimable ",
							money(claimableTotal)
						]
					})] }) : null,
					state.lastFetch && !running ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "hint waiting-split",
						children: ["Saved ", formatAdded(new Date(state.lastFetch.at).toISOString())]
					}) : null,
					ranked.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageList, { rows: ranked }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hint",
						children: "Nothing with a balance or bonus yet."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "section-label",
				children: ["Signed in, nothing waiting · ", empty.length]
			}), quiet.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageList, { rows: quiet }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
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
					className: "result-card error-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteIcon, { domain: row.domain }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: row.domain }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hint",
						children: row.message
					})] })]
				}, row.domain))
			}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "hint",
				children: "None this fetch. Rejected sites stay saved under Needs attention."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NeedsAttention, {
				savedAt: state.lastFetch?.at ?? null,
				rows: (state.lastFetch?.rows ?? []).filter((row) => !row.ok),
				marks: state.attentionChecked,
				onToggle: (domain, code) => {
					const marks = state.attentionChecked;
					const exists = marks.some((mark) => mark.domain === domain && mark.code === code);
					patch({ attentionChecked: exists ? marks.filter((mark) => !(mark.domain === domain && mark.code === code)) : [...marks, {
						domain,
						code
					}] });
				}
			}),
			confirmScan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal-backdrop",
				onClick: () => setConfirmScan(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "modal-card stack",
					onClick: (event) => event.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Scan every listed site?" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hint",
							children: "Sites that already signed in use that saved login. The rest try the phone and password above, then any fallbacks. It can take several minutes. You can stop it at any time."
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
									run(sites.map((site) => site.domain));
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
