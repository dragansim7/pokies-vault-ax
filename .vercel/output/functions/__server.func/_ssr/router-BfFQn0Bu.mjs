import { o as __toESM } from "../_runtime.mjs";
import { C as useRouter, Z as require_react, _ as Outlet, b as createRootRoute, f as Scripts, g as createRouter, n as require_react_dom, p as HeadContent, v as lazyRouteComponent, w as require_jsx_runtime, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as __exportAll } from "./ssr.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { n as auth } from "./server-CU1Sa2vU.mjs";
import { n as normalizeDomain, t as isPublicDomain } from "./domain-CILCWuBu.mjs";
import { a as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BfFQn0Bu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = require_react_dom();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var BUILT_IN_DOMAINS = /* @__PURE__ */ new Set([
	"100au.co",
	"100pokies.com",
	"111aud.com",
	"11win.co",
	"11win.online",
	"123bet.club",
	"126spin.com",
	"12playau.com",
	"12pokies.co",
	"19rich.co",
	"19rich.com",
	"1aud.org",
	"1bigwin.bet",
	"1bigwin.com",
	"1crystalchips777.online",
	"1playaus.com",
	"1pokies.com",
	"1spinnwin.com",
	"1u2win.com",
	"1u2win.net",
	"1ubet88.com",
	"1uwin.com",
	"1winau.co",
	"1winau.io",
	"1winbet369.com",
	"1xaceau.com",
	"1xaud.com",
	"1xpokies.com",
	"22agwin.com",
	"22aud.com",
	"22aus.com",
	"22bitspin.com",
	"22bitspin.org",
	"22ddwin.com",
	"22dota.com",
	"22dota.net",
	"22hellspin.com",
	"22king.net",
	"22king.online",
	"22king.vip",
	"22lol.net",
	"22luckyspin.com",
	"22playamo.com",
	"22pokies.com",
	"22rickycasino.com",
	"22rocketplay.com",
	"28mars.net",
	"28mars.vip",
	"28pokies.com",
	"2aud.com",
	"2uswin.com",
	"33spins.com",
	"33spins.net",
	"365aud.co",
	"420pokies.com",
	"420pokies.net",
	"420pokies.vip",
	"44spin.com",
	"5gau.net",
	"5starclub.co",
	"5starclub.vip",
	"5winaus.com",
	"66spin.com",
	"68ninecasino35.online",
	"711au.co",
	"711bet.zone",
	"76pokies.com",
	"77au.net",
	"77pokies.com",
	"7pokies.com",
	"7pokies.online",
	"7staraus.com",
	"7vip7.com",
	"888pokies.com",
	"88au.club",
	"88aus.live",
	"88pokies.com",
	"88premiumvip.co",
	"88premiumvip.com",
	"88skycrown.com",
	"9.org",
	"93pokies.com",
	"93spin.co",
	"96aud.com",
	"96pro.co",
	"96pro.com",
	"96pro.net",
	"96spinau.com",
	"96win.co",
	"99casinoaud.com",
	"99luckaus.com",
	"99uber.com",
	"9au.com",
	"9au.net",
	"9kiss-au.com",
	"9pokies.com",
	"a.com",
	"a1club88.com",
	"a1pokies.com",
	"a2w.casino",
	"a6677a.com",
	"a77au.net",
	"a99au.online",
	"a9aud.com",
	"a9win.co",
	"aa29.org",
	"aa7au.net",
	"aawin68.com",
	"aba33aus.com",
	"ac8aus.com",
	"ac8bet.com",
	"ac8et.com",
	"ac8et.net",
	"ace268.com",
	"ace268.net",
	"ace34.vip",
	"ace4win.co",
	"ace4win.com",
	"ace96au.com",
	"ace9win.com",
	"aceaud.com",
	"aceaud.xyz",
	"acehighwin.site",
	"acepokie.com",
	"acepokies777.net",
	"acewin33.com",
	"acewin33.work",
	"acewin9.com",
	"aco96.com",
	"aco96.org",
	"acwin77.com",
	"acwin77.net",
	"add88.pro",
	"adultsbet.com",
	"advantplay1.com",
	"advantplay885.xyz",
	"advantplayfun.com",
	"af7aus.com",
	"afb365.online",
	"afb77au.club",
	"afb77au.com",
	"afl88.com",
	"afpau.net",
	"ag8ud.com",
	"aggau.com",
	"ai99au.com",
	"aipokies.net",
	"ak44au.com",
	"ak8au.com",
	"ak8aud.com",
	"albanesewin.com",
	"aldispin88.com",
	"aliensspining.com",
	"all117.com",
	"amb88.cc",
	"amg86.club",
	"amplayfun.com",
	"anex9au.com",
	"antbetaus.com",
	"anz188.co",
	"anz2u.com",
	"anz33.com",
	"anzplay.co",
	"anzplay.com",
	"anzspin.com",
	"apexspin.world",
	"app996.com",
	"apple33.co",
	"aristo99.com",
	"aristocratau.com",
	"ariswin.com",
	"arvo7.com",
	"arvo96.com",
	"astar77au.com",
	"astro9.co",
	"atomic96.com",
	"au-king.com",
	"au-royal.com",
	"au.com",
	"au.eg9.bet",
	"au.goldapple1.com",
	"au12funs.com",
	"au21.net",
	"au33.co",
	"au55.co",
	"au68.com",
	"au788.me",
	"au855.com",
	"au88.io",
	"au9.io",
	"au99.co",
	"aub.jjbspin.net",
	"aubet88.org",
	"auboss.co",
	"auboss1.com",
	"aucloud9.com",
	"auclub77.com",
	"aud22.com",
	"aud24.com",
	"aud2u.co",
	"aud2u.com",
	"aud2u.net",
	"aud33.com",
	"aud33.live",
	"aud44.com",
	"aud77.casa",
	"aud77.live",
	"aud9.com",
	"aud96.com",
	"aud99.com",
	"aud99.net",
	"audbet365.co",
	"audbet99.co",
	"audclub88.com",
	"audgaming1.com",
	"audgaming8.com",
	"audgo.net",
	"audgo.store",
	"audgo.website",
	"audgogo.net",
	"audiamond77.com",
	"audking.com",
	"audking98.com",
	"audmono.com",
	"audplay.online",
	"audplay168.com",
	"audply.com",
	"audpokies88.com",
	"audpokies888.com",
	"audqueen.co",
	"audrive.vip",
	"audslot.net",
	"audwin9.com",
	"auium.com",
	"auium.net",
	"auking99.com",
	"aulegend.com",
	"aupay99.com",
	"aupegasus.com",
	"auplay.club",
	"auplay99.com",
	"auplayx.com",
	"aupokies777.com",
	"aupokies9.com",
	"auraaud.com",
	"auraplay1.com",
	"aurich8.com",
	"aurith68.com",
	"auroo88.com",
	"aurorabets.org",
	"aurorabets.world",
	"auryshub77.com",
	"aus.com",
	"aus007.co",
	"aus007.com",
	"aus13.com",
	"aus29.com",
	"aus2u.com",
	"aus2uu.club",
	"aus33.net",
	"aus55.vip",
	"aus66.com",
	"aus789.com",
	"aus88.club",
	"aus88win.com",
	"aus8win.com",
	"aus9.com",
	"aus96.co",
	"aus996.com",
	"ausands33.com",
	"ausbet33.net",
	"ausbet88.com",
	"ausbet88au.com",
	"ausbet96.net",
	"ausbet99.com",
	"ausclub.net",
	"ausclub.vip",
	"ausdeluxe.com",
	"ausdice8.com",
	"ausdollar.com",
	"ausgaming.co",
	"ausgogo.com",
	"ausiepokies.com",
	"ausinluck.store",
	"ausix365.org",
	"ausking777.com",
	"auslot7.com",
	"auslot9.com",
	"auslot96.com",
	"auspade.com",
	"auspay96.com",
	"auspay96.net",
	"auspeed96.com",
	"auspin168.com",
	"auspin88.vip",
	"auspin996.com",
	"auspokies.com",
	"auspokies99.com",
	"aussie123.com",
	"aussie2win.com",
	"aussie55.com",
	"aussie789.net",
	"aussie96.com",
	"aussie96.net",
	"aussie99.com",
	"aussieaces.co",
	"aussieaces.com",
	"aussiebt.org",
	"aussieloot.com",
	"aussieluck.co",
	"aussieluck33au.com",
	"aussiepokies33.co",
	"aussiepokies33.com",
	"aussiepokies33.net",
	"aussiepub.org",
	"aussieqq.com",
	"aussieripper.com",
	"aussiespin9.com",
	"aussiewin.co",
	"aussiex6.com",
	"aussinoau.net",
	"aussinos.net",
	"aussix.com",
	"ausspeed.com",
	"austar.club",
	"austar.live",
	"ausvip.net",
	"auswin.io",
	"auswinwin.net",
	"auwin.co",
	"auwin11.com",
	"auwin22.com",
	"auwin365.com",
	"auwin7.com",
	"auwin77.com",
	"auwin88.com",
	"auwin88.online",
	"auwin9.com",
	"auwinaud.com",
	"auwins88.com",
	"auxpoki.com",
	"auz77.com",
	"auzball.com",
	"auzbet99.com",
	"auzbets.com",
	"auzbets.net",
	"auzspin9.com",
	"avatarr8.com",
	"avengeraus1.com",
	"avengers80.com",
	"avg88.cc",
	"avg88.vip",
	"aviator96.com",
	"aviator98.com",
	"ax99au.club",
	"azurefortunepalace.co",
	"azurefortunepalace.com",
	"b4bau.com",
	"b4baus.com",
	"ba77au.com",
	"babymolly88.com",
	"babymolly99.com",
	"bakedmate.net",
	"bang96.net",
	"bankau.live",
	"bankcunt.com",
	"bb5au.co",
	"bb8au.com",
	"bb96.com",
	"bbspin.io",
	"bbspinaus.com",
	"bc8a.com",
	"bcgame96.com",
	"bcgame96.net",
	"bcwin88.net",
	"bdmspin.com",
	"be9au.me",
	"beebee11.com",
	"beespin.org",
	"benz96.com",
	"besoft8.com",
	"best77.asia",
	"bestau.co",
	"bestau77.com",
	"bestpokieslist.online",
	"bet2aus.com",
	"bet365aud.com",
	"bet365game.live",
	"bet77aus.com",
	"bet9au.com",
	"betaaron.com",
	"betaud.net",
	"betaussie.co",
	"betbaked.net",
	"betblaze.org",
	"betclub11.club",
	"betclub11.online",
	"betclub6.net",
	"betcody.com",
	"betflip.co",
	"betgm11.com",
	"betjack21.com",
	"betjason.com",
	"betjohn.com",
	"betjohn.net",
	"betman-aud.net",
	"betman88.games",
	"betman9.com",
	"betman9.vip",
	"betmanau.co",
	"betmasterau.com",
	"betmax96.com",
	"betmeth.com",
	"betnet9.com",
	"betnich.com",
	"betnova365.com",
	"betoptus.com",
	"betsdoggy.tech",
	"betsixty.cc",
	"betus10.co",
	"betwey365.com",
	"betworld168.net",
	"betworld168.vip",
	"betworld96au.com",
	"betx999aus.com",
	"betzilla88.net",
	"bigbonus.me",
	"bigboss88.vip",
	"bighotb.com",
	"bigjqk.com",
	"bigpay2u.com",
	"bigpay77.net",
	"bigw.bet",
	"bigw7.asia",
	"bigwin666.net",
	"billaboong.vip",
	"billionaire2024.com",
	"billionaud.com",
	"bitchie99.net",
	"bizzo777.com",
	"bizzo88.com",
	"bizzo88au.com",
	"bk33au.com",
	"bk8au.co",
	"bk8au.net",
	"bk8aud.io",
	"bk8auspokies.com",
	"bk8global.vip",
	"bk99a.com",
	"bk9au.net",
	"bkk88au.com",
	"blackpokies.com",
	"blaze007.io",
	"blokebet9.com",
	"bluespin88.net",
	"bluntspin.com",
	"bluntspin.org",
	"bluzz777.co",
	"bluzz777.com",
	"bm7au.com",
	"bn8aus.com",
	"bng1au.com",
	"bng33.com",
	"bng9.co",
	"bngplay7.com",
	"bngwin7.live",
	"bomspin.com",
	"bondi333.com",
	"bondi333.net",
	"bondibeachbet.com",
	"bondibeachbet.net",
	"bong21.com",
	"bonsai369.com",
	"bonsai369a.com",
	"bonus96.com",
	"bonza7.com",
	"bonza96.com",
	"bonzaau.com",
	"bonzaau.net",
	"bonzaluck.com",
	"bonzawin.com",
	"bonzbet.com",
	"booma7.com",
	"boombaby9.com",
	"boomerangaus.com",
	"boomerstake.com",
	"booongo33.com",
	"boss365au.com",
	"bossbabyau.com",
	"boyabet9.com",
	"boyabet9.net",
	"bpfuel888au.com",
	"br8au.vip",
	"br8au.win",
	"br8aud.net",
	"br8aus.net",
	"breakspin.com",
	"breakwin.com",
	"breeza8.com",
	"brisbets.net",
	"bs22au.com",
	"bsb007.com",
	"bsb88au.com",
	"bt4win.com",
	"buffalo39a.com",
	"bugatti13.vip",
	"bullpokies.com",
	"bunny96.co",
	"bunny96.com",
	"bw96.io",
	"bx77au.asia",
	"bx77au.com",
	"bx8aus.com",
	"bxb88au.com",
	"bybid9.tips",
	"bybid9.vip",
	"bybid9au.com",
	"cactusaud.com",
	"call96.co",
	"call96.com",
	"candy29.com",
	"candy96.site",
	"candylucks.net",
	"candymommy.co",
	"candypokies.com",
	"cannabisaud.com",
	"carlton28.net",
	"cashaud.co",
	"cashkingau.com",
	"cashkingau.shop",
	"cashnet99.com",
	"cashnet992.com",
	"cashnetfun.com",
	"cashpokie.com",
	"cashsinoau.com",
	"casiny1.com",
	"cbet68.com",
	"cbr8aus.casino",
	"cc77au.com",
	"ccm88au.com",
	"ccpokies.com",
	"cergas.online",
	"champion9.com",
	"chanel9.net",
	"chanelau.co",
	"check-in77.com",
	"check-in777.com",
	"checkmate7.com",
	"cheekyspin.net",
	"chemist19.com",
	"chemist19.net",
	"chillpokies.net",
	"choose96.com",
	"chuckmeth9.net",
	"clash2win.com",
	"class777.co",
	"class777.com",
	"clb88.co",
	"click96.com",
	"cloud9plusau.com",
	"clownwin.com",
	"clubimperioaus.com",
	"cn8au.com",
	"cobber96.com",
	"cocainespin.com",
	"cocox88.com",
	"cocspin.com",
	"coda8.com",
	"coinmaster44.co",
	"cokespin.com",
	"cola13.me",
	"coles77.com",
	"colormate.net",
	"coopers365.com",
	"coospin.com",
	"coralcrownbet.com",
	"corona9.net",
	"corona9au.com",
	"cosmojack.net",
	"cpau365.co",
	"cr33au.com",
	"crackspin.com",
	"crayspin.com",
	"crazyaus.co",
	"crazysluts.net",
	"crikey7.com",
	"crikeywin.co",
	"crikeywins.com",
	"crn7.com",
	"crocmateau.com",
	"crowd96.com",
	"crown155.co",
	"crown155au.com",
	"crown365au.com",
	"crown69.online",
	"crown76au.com",
	"crown76au.online",
	"crown777au.com",
	"crown9au.com",
	"crown9au.net",
	"crownau.com",
	"crownau77.info",
	"crownaud.com",
	"crownaud.net",
	"crownbet.pro",
	"crownbetking.com",
	"crownbetz.com",
	"crowncasino.fun",
	"crowncasinosau.com",
	"crowncityau.com",
	"crownspin96.vip",
	"crownspin996.asia",
	"crownspin996.com",
	"crownzo.com",
	"crystalbet777.club",
	"crystalchips777.online",
	"ctbet.cc",
	"ctbet.live",
	"cunt9.com",
	"cuntboom.com",
	"cuntcity.net",
	"cuntcunt.co",
	"cuntcunt.org",
	"cunthaus.com",
	"cunthaus.net",
	"cunthaus.org",
	"cuntmeth.com",
	"cuntpokies.com",
	"cuntsick.net",
	"cuntspider.xyz",
	"cuntspin.live",
	"cuntspin.net",
	"cuntwin.com",
	"cuntwin77.net",
	"cutiespin.co",
	"cyberaus.org",
	"cyberbet77.com",
	"cyberbet77.online",
	"cyberpunk369-au.com",
	"cyberpunk369.com",
	"d1spin.com",
	"dafawin88.com",
	"damnpokies.com",
	"damnpokies.net",
	"danabet7.com",
	"dangspin.com",
	"dato888au.com",
	"dcbet9.net",
	"dd8au.com",
	"ddpokies.com",
	"ddw99.com",
	"dealau.vip",
	"dealau1.com",
	"decho34.com",
	"decho34.vip",
	"deepokies.com",
	"deespin.com",
	"deespinau.co",
	"defobet9.com",
	"defowin.com",
	"devegas99.com",
	"dfl88.com",
	"dg6au.com",
	"dgpokies.com",
	"dgspin22.com",
	"diamondaud.com",
	"diceau.online",
	"dick96.com",
	"dickwin.com",
	"dingospin.com",
	"dingospin.net",
	"dinkum33.com",
	"dinkydibets.com",
	"dinkydidolla.pro",
	"dior13.net",
	"dis8.com",
	"discord.gg",
	"dmax69aus.com",
	"dmd188.com",
	"dns33.com",
	"dogdog11.com",
	"dogeau.online",
	"dogeau.store",
	"dogeau1.com",
	"doggopokies.com",
	"dollar33au.com",
	"dolphin88.co",
	"donaldwin.com",
	"dota2bet.cc",
	"double9.org",
	"dowin8aus.net",
	"dpokies.com",
	"dripsbet.net",
	"drongocunt.com",
	"drunkspin.com",
	"dsyaus.com",
	"dubspin.org",
	"duckyluckaus.live",
	"duckyluckaus.online",
	"durameth.com",
	"durex28.com",
	"dv77.com",
	"dv77au.com",
	"dvegas77.com",
	"dw88.io",
	"e99au.co",
	"e99aus.com",
	"ea99.club",
	"ea99aud.com",
	"easypokies9.net",
	"easyspin7.vip",
	"ebet7.net",
	"ebet9au.com",
	"eccyspin.com",
	"eckyspin.net",
	"ecl9.com",
	"eclbetau.cc",
	"eclbetau.io",
	"ecstasybaby.vip",
	"edenn21.com",
	"eebet9.com",
	"efa777.net",
	"efa99aus.com",
	"efa9aud.com",
	"elitewin7.com",
	"emax7.co",
	"emax7.top",
	"emerald777.co",
	"emerald777.com",
	"emium1au.net",
	"emperor9.com",
	"empire96.com",
	"empireclub.co",
	"emu668.co",
	"emu88.co",
	"emuspinaud.com",
	"enjoy007.com",
	"enjoy11au.com",
	"enjoy11aus.com",
	"enjoy2aus.com",
	"enjoy2win99.com",
	"enjoy33.vip",
	"enjoy96.co",
	"enom88.com",
	"epay88a.com",
	"epay9.net",
	"epicaud.com",
	"epicpokies.com",
	"epicstar6.com",
	"eq9au.io",
	"esrbetau.com",
	"eternal66.com",
	"ethbet8.com",
	"ev88.gg",
	"ev88.is",
	"everwin.store",
	"everwin44.com",
	"evo33au.com",
	"ex77au.com",
	"exc55.org",
	"extrawin9.com",
	"ez99au.com",
	"ez9aus.net",
	"ez9game.com",
	"ezaud.live",
	"ezaud.net",
	"ezbet66.com",
	"ezspin68.com",
	"ezspin68.vip",
	"ezwinau.com",
	"ezywin88.com",
	"ezywin88.xyz",
	"f1betau.com",
	"f1pokies.com",
	"f1spin.com",
	"f88spins.com",
	"f88spins.net",
	"f9spin.com",
	"fafa29.com",
	"fafa29.vip",
	"fafaau.org",
	"fafabet9.com",
	"fafabet9.live",
	"fafabet9.net",
	"fafaspin.com",
	"fafawinau.com",
	"fafawinaus.com",
	"fairdinkumbets.club",
	"fairdinkumbets.com",
	"fairdinkumplay9.asia",
	"fairdinkumplay9.com",
	"fairdinkumspins.com",
	"fairgo77.com",
	"fairgobets.com",
	"fairgobets.net",
	"fairspin.asia",
	"fantasy33.com",
	"fastau.org",
	"fastaud.com",
	"fastaud.pro",
	"fastpay9.com",
	"fastslotsau.com",
	"fastspayau.net",
	"fastspin11.com",
	"fastspin99.com",
	"fastspin99.org",
	"fastspinau.com",
	"fatchoy66.club",
	"fatdog9.com",
	"fatpapa9.com",
	"favspin.net",
	"favspin.org",
	"fc8au.com",
	"fckcunt.com",
	"feespin.net",
	"fendipokies.com",
	"fendiwin9.co",
	"fendiwin9.net",
	"fendiwin9.org",
	"ff29.co",
	"ff96.co",
	"ff96au.com",
	"ffspin.org",
	"fifaspin.net",
	"fight22.com",
	"fight996au.com",
	"fightpokies.com",
	"fightspin.net",
	"finaplay.com",
	"firewinau.com",
	"first96.com",
	"fishsin9.com",
	"flareau.co",
	"flareau.net",
	"flashfortune.org",
	"flipau.site",
	"fortune88au.com",
	"fortunex99.co",
	"fortunex99.com",
	"freakcunt21.com",
	"freakpokies.com",
	"freeaud.co",
	"freebieaud.co",
	"freeslot.cloud",
	"frenzy96.com",
	"fridayfriday.co",
	"fridayfriday.org",
	"fuckfuck.cc",
	"fuckingluck.com",
	"fuckingmeth.com",
	"fuckingmeth.net",
	"fuckmate.co",
	"fuckmate.vip",
	"fuckpokies.com",
	"fuckspin.com",
	"fuckspin.vip",
	"fuckspin88.net",
	"fuckswan.net",
	"fuckwin.net",
	"fuckwit9.com",
	"funaud.com",
	"funbet365a.vip",
	"funcity93.com",
	"funhouse7.co",
	"funmeth.com",
	"funplay.vip",
	"funplayaud.com",
	"funpokies.com",
	"funpokies.win",
	"fursino.com",
	"fury9.com",
	"g22spin.com",
	"g6au.com",
	"g6casinoaus.com",
	"g9aus.com",
	"g9clubaus.com",
	"galaparadise.com",
	"galaxy96.com",
	"galaxyau.co",
	"galaxyau.com",
	"galaxys77.com",
	"galaxys77aus.com",
	"gamblingking.vip",
	"gamdom77.com",
	"game4u.games",
	"garagespin.co",
	"garcat8.com",
	"gcity56.com",
	"gd7aus.com",
	"gd8au.com",
	"gd8au.vip",
	"gday007.com",
	"gday123.co",
	"gday365.com",
	"gday5.com",
	"gday77au.com",
	"gday88.com",
	"gday9.com",
	"gday96.com",
	"gday96.net",
	"gdaymate9.com",
	"gdbetau.com",
	"gem9bet.com",
	"gentingau2u.com",
	"gentleman1a.com",
	"gey99pokies.com",
	"gg.undefined",
	"gg29.org",
	"gg66au.com",
	"gg66au.net",
	"ggbitch.com",
	"glbet9.com",
	"global.vip",
	"glorya77.com",
	"gluck33.com",
	"gluck33aud.com",
	"gluck77.com",
	"gm9.co",
	"go33au.com",
	"go96.co",
	"goalspin.vip",
	"god22.co",
	"god88aus.com",
	"godmeth.com",
	"gofun33.com",
	"gofun333.com",
	"gofun333.net",
	"gogoaus.com",
	"gogopokies.com",
	"gold77au.com",
	"goldau.co",
	"goldau.it.com",
	"goldbet9.org",
	"goldcrown99.com",
	"golden13.vip",
	"golden88.world",
	"golden88a.com",
	"goldencrown96.com",
	"goldenempire8.site",
	"goldenfortuneslot.com",
	"goldkick88.vip",
	"goldpalaceau.com",
	"goldspin29.net",
	"goodmeth.org",
	"goodpokies.net",
	"goospin.cc",
	"goospin.org",
	"gopokies.co",
	"gopokies9.com",
	"gorichescasino.com",
	"gowin18.com",
	"grandau777.live",
	"grillmate.org",
	"gronkspin.com",
	"gt33.vip",
	"gtbet9.com",
	"gtbet9au.com",
	"gtr33au.com",
	"gtr99.org",
	"gtx33.com",
	"gucci9.co",
	"gucci9.fun",
	"gucci9.me",
	"gunspin9.com",
	"gwin77.net",
	"gwin9au.co",
	"gxbet7.com",
	"gxr7.com",
	"h4winau.com",
	"h4winaus.com",
	"h5au.com",
	"happy-23.org",
	"happy23.org",
	"harbour33.com",
	"harbour33happy.com",
	"harvestbet.co",
	"hb88au.com",
	"hb88aus.net",
	"hellbet9.com",
	"hello88au.com",
	"hello88au.live",
	"hello99au.com",
	"helloaud77.com",
	"hellospin.co",
	"heroinspin.com",
	"hey96.com",
	"heybitch99.com",
	"heycunt.co",
	"heycunt.net",
	"heymethh.com",
	"heypokies.com",
	"heypokies.vip",
	"heysluts99.net",
	"hicunt.com",
	"highmate88.net",
	"highrollaoz.org",
	"highrollaoz.sydney",
	"hitmate88.net",
	"hoh88au.com",
	"hoh88aus.com",
	"hollywoodaus.com",
	"holspin.com",
	"hoospin.com",
	"hornyspin.com",
	"hotmail.com",
	"hotmate88.com",
	"hotpokies88.com",
	"hotspin99au.com",
	"hydra888aus.com",
	"hype777.io",
	"i8au.bet",
	"i8au.online",
	"i8pokies.com",
	"iaud88.co",
	"ibet123au.com",
	"ibet96au.com",
	"ibet9au.com",
	"ibet9au.net",
	"iceberg9aus.com",
	"icefrog777.co",
	"iclub365au.com",
	"ienjoy88au.com",
	"ifun88au.com",
	"ig9aud.com",
	"ig9aus.com",
	"ignition66.com",
	"ihappy88au.com",
	"ii89.io",
	"ii89au.com",
	"ijoker88au.com",
	"ik118.com",
	"ilove96.com",
	"ilovecunt.net",
	"ilovejili.net",
	"ilovejili.org",
	"ilovejili.vip",
	"ilovejili99.net",
	"ilovemeth.co",
	"imillion88.com",
	"imp1au.com",
	"imperium777.co",
	"imperium88.com",
	"imperium9.com",
	"imperium999.com",
	"in8.live",
	"inskingdom8.com",
	"intensity2aus.com",
	"intensity2aus.net",
	"intensityaus.com",
	"invegas365.com",
	"ioi6.com",
	"ioi6.net",
	"ione8au.net",
	"ione8aus.co",
	"ione8aus.com",
	"ipay7.net",
	"ipay777.vip",
	"ipay9.bet",
	"ipay9.net",
	"ipay9aud.com",
	"iplay77.com",
	"iplay77.org",
	"ipokies.co",
	"ipokies88.com",
	"ipokies8au.com",
	"ipokies9.cc",
	"ipokies9.com",
	"irich88.live",
	"irich88.vip",
	"irich882.site",
	"ironman98.com",
	"isdpokies.com",
	"ispeed88au.com",
	"ispeedau.com",
	"ispin77.com",
	"ispin88au.com",
	"israelspin.com",
	"itwister88.com",
	"ivora8.com",
	"ivorycreek.co",
	"iw99au.com",
	"iwin33.net",
	"iwin33au.net",
	"ixaceau.com",
	"j8au.com",
	"jackdom.com",
	"jackdom1.com",
	"jackpotau.com",
	"jackpotau.net",
	"jackpotime68.com",
	"jackpotmate88.com",
	"jackpoty9.com",
	"jaws68.com",
	"jaws68.org",
	"jbagwin.com",
	"jbagwin.net",
	"jdbet7.com",
	"jeespin.com",
	"jeetstar.com",
	"jellospin.com",
	"jerkspin.com",
	"jetpokies.com",
	"jetpot.vip",
	"jetstar77.info",
	"jibet1.xyz",
	"jibet88.com",
	"jiliau.club",
	"jiliau.com",
	"jililuck.fit",
	"jjpokies.com",
	"jkpokies.com",
	"jointmate.net",
	"joker13.org",
	"joker33.club",
	"jokeroz.com",
	"jokeroz.vip",
	"jombet77.com",
	"joofred.com",
	"joospin.net",
	"joypokies.com",
	"jptau.co",
	"justbetau.com",
	"justcasino.casino",
	"justpokies9.com",
	"justwin9.com",
	"justwin9.net",
	"justwon8.com",
	"jw8au.co",
	"jw8bet.co",
	"jwins9aus.com",
	"k18win.com",
	"kaboom77.com",
	"kaboomwin.com",
	"kalbarri88.com",
	"kangaau.com",
	"kangaroo88.co",
	"kangaroobet88.com",
	"kangarush7.com",
	"kangaspin.com",
	"kangaspinau.com",
	"kango668.co",
	"kano5108.869",
	"kazzo88.com",
	"kelspin.com",
	"kennycasino.com",
	"keno99.co",
	"keno99.com",
	"kerowin.net",
	"ketawin.com",
	"kfcspin.org",
	"kimberley333.co",
	"kimberley333.pro",
	"king88pokies.com",
	"king88pokies.vip",
	"kingaud.cc",
	"kingaud.com",
	"kingbbet9.net",
	"kingbet9aus.com",
	"kingdom9aus.com",
	"kingdom9aus.net",
	"kingpay77au.com",
	"kingpokies8.co",
	"kingpower365.com",
	"kingsau.com",
	"kingsman369.com",
	"kingsman88.site",
	"kingspin12.com",
	"kingtech88.club",
	"kingzo88.com",
	"kiss918au.com",
	"kissmeth.com",
	"kisspokies.com",
	"kittylucky.co",
	"kittyslot.co",
	"kkpokies.co",
	"koala11.com",
	"koala668.co",
	"koala88.co",
	"koalabear33.net",
	"koalabet.co",
	"koalaspins.com",
	"koalawin.live",
	"koaspin.com",
	"kraken-bet.com",
	"krakenbet.co",
	"kuromiau.com",
	"kurowin.net",
	"labubu88au.vip",
	"labuspin.com",
	"le88win.com",
	"le88win.vip",
	"leespin.com",
	"legend-9.com",
	"legend13.co",
	"legit99.com",
	"legit99.net",
	"lego66.site",
	"lemonade369.com",
	"leprechaunspin.com",
	"letsgoaud.co",
	"letsgoaud.com",
	"letspokies.com",
	"lfl88.com",
	"liamcasino.com",
	"lickcunt27.com",
	"lion88.fun",
	"lion88.website",
	"lisboa7.com",
	"lisboa7.vip",
	"lisboa7aus.com",
	"live11.vip",
	"live77bet.com",
	"llpokiesbillion.com",
	"lootaus.com",
	"lot9ine.com",
	"lot9ine.store",
	"lotso13.net",
	"lotusaud.com",
	"lsdbaby.co",
	"lsdpokies.com",
	"luck777.store",
	"luck77au.com",
	"luckau.site",
	"luckmate88.fit",
	"lucky21au.com",
	"lucky22.live",
	"lucky72au.com",
	"lucky76au.com",
	"lucky76au.live",
	"lucky76aus.com",
	"lucky7au.com",
	"luckyaceau.net",
	"luckyangels.co",
	"luckyaud88.com",
	"luckyaus.com",
	"luckybet93.com",
	"luckybetau.com",
	"luckybox77.com",
	"luckymate88.com",
	"luckyozzie1.com",
	"luckypink.vip",
	"luckypokies77.com",
	"luckypokies777au.com",
	"luckywave88.com",
	"luckywave888.com",
	"luk77.com",
	"luna8.co",
	"lunawin.xyz",
	"lux96.co",
	"luxe66.co",
	"luxe66.com",
	"luxeau777.com",
	"luxez7.com",
	"luxpokies.com",
	"luxurytown8.com",
	"lv52aud.com",
	"lvpay77.com",
	"lvpay77.vip",
	"lvpokies.com",
	"lvspin13.net",
	"lwin9.com",
	"lycanslots.co",
	"m.md88aus.com",
	"m6au.com",
	"m88oz.com",
	"m88win.vip",
	"m99au.com",
	"m99aud.com",
	"m9au.net",
	"m9aud.com",
	"m9aus.net",
	"macau365aus.com",
	"macluck9aus.net",
	"macsp1n.site",
	"madcunt.net",
	"madcunt7.net",
	"madfreak.net",
	"madhorseau.net",
	"madjili.net",
	"madmate96.com",
	"madmeth99.com",
	"madspinau.com",
	"madting7.com",
	"madting7.net",
	"madwinz.net",
	"magibet8aus.com",
	"magicspin77.com",
	"mainaus99.com",
	"majesty77aus.com",
	"mansion7.fun",
	"mario666.com",
	"mario9.asia",
	"mario96.com",
	"mario99.co",
	"mario99.vip",
	"mariowin.xyz",
	"mariowin9.com",
	"markspin.net",
	"marlspin.com",
	"mars.com",
	"mars66.com",
	"marvelaus1.com",
	"mason777.com",
	"masonspin.com",
	"mate29.com",
	"mate96.com",
	"matemate11.com",
	"matemate11.vip",
	"mates88.com",
	"mates88.net",
	"matespin77.asia",
	"matespin77.net",
	"mathpokies.net",
	"maxcunt.com",
	"maxgame8au.com",
	"maxim88au.co",
	"maxmeth.com",
	"maxpokies.com",
	"maxspin33.com",
	"maxspin7.com",
	"maxwinaus.co",
	"mb9.co",
	"mb9au.net",
	"mb9aus.co",
	"mbs77au.online",
	"mbs77au.org",
	"mcdmeth.net",
	"mcdollar9.com",
	"mcdollar9.net",
	"mcpokies.com",
	"md9aus.com",
	"me96.com",
	"me96.net",
	"me99.store",
	"me99aud.com",
	"medusa9.com",
	"mee88au.com",
	"mee88aus.com",
	"meespin.com",
	"mega98au.com",
	"megabet26.com",
	"megaclub9.com",
	"megadice96.com",
	"megawin88.game",
	"megax77au.com",
	"mel77.com",
	"mel77.info",
	"melaud.net",
	"melbourne9.site",
	"melclub.co",
	"melowin.net",
	"melspin.vip",
	"metaspin88.io",
	"meth365.net",
	"meth76.com",
	"meth789.com",
	"methaus.com",
	"methbaby.co",
	"methbet.com",
	"methday.net",
	"methfreak.net",
	"methgg.net",
	"methking.com",
	"methmate.com",
	"methmeth.vip",
	"methpokie.com",
	"methpokies.com",
	"methspin.net",
	"methspinning.net",
	"methwin.com",
	"methwin.vip",
	"mgm7.net",
	"mgm7au.com",
	"miawin.com",
	"micky9.net",
	"midasvault.casino",
	"midasvaultcasino.com",
	"millionaireaud.com",
	"millionclub9aus.club",
	"mimiwin.xyz",
	"minecraftau.co",
	"minionspin.pro",
	"minispin.org",
	"minorspin.com",
	"mix9au.com",
	"mkaus.co",
	"mm29.org",
	"mm96.com",
	"mmd9.net",
	"mmm9.org",
	"mnp88.co",
	"mofo28.net",
	"mofoaus.com",
	"mofoclub.com",
	"mofospin.com",
	"monash96.com",
	"monica999.co",
	"monkeywin-2.com",
	"monoaud.com",
	"mooncunt.net",
	"moospin.net",
	"mpay9.net",
	"mpokies.com",
	"mr9vip.com",
	"mrau7.com",
	"mraud.com",
	"mraud88.co",
	"mrbean9.asia",
	"mrbean9office.net",
	"mrbeng68.com",
	"mrbet96.com",
	"mrbet9au.info",
	"mrbluey.com",
	"mrblueyau.com",
	"mrboom9.com",
	"mrgreen8.com",
	"mrjili9.com",
	"mrlucky9.com",
	"mrpay9.com",
	"mrpay9.vip",
	"mrpoint.co",
	"mrpokies77.com",
	"mrpokies9.net",
	"mrrichau.com",
	"mrs99.net",
	"mrspin9au.co",
	"mrspin9au.com",
	"mrvictor9.com",
	"mrvip77au.com",
	"mrwhite96.com",
	"mrwin5.com",
	"mrwin68.com",
	"mrwin77.com",
	"mrwin77au.com",
	"mrwin888.net",
	"mrwin9au.com",
	"ms9au.net",
	"msn33.com",
	"mspokies.com",
	"mspokies.net",
	"muckerspin.com",
	"mullet28.com",
	"mw8.online",
	"mwaus.co",
	"mwaus.store",
	"mybet9au.net",
	"myluckyroo.com",
	"myufc88.com",
	"n1aud.org",
	"n1aus.net",
	"n1bet.live",
	"n1spin.com",
	"n1spin.org",
	"n1win.co",
	"n1win.net",
	"nab88.com",
	"nasa5aus.net",
	"nava7.co",
	"nbapay.com",
	"nc88au.com",
	"neiro55.com",
	"nelspin.com",
	"neoaus96.com",
	"neolux.life",
	"neolux.vip",
	"neonspin.net",
	"neospin66.com",
	"neospin66aus.com",
	"net96aus.com",
	"netplay77.com",
	"nextpokies.com",
	"nextpokies.net",
	"nexus96.com",
	"nexusaud.com",
	"nezha22.com",
	"nfl7.online",
	"ngt77au.vip",
	"nicemeth.com",
	"nicepokies.com",
	"nicespin.net",
	"nightclubaus.com",
	"ninjabet88.vip",
	"ninjaxau.com",
	"nitro96.io",
	"north29.co",
	"nova55au.com",
	"nova88.global",
	"nova96.com",
	"nova96.io",
	"novabet13.com",
	"novabet13.net",
	"novaluck.org",
	"novaspin.site",
	"nsw777.site",
	"nsw96.net",
	"nugget77.com",
	"nunuslot.com",
	"nutaus.com",
	"nutzspin.com",
	"nz22.net",
	"nz88au.com",
	"oakfold.co",
	"oakfold.net",
	"oathmeth.com",
	"obsidian7aud.com",
	"ocean96.com",
	"ocl8aus.com",
	"ohyes66.com",
	"oimate.co",
	"okayspin.com",
	"okbet789.co",
	"okbet789.net",
	"okvip7.net",
	"okwin33.net",
	"omg96.com",
	"on88aud.io",
	"on88aud.online",
	"on9au.com",
	"on9aud.com",
	"on9aus.com",
	"on9bet.today",
	"on9pokies.com",
	"one2betaus.com",
	"one2wins.com",
	"onegoal1.com",
	"onegoal2.net",
	"onegoldaus.com",
	"onepiece13.co",
	"onesearthau.com",
	"onewin888.com",
	"onewin9.com",
	"online9.store",
	"online9aus.com",
	"only1au.com",
	"onlymeth.com",
	"onya88.com",
	"onyxaud.com",
	"onyxaud1.com",
	"onz8gaming.com",
	"opal96.com",
	"opalaud.com",
	"opera777.co",
	"osko9.com",
	"outback444.com",
	"ox38.net",
	"oz2win.co",
	"oz360.co",
	"oz77.vip",
	"oz777.com",
	"oz9.net",
	"oz996.com",
	"ozedge9.com",
	"ozgod.net",
	"ozgogo.com",
	"oziwins.com",
	"ozlotto88.com",
	"ozlotto88.net",
	"ozluxe96.co",
	"ozluxe96.com",
	"ozmeth.com",
	"ozmeth.xyz",
	"ozowin.online",
	"ozplay.net",
	"ozplay77.net",
	"ozplay88.co",
	"ozpokie.net",
	"ozpokies365.com",
	"ozreel88.com",
	"ozspin.co",
	"ozstake.net",
	"ozwin66.com",
	"ozwin77.com",
	"ozwin777au.com",
	"ozwin96.co",
	"ozwin96.com",
	"ozy777.com",
	"ozzieparty.com",
	"palworld96.com",
	"panda88.games",
	"panda95au.com",
	"panda95au.net",
	"pandamagic.co",
	"paramax9.live",
	"paramax9.net",
	"pashmeth.com",
	"pashslot.com",
	"payday247.net",
	"payid123.com",
	"peakau.com",
	"peakau.online",
	"peakbet.co",
	"peakbet96.com",
	"peakyblinders777.com",
	"penguin88.online",
	"pesi13.co",
	"pesi13.com",
	"petercasino.com",
	"pg9aus.com",
	"pgwinaus66.com",
	"phoenixplay.vip",
	"pingerspin.com",
	"pks996.com",
	"plants9.com",
	"play365b.vip",
	"play369.co",
	"play77au.com",
	"play88a.com",
	"play88aus.com",
	"play99.co",
	"play999au.com",
	"playaud.site",
	"playaud1.com",
	"playaus.co",
	"playcunt.com",
	"playdash.asia",
	"playdash.live",
	"playerau.com",
	"playfortuneau.com",
	"playforuneau.com",
	"playlsd.com",
	"playmates9.net",
	"playmeth.net",
	"playnuts.net",
	"playozau.co",
	"playozau.com",
	"playroo9.com",
	"playselect777.vip",
	"playwink7.com",
	"pokebet77.online",
	"pokemon13.com",
	"pokemon9aus.org",
	"poker9.fun",
	"pokeslot8.co",
	"pokeslot8.com",
	"pokie-stars.com",
	"pokie365.com",
	"pokieedge.com",
	"pokiefoxau.com",
	"pokiepub.com",
	"pokies.com",
	"pokies007.com",
	"pokies123.com",
	"pokies18.com",
	"pokies21.com",
	"pokies21.net",
	"pokies2u.com",
	"pokies33au.com",
	"pokies33aus.com",
	"pokies4bet.com",
	"pokies4u.co",
	"pokies69.vip",
	"pokies7bet.com",
	"pokies88.com",
	"pokies88aus.com",
	"pokies92.vip",
	"pokies996au.com",
	"pokies9au.online",
	"pokies9aus.com",
	"pokiesbae.net",
	"pokiesbillion.co",
	"pokiesbillion.com",
	"pokiesboss.com",
	"pokiesboss1.com",
	"pokiesclub.co",
	"pokiesday.com",
	"pokiesdream.org",
	"pokiesflame.com",
	"pokiesgg.vip",
	"pokiesgod.com",
	"pokiesgood.net",
	"pokiesking1.club",
	"pokiesking1.com",
	"pokieskingau.com",
	"pokieskingdom.net",
	"pokieslab9.com",
	"pokiesluck.com",
	"pokiesluxe.com",
	"pokiesman.co",
	"pokiesme.net",
	"pokiesmummy.com",
	"pokiesnow.net",
	"pokiesofficial.net",
	"pokiesojo.com",
	"pokiesokay.com",
	"pokiesokay.ink",
	"pokiespark.net",
	"pokiespin96.com",
	"pokiesplay.net",
	"pokiespp.com",
	"pokiesproo.com",
	"pokiesspin.net",
	"pokiesstation.com",
	"pokiesthor.com",
	"pokiestt.com",
	"pokiesvv.com",
	"pokiesww.org",
	"pokiesx1.com",
	"pokiewinz.net",
	"pokiexau.bet",
	"pokiezeus.com",
	"pokyspin.net",
	"pop96.com",
	"popeye88.fit",
	"popeye88.site",
	"popmini96.com",
	"popmolly.co",
	"potstrike.com",
	"powerau.com",
	"powerball996.com",
	"pp33au.com",
	"pp77au.com",
	"pp99au.com",
	"predator9.vip",
	"premium1au.com",
	"premium1au.net",
	"prime96.com",
	"primeplayau.co",
	"pripokies.com",
	"prixstake.com",
	"prospin8.com",
	"psychospin.com",
	"pt77au.club",
	"punk11.com",
	"punter98.com",
	"pureluck9.com",
	"pxp99au.com",
	"pyramidhub.net",
	"q7pokies.com",
	"qbet21au.com",
	"qbet21aus.com",
	"quantumspin36.com",
	"queen13au.com",
	"queen88aus.com",
	"queenau.com",
	"queenau.online",
	"queenpokies.com",
	"queensbet1.com",
	"quickwin88a.com",
	"r35au.co",
	"raabet9.com",
	"raabet9.net",
	"race96.co",
	"race96.com",
	"ragecoke.com",
	"ragemeth.net",
	"ragepokies.net",
	"ragespin.net",
	"rainbow13.com",
	"ranger88au.com",
	"rapidez77aud.com",
	"raptor77.com",
	"raptor7777.com",
	"raraspin.com",
	"rcrown88.com",
	"rcrown88au.com",
	"ready.new",
	"real9au.com",
	"realpokies.com",
	"reborn7.co",
	"reborn7.com",
	"rec99au.com",
	"red96.com",
	"redspin.asia",
	"redspin.site",
	"redspin7.vip",
	"redspin8.com",
	"redspin88.com",
	"redspin88.net",
	"redspinfun.com",
	"redvortex8.com",
	"redzzo88.com",
	"reef33.cc",
	"reefpokies.co",
	"reelixmate.com",
	"reels11.com",
	"reels11.online",
	"refersm0k0s.com",
	"regal96.net",
	"regalau777.com",
	"regalaus11.com",
	"regalspin777.com",
	"retro33.io",
	"rex7au.com",
	"rex7au.vip",
	"rexclubau.com",
	"rggaming.me",
	"rich255pt.com",
	"rich996pt.com",
	"richau.me",
	"richbabaau.com",
	"richbabaaud.com",
	"richbet13.com",
	"richboy.co",
	"richcity8.com",
	"richclub9.com",
	"riches88.live",
	"richland99.com",
	"richmama8.com",
	"richmama8.net",
	"richmama885.com",
	"richmamaplay.com",
	"richman96.com",
	"richpapa8.com",
	"richpapa8.net",
	"richpokies.co",
	"richpokies.net",
	"richpokies.xyz",
	"richspinau.com",
	"ridgydidgeau.com",
	"ridgydidgebets.com",
	"ring88.com",
	"rippaspin.com",
	"ripperbets.co",
	"ripperbets.com",
	"ripperbets.vip",
	"rippermeth.com",
	"ripperroo.com",
	"rizspin.net",
	"robloxau.co",
	"roboslotau.com",
	"robot66au.net",
	"robot66aus.com",
	"rock9.com",
	"rockgold33.com",
	"rolex66.co",
	"rolex66.vip",
	"rolex9.net",
	"rolladollaaus.com",
	"rollau.xyz",
	"rolliebet96.com",
	"rolliebet96.net",
	"rolltt.net",
	"romanknighta.com",
	"roo123.com",
	"roo29.net",
	"roo96.com",
	"roo96.net",
	"roocrown.com",
	"roocrown.org",
	"rookash.com",
	"rooking.live",
	"rooplay168.com",
	"roopokies.co",
	"roorichau.com",
	"rooroomate.cc",
	"rooroomate.org",
	"roosino.com",
	"roospeedau.com",
	"roospeedau.online",
	"roospin.vip",
	"roospin33.com",
	"roowin88.com",
	"roox777.com",
	"royal63a.com",
	"royal8aus.co",
	"royal8aus.com",
	"royal99au.com",
	"royal9au.com",
	"royalaceau.co",
	"royalaceau.com",
	"royalaud.com",
	"royalaus7.online",
	"royale88.club",
	"royale9au.com",
	"royalpokies7.com",
	"royalpokies7.net",
	"royalvip7.com",
	"royalwin96.com",
	"roybet7.com",
	"royce96.com",
	"rpd33.com",
	"rpp88au.com",
	"rr33r.com",
	"rr4winaus.com",
	"rtp97.com",
	"rtpcnt.com",
	"rtpdoggy.com",
	"rtpmate.online",
	"rtpmeth.com",
	"rtppokies.com",
	"rtppokies1.com",
	"rtpvictory88.com",
	"rtpw33d.com",
	"rtpw33d.fun",
	"rubyaud.com",
	"rugby77.com",
	"s1spin.net",
	"s2meth.vip",
	"s888au.com",
	"s888aus.com",
	"s99au.com",
	"sacino7.com",
	"sacino7.org",
	"safeau.net",
	"safeau1.com",
	"saferoox.com",
	"sage96.com",
	"salamanca96.com",
	"sands33au.com",
	"sapphire7aud.com",
	"sapphireaud.vip",
	"sawspin.com",
	"sbingo9.com",
	"sboomerang.com",
	"sbuddy9.com",
	"scarletsin88au.com",
	"scatter9.com",
	"scc5.com",
	"scoobywin.net",
	"scr111.org",
	"scr28.com",
	"scr55.com",
	"scr55.net",
	"scr66.com",
	"select777.net",
	"sentalosuxau.com",
	"sentosaluxau.com",
	"sexyaus.co",
	"sexybet88.com",
	"sexyspinau.com",
	"sgdclub88.com",
	"sgdclub888.com",
	"shardbet.co",
	"sheriffspin.net",
	"shuffle96.com",
	"shuffle96.net",
	"sickcunt.co",
	"silver9au.com",
	"silverfox1.online",
	"silverfoxau.com",
	"simsspin.com",
	"sixty9.co",
	"sking668.co",
	"sky88au.com",
	"skycity88.net",
	"skycity88au.com",
	"skycrown33.com",
	"skycrown777.net",
	"skygate9au.net",
	"skygold98.com",
	"skyplay77aus.com",
	"skyrooau.com",
	"skyrooaus.com",
	"skystar96.co",
	"slotaud.net",
	"slotfred.com",
	"slotify7.com",
	"slotify7.vip",
	"slotland8au.net",
	"slotmate88.com",
	"slotmeth.net",
	"slotplay9.com",
	"slotrot.com",
	"slotrot.net",
	"slotunabets.com",
	"slutaus.com",
	"slutcunt.net",
	"slutspins.com",
	"sm8aud.com",
	"solidluck33.com",
	"solidluck33.site",
	"southern9.com",
	"sp77aud.online",
	"space77.net",
	"space77.site",
	"space9au.art",
	"space9au.com",
	"space9aus.com",
	"spacecraft9.com",
	"spaceman369.online",
	"spacepokies.com",
	"spacex98.com",
	"spade69.club",
	"spadeau.co",
	"spbo11.vip",
	"spectre007au.com",
	"speed365b.vip",
	"speed8.net",
	"speed8au.com",
	"speed9.co",
	"speed96.org",
	"speedau.info",
	"speedau.live",
	"speedau2.com",
	"speedaud.com",
	"speedaudd.store",
	"speedauspeedau.com",
	"speedaussie.com",
	"speedaussie.online",
	"speedball9.com",
	"speedbliss.net",
	"speedo168.com",
	"speedo168.net",
	"speedwin88.com",
	"speedwin96.com",
	"speedwin99.com",
	"speedxau.com",
	"spice77.site",
	"spicepokies.com",
	"spin126.com",
	"spin1313.com",
	"spin2u.com",
	"spin2u.io",
	"spin420.com",
	"spin4rich.com",
	"spin4rich.net",
	"spin96.com",
	"spinaa.net",
	"spinarooaus.net",
	"spinaud.live",
	"spinbaby.co",
	"spinbizzo.com",
	"spincash88.cash",
	"spincrown33.cc",
	"spincrown33.com",
	"spincunt.com",
	"spinday996a.com",
	"spindeluxe777.com",
	"spindice33.com",
	"spinex.live",
	"spinfina.com",
	"spinfortune777.cc",
	"spinfred.net",
	"spingaming.net",
	"spingoat.com",
	"spingoau.co",
	"spingoaus.com",
	"spingogo.org",
	"spinix-au.net",
	"spinix.club",
	"spinix19.com",
	"spinkash.com",
	"spinking.co",
	"spinking.net",
	"spinmate88.com",
	"spinmaxis.com",
	"spinmeth.com",
	"spinmeth88.com",
	"spinoo.org",
	"spinova.lol",
	"spinpokies29.com",
	"spinroo9.com",
	"spinsaga.net",
	"spinsage33.site",
	"spinsup77.com",
	"spinsx.co",
	"spinsx.net",
	"spintesla.com",
	"spintoro.com",
	"spinup77.com",
	"spinup99.com",
	"spinup99.site",
	"spinvegas9.com",
	"spinwoo.com",
	"spinza96.com",
	"spinzone11.club",
	"splinkos.com",
	"spn99.net",
	"spnclub96.com",
	"spongebob13.net",
	"sportau88.com",
	"spower8.com",
	"spring96au.com",
	"springmateau.com",
	"squeenaud.org",
	"sr7au.com",
	"sr7aus.com",
	"ss33s.com",
	"ss9au.pro",
	"ssss.vip",
	"ssv96.com",
	"stackau.online",
	"stake88au.com",
	"stake88au.net",
	"stake96.com",
	"stake96.io",
	"stakeau.com",
	"stakebro77.com",
	"stakemate77.com",
	"starcity777.vip",
	"stargoldau.com",
	"starlucau.com",
	"starryskyau.com",
	"starspin.co",
	"starspin996.com",
	"steadyau.com",
	"steadyaud.online",
	"stellariscasinoaud.com",
	"steppa96.com",
	"stokedau.com",
	"strawberry96.com",
	"straya9.net",
	"strayaboss.com",
	"strayaluck.com",
	"strayalux.vip",
	"strayawin.club",
	"success88.store",
	"sugar69daddy.com",
	"sugar96.com",
	"sugartown7.com",
	"sundaysunday.net",
	"sunshineslot.com",
	"sunway96.com",
	"super96.com",
	"super96au.com",
	"super996.com",
	"super996.net",
	"superaus.net",
	"supergameau.com",
	"supergameau.store",
	"supergameau.vip",
	"supergamingau.com",
	"supermario9.com",
	"supermateau.com",
	"supreme777.biz",
	"supreme777.com",
	"supremepokies.com",
	"sure66.com",
	"sure6x.com",
	"surerich.net",
	"surerich3.com",
	"susspin.com",
	"sv11.net",
	"sv1new.com",
	"svj33au.com",
	"svr33.com",
	"sydaus.site",
	"sydspin.org",
	"syndicatecasino.partners",
	"t.me",
	"t77au.com",
	"tab77.vip",
	"tab77au.co",
	"tab77au.com",
	"tab88.online",
	"tab96.com",
	"tab968.co",
	"tab99au.com",
	"tab9au.com",
	"tada.playsharing.com",
	"taxis33.com",
	"taxis33.online",
	"taxis33.org",
	"tcl21.com",
	"tcl99.com",
	"tcl99aus.com",
	"tcr99.com",
	"td88.au",
	"tedspin.net",
	"terrabet9.com",
	"thegoldenkoala.com",
	"theoneau.co",
	"theoneau.com",
	"thepokies33.com",
	"thepokies33.vip",
	"thepokies96.net",
	"thesovereignaud.com",
	"thespinau.com",
	"thesta8au.com",
	"thestar.asia",
	"thestar99.com",
	"thestarau.net",
	"thor7.com",
	"tiger88.support",
	"tigerau.com",
	"tigergrand.com",
	"tinder21.com",
	"tinniewin.com",
	"titsplay33.com",
	"tkspin.net",
	"tlcwin.com",
	"tmzbet.com",
	"tnt96.com",
	"tnt99au.com",
	"tonygame7.com",
	"top1au.net",
	"top1aud.com",
	"top1aud.site",
	"top1cas.com",
	"top96.com",
	"topaz33.com",
	"topbet9aud.com",
	"topcash7.com",
	"topcash7.vip",
	"topplayau.com",
	"toppokies33.com",
	"topspin.ltd",
	"topspinplay.com",
	"township64.com",
	"toystory9au.com",
	"toystory9au.net",
	"tpgame66au.com",
	"trackaud.com",
	"trillionaire33.com",
	"trueblue777au.com",
	"truebluebets.cc",
	"truebluebetscasino.com",
	"truebluex.com",
	"truedinkumbet.com",
	"truedinkumbet.fun",
	"truemate.mini",
	"truemateaus.com",
	"truepokies88.com",
	"truewin77.co",
	"truewin77.com",
	"trust88au.com",
	"tss88.pro",
	"tt-win.com",
	"twospin.com",
	"u1winau.com",
	"u1winaus.com",
	"u2win.online",
	"u88aud.com",
	"uap66.com",
	"ubet66au.online",
	"ubet66aus.com",
	"ubet96.com",
	"ubibet.co",
	"ufc66.com",
	"ufc9au.vip",
	"ufo9.asia",
	"ufokingau.com",
	"ultraau.com",
	"uluck33.com",
	"uni88.top",
	"unibet7.com",
	"unicorn22au.com",
	"unipokies.com",
	"unitedau.online",
	"unitedpokies.com",
	"up69bet.com",
	"uplay33.com",
	"urichbet88.net",
	"uruswin.com",
	"uruswinfun.com",
	"uu33au.com",
	"uu33au.net",
	"uuspin.com",
	"uuspin98.com",
	"uwin33au.club",
	"v12bet.net",
	"v12betau.net",
	"v1bet.me",
	"v1spin.com",
	"v2plus.me",
	"v6aus.co",
	"v6aus.org",
	"v6aus.website",
	"v7bet.co",
	"v8au.com",
	"v8aud.com",
	"v8spin.net",
	"vampspin.com",
	"vbet44.comhttps",
	"veeclub.net",
	"veespin.net",
	"vegas88.bet",
	"vegas99.co",
	"vegas99au.com",
	"velor7.com",
	"venus55.co",
	"venus55.com",
	"ves88.com",
	"ves88.vip",
	"vgs123.co",
	"vgs33.com",
	"vgs33aus.com",
	"vgs33plus.com",
	"vicbet777.com",
	"vicspin.com",
	"victor96.com",
	"victoria77au.com",
	"victoria77au.online",
	"victoryaud.com",
	"vigorspin.net",
	"vip11.club",
	"vip31.com",
	"vip61.com",
	"vip711.com",
	"vip77.club",
	"vip777au.com",
	"vip777au.net",
	"vip77au.com",
	"vip888.32auwin.com",
	"vip99.com",
	"vip99au.com",
	"vipaud.co",
	"virgin77.com",
	"virgin77.online",
	"viva96.com",
	"vivid96.com",
	"vivid96.net",
	"vpay9.com",
	"vplus9.com",
	"vpower2u.com",
	"vpower365.com",
	"vpower8.com",
	"vpower8.vip",
	"vspin365.com",
	"vv33v.com",
	"vv88aud.com",
	"vvin18.com",
	"vvip15.com",
	"w1spin.com",
	"w33aus.com",
	"w33plusaus.com",
	"wabet77.com",
	"waboom77.com",
	"waboom77.org",
	"waboom77.vip",
	"walespin.net",
	"warbet88.live",
	"wavepokies.com",
	"wawawin.live",
	"wawawin2.xyz",
	"wd40a.com",
	"wd40b.com",
	"wd40c.com",
	"we1winau.co",
	"we1winau.com",
	"webet29.com",
	"webo98.com",
	"webo98.live",
	"weedpokies.org",
	"weedspin.cc",
	"weedspin.com",
	"weedspin.org",
	"wegobet.co",
	"wellmeth.com",
	"wellpokies.com",
	"wemeth.com",
	"wepay7.com",
	"weplay88.com",
	"weplay88.me",
	"weplay9aus.org",
	"weslot88.org",
	"west28.com",
	"west28.net",
	"whackaus.com",
	"whackspin.net",
	"whataus.com",
	"wild88au.com",
	"wildcunt.net",
	"wildmeth.net",
	"wildngo.vip",
	"wildoz.co",
	"wildpokies1.com",
	"wildpokies8.vip",
	"wildpokies9.com",
	"wildspin24.co",
	"wildspin24.com",
	"wildvip.co",
	"wildvipgroup.com",
	"win19au.com",
	"win29au.club",
	"win2aud.cc",
	"win365a.vip",
	"win365b.vip",
	"win7au.com",
	"win998au.com",
	"win99au.com",
	"winall365.com",
	"winaud.cc",
	"winbet96au.net",
	"winfield88.net",
	"winfortune777.com",
	"wink9.com",
	"winmate8.org",
	"winmate88.org",
	"winmate99.com",
	"winner29.co",
	"winner29.com",
	"winnie777.net",
	"winniespin.org",
	"winrooau.com",
	"winsavage.com",
	"winshark88.com",
	"winshift77.online",
	"winspin99.com",
	"winspirit1.co",
	"winstar96.com",
	"winstar96au.com",
	"winstreak9.vip",
	"wintrue18.com",
	"winvault77.com",
	"winvault77.org",
	"winwin9.org",
	"winwin96.com",
	"winwinwin.club",
	"winwinwin1.online",
	"winx96.co",
	"winxau.com",
	"winzamate.com",
	"woah99.com",
	"wombat88.com",
	"wombat88.vip",
	"won29.co",
	"won29.com",
	"won29.net",
	"won66au.com",
	"won66aud1.com",
	"won66sea.com",
	"won68au.com",
	"won96.com",
	"won96.net",
	"woobet.co",
	"woocunt.com",
	"woohoo9.com",
	"woohoo9.vip",
	"woospin.net",
	"woospin.org",
	"woospin.vip",
	"worcunt.org",
	"workdgame.com",
	"world99.online",
	"world99aud.com",
	"wormsmate.com",
	"wow11.site",
	"wowbet9.org",
	"wowmeth.com",
	"wowpokiesau.com",
	"wowspeed.store",
	"wowspin77.com",
	"wowza96.com",
	"wrbaus.com",
	"wrc9.com",
	"wrc9.xyz",
	"wtfbet.net",
	"wtfmeth.com",
	"wtfpokies.com",
	"wtfslot.net",
	"wtfspin.net",
	"wthspin.com",
	"wwe77.site",
	"wwe77.store",
	"wynn33au.org",
	"wynnbetau.com",
	"wynnpokies.com",
	"x1win.co",
	"x2baby.com",
	"x2god.com",
	"x2meth.com",
	"x4betau.com",
	"xbet96.co",
	"xbet96.com",
	"xbox98.com",
	"xmas77.com",
	"xmeth98.com",
	"xofun88.com",
	"xox96.com",
	"xox96.net",
	"xoxau.com",
	"xpay33.live",
	"xpay33.org",
	"xpay33aus.com",
	"xpay9.com",
	"xplay96.com",
	"xturn33aus.com",
	"xwin96.co",
	"xwin96.com",
	"y8spin.com",
	"yayawin.com",
	"yayawin77.com",
	"yayawin88.com",
	"yeah96.co",
	"yeah96.com",
	"yellowbat8.com",
	"yellowbatfun.com",
	"yes68.com",
	"yes68.vip",
	"yes77au.com",
	"yokuspin.com",
	"youwin777au.com",
	"youwin777aus.com",
	"yypokies.com",
	"z1spin.com",
	"zebra88.club",
	"zebra88.online",
	"zeroaud.com",
	"zeroaud.site",
	"zircon33.cc",
	"zombies9.com",
	"zspin22.com"
]);
var LIST_KEY = "pokies_vault_domains_v1";
var CATALOG_STRIPPED_KEY = "pokies_vault_catalog_stripped_v1";
var GROUPS = /* @__PURE__ */ new Set([
	"new",
	"best",
	"unverified",
	"share",
	"latest",
	"custom"
]);
function siteRecord(domain, addedAt = null) {
	return {
		domain,
		group: "custom",
		addedAt
	};
}
function withoutBuiltIn(sites, keep) {
	return sites.filter((site) => keep.has(site.domain) || site.group === "custom" || !BUILT_IN_DOMAINS.has(site.domain));
}
function loadOwnedList() {
	try {
		const raw = localStorage.getItem(LIST_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (parsed.owned !== true || !Array.isArray(parsed.sites)) return null;
		const sites = [];
		const seen = /* @__PURE__ */ new Set();
		for (const item of parsed.sites) {
			if (!item || typeof item !== "object") continue;
			const row = item;
			const domain = normalizeDomain(String(row.domain ?? ""));
			if (!isPublicDomain(domain) || seen.has(domain)) continue;
			seen.add(domain);
			const addedAt = typeof row.addedAt === "string" ? row.addedAt : null;
			const group = GROUPS.has(row.group) ? row.group : null;
			sites.push(group ? {
				domain,
				group,
				addedAt
			} : siteRecord(domain, addedAt));
		}
		return sites;
	} catch {
		return null;
	}
}
function saveOwnedList(sites) {
	try {
		const payload = JSON.stringify({
			owned: true,
			sites
		});
		localStorage.setItem(LIST_KEY, payload);
		return localStorage.getItem(LIST_KEY) === payload;
	} catch {
		return false;
	}
}
function clearOwnedList() {
	try {
		localStorage.removeItem(LIST_KEY);
	} catch {}
}
var INTEL_KEY = "pokies_vault_intel_v1";
function domainsFromText(text) {
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const line of text.split(/\r?\n/)) {
		const cleaned = line.replace(/#.*/, "").trim();
		if (!cleaned) continue;
		for (const part of cleaned.split(/[\s,;]+/)) {
			const domain = normalizeDomain(part);
			if (!isPublicDomain(domain) || seen.has(domain)) continue;
			seen.add(domain);
			out.push(domain);
		}
	}
	return out;
}
function workingSites(custom, removed) {
	const gone = new Set(removed);
	const sites = [];
	const seen = /* @__PURE__ */ new Set();
	for (const site of custom) {
		const domain = normalizeDomain(site?.domain ?? "");
		if (!isPublicDomain(domain) || gone.has(domain) || seen.has(domain)) continue;
		sites.push({
			domain,
			group: "custom",
			addedAt: site.addedAt ?? null
		});
		seen.add(domain);
	}
	return sites;
}
function visibleSites(input) {
	if (input.listOwned) return input.sites;
	return workingSites(input.custom, input.removed);
}
var THEMES = [
	{
		id: "vault",
		name: "Vault",
		hint: "Cyan, violet, pink",
		bg: "#050507",
		panel: "#0c0c0e",
		panel2: "#141418",
		fg: "#f5f5f7",
		muted: "#92929e",
		faint: "#6f6f79",
		a: "#00e5ff",
		b: "#7b5cff",
		c: "#ff2fb0",
		ink: "#070708"
	},
	{
		id: "emerald",
		name: "Emerald",
		hint: "Mint and gold",
		bg: "#06110c",
		panel: "#0c1a14",
		panel2: "#12241c",
		fg: "#f3f7f4",
		muted: "#8ea398",
		faint: "#6d8074",
		a: "#3dffc5",
		b: "#1fa87a",
		c: "#d6b25e",
		ink: "#04110c"
	},
	{
		id: "arctic",
		name: "Arctic",
		hint: "Ice and steel",
		bg: "#070b12",
		panel: "#101722",
		panel2: "#172033",
		fg: "#f4f7fb",
		muted: "#93a0b5",
		faint: "#6e7c90",
		a: "#8fd6ff",
		b: "#6aa6ff",
		c: "#d7e4f5",
		ink: "#05080e"
	},
	{
		id: "ember",
		name: "Ember",
		hint: "Amber and copper",
		bg: "#100806",
		panel: "#1a100c",
		panel2: "#261812",
		fg: "#f8f3ef",
		muted: "#b5a197",
		faint: "#8a786c",
		a: "#ffb15a",
		b: "#ff6a3d",
		c: "#ff4d6a",
		ink: "#0c0604"
	},
	{
		id: "royal",
		name: "Royal",
		hint: "Gold and violet",
		bg: "#0a0812",
		panel: "#141022",
		panel2: "#1c1730",
		fg: "#f6f4fb",
		muted: "#a39bb8",
		faint: "#7c748f",
		a: "#e6c36a",
		b: "#9b6bff",
		c: "#f0a3ff",
		ink: "#07060e"
	},
	{
		id: "amber",
		name: "Amber",
		hint: "Full style · dark gold",
		bg: "#070605",
		panel: "#12100d",
		panel2: "#1b1814",
		fg: "#f4efe8",
		muted: "#a89886",
		faint: "#7d6e5e",
		a: "#f6d7a2",
		b: "#e0a04a",
		c: "#8d5a22",
		ink: "#0b0907"
	}
];
function isThemeId(value) {
	return THEMES.some((theme) => theme.id === value);
}
function themeById(id) {
	return THEMES.find((theme) => theme.id === id) ?? THEMES[0];
}
var SORT_IDS = [
	"default",
	"az",
	"za",
	"balance",
	"turnover",
	"cashout",
	"errors",
	"popular",
	"norefer",
	"shareAmount",
	"shareMax",
	"shareTurn",
	"new"
];
function isSortMode(value) {
	return typeof value === "string" && SORT_IDS.includes(value);
}
function chosenBonus(row, mode) {
	if (mode === "none" || mode === "share") return row.share;
	return row[mode];
}
function turnoverOf(bonus) {
	if (!bonus || !(bonus.amount > 0) || bonus.minWithdrawal == null || bonus.minWithdrawal < 0) return null;
	return bonus.minWithdrawal / bonus.amount;
}
function bestTurnover(row) {
	const values = [];
	for (const bonus of [
		row.commission,
		row.share,
		row.referral,
		row.new,
		row.rebate
	]) {
		const value = turnoverOf(bonus);
		if (value != null) values.push(value);
	}
	for (const bonus of row.availableBonuses) {
		const value = turnoverOf(bonus);
		if (value != null) values.push(value);
	}
	return values.length ? Math.min(...values) : null;
}
function asc(a, b) {
	return (a ?? Number.POSITIVE_INFINITY) - (b ?? Number.POSITIVE_INFINITY);
}
function desc(a, b) {
	return (b ?? Number.NEGATIVE_INFINITY) - (a ?? Number.NEGATIVE_INFINITY);
}
function compareSites(a, b, rowA, rowB, sort, bonusMode) {
	const tie = () => a.domain.localeCompare(b.domain);
	const okA = rowA?.ok ? rowA : null;
	const okB = rowB?.ok ? rowB : null;
	if (sort === "az") return tie();
	if (sort === "za") return b.domain.localeCompare(a.domain);
	if (sort === "new") return String(b.addedAt).localeCompare(String(a.addedAt)) || tie();
	if (sort === "balance") return desc(okA?.cash ?? null, okB?.cash ?? null) || tie();
	if (sort === "turnover") return asc(okA ? bestTurnover(okA) : null, okB ? bestTurnover(okB) : null) || tie();
	if (sort === "cashout") return asc(okA?.cashMinWithdrawal ?? null, okB?.cashMinWithdrawal ?? null) || tie();
	if (sort === "errors") {
		const rank = (row) => !row ? 2 : row.ok ? 1 : 0;
		return rank(rowA) - rank(rowB) || tie();
	}
	if (sort === "popular") {
		const rank = (group) => group === "best" ? 0 : 1;
		return rank(a.group) - rank(b.group) || tie();
	}
	if (sort === "norefer") {
		const rank = (row) => !row ? 1 : row.referral ? 2 : 0;
		return rank(okA) - rank(okB) || tie();
	}
	if (sort === "shareAmount" || sort === "shareMax" || sort === "shareTurn") {
		const bonusA = okA ? chosenBonus(okA, bonusMode) : null;
		const bonusB = okB ? chosenBonus(okB, bonusMode) : null;
		if (sort === "shareAmount") return desc(bonusA?.amount ?? null, bonusB?.amount ?? null) || tie();
		if (sort === "shareMax") return desc(bonusA?.maxWithdrawal ?? null, bonusB?.maxWithdrawal ?? null) || tie();
		return asc(turnoverOf(bonusA), turnoverOf(bonusB)) || tie();
	}
	return tie();
}
var KEY = "pokies_vault_v1";
var LIST_ERROR = "The domain list could not be saved on this device, so that change was not kept.";
function writeVault(state) {
	const { listOwned: _listOwned, sites: _sites, ...rest } = state;
	localStorage.setItem(KEY, JSON.stringify(rest));
}
function withSavedList(current, sites) {
	if (!saveOwnedList(sites)) return null;
	return {
		...current,
		listOwned: true,
		sites
	};
}
var EMPTY = {
	visited: [],
	mine: [],
	custom: [],
	removed: [],
	listOwned: false,
	sites: [],
	phone: "",
	password: "",
	fallbacks: [
		{
			phone: "",
			password: ""
		},
		{
			phone: "",
			password: ""
		},
		{
			phone: "",
			password: ""
		}
	],
	logins: {},
	lastFetch: null,
	attentionChecked: [],
	view: "default",
	notVisited: false,
	wallets: false,
	mineOnly: false,
	sort: "default",
	bonusMode: "none",
	theme: "vault"
};
function usableLogin(value) {
	if (!value || typeof value !== "object") return null;
	const phone = String(value.phone ?? "").replace(/\s+/g, "");
	const password = String(value.password ?? "");
	if (!/^[0-9+]{6,20}$/.test(phone) || password.length < 4 || password.length > 64) return null;
	return {
		phone,
		password
	};
}
function cleanLogins(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};
	const out = {};
	for (const [rawDomain, rawLogin] of Object.entries(value)) {
		const domain = normalizeDomain(rawDomain);
		const login = usableLogin(rawLogin);
		if (!isPublicDomain(domain) || !login) continue;
		out[domain] = login;
	}
	return out;
}
function load() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return EMPTY;
		const parsed = JSON.parse(raw);
		return {
			...EMPTY,
			...parsed,
			visited: Array.isArray(parsed.visited) ? parsed.visited : [],
			mine: Array.isArray(parsed.mine) ? parsed.mine : [],
			custom: Array.isArray(parsed.custom) ? parsed.custom : [],
			removed: Array.isArray(parsed.removed) ? Array.from(new Set(parsed.removed.map((item) => normalizeDomain(String(item))).filter(isPublicDomain))) : [],
			listOwned: false,
			sites: [],
			fallbacks: Array.isArray(parsed.fallbacks) && parsed.fallbacks.length === 3 ? parsed.fallbacks : EMPTY.fallbacks,
			logins: cleanLogins(parsed.logins),
			sort: isSortMode(parsed.sort) ? parsed.sort : EMPTY.sort,
			bonusMode: parsed.bonusMode ?? EMPTY.bonusMode,
			theme: isThemeId(parsed.theme) ? parsed.theme : EMPTY.theme,
			attentionChecked: Array.isArray(parsed.attentionChecked) ? parsed.attentionChecked.filter((item) => !!item && typeof item === "object" && typeof item.domain === "string" && typeof item.code === "string") : []
		};
	} catch {
		return EMPTY;
	}
}
var VaultContext = (0, import_react.createContext)(null);
function VaultProvider({ children }) {
	const [state, setState] = (0, import_react.useState)(EMPTY);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const saved = load();
		const keep = new Set(saved.custom.map((item) => normalizeDomain(item.domain)).filter(isPublicDomain));
		const base = loadOwnedList() ?? workingSites(saved.custom, saved.removed);
		const stripped = localStorage.getItem(CATALOG_STRIPPED_KEY) === "1";
		const sites = stripped ? base : withoutBuiltIn(base, keep);
		const dropped = new Set(base.map((site) => site.domain).filter((domain) => !sites.some((site) => site.domain === domain)));
		const mine = stripped ? saved.mine : saved.mine.filter((domain) => !dropped.has(domain));
		const visited = stripped ? saved.visited : saved.visited.filter((domain) => !dropped.has(domain));
		const lastFetch = stripped || !saved.lastFetch ? saved.lastFetch : {
			...saved.lastFetch,
			rows: saved.lastFetch.rows.filter((row) => !dropped.has(row.domain))
		};
		const attentionChecked = stripped ? saved.attentionChecked : saved.attentionChecked.filter((item) => !dropped.has(item.domain));
		const next = {
			...saved,
			listOwned: true,
			sites,
			mine,
			visited,
			lastFetch,
			attentionChecked
		};
		if (saveOwnedList(sites)) try {
			localStorage.setItem(CATALOG_STRIPPED_KEY, "1");
			writeVault(next);
		} catch {}
		setState(next);
		setReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		const theme = themeById(state.theme);
		document.documentElement.dataset.theme = theme.id;
		document.querySelector("meta[name=\"theme-color\"]")?.setAttribute("content", theme.bg);
	}, [state.theme]);
	const persist = (0, import_react.useCallback)((next) => {
		setState(next);
		try {
			writeVault(next);
		} catch {}
	}, []);
	const patch = (0, import_react.useCallback)((partial) => {
		setState((current) => {
			const next = {
				...current,
				...partial
			};
			try {
				writeVault(next);
			} catch {}
			return next;
		});
	}, []);
	const markVisited = (0, import_react.useCallback)((domain) => {
		setState((current) => {
			if (current.visited.includes(domain)) return current;
			const next = {
				...current,
				visited: [...current.visited, domain]
			};
			try {
				writeVault(next);
			} catch {}
			return next;
		});
	}, []);
	const toggleVisited = (0, import_react.useCallback)((domain) => {
		setState((current) => {
			const visited = current.visited.includes(domain) ? current.visited.filter((item) => item !== domain) : [...current.visited, domain];
			const next = {
				...current,
				visited
			};
			try {
				writeVault(next);
			} catch {}
			return next;
		});
	}, []);
	const toggleMine = (0, import_react.useCallback)((domain) => {
		setState((current) => {
			const mine = current.mine.includes(domain) ? current.mine.filter((item) => item !== domain) : [...current.mine, domain];
			const next = {
				...current,
				mine
			};
			try {
				writeVault(next);
			} catch {}
			return next;
		});
	}, []);
	const rememberAccount = (0, import_react.useCallback)((domain) => {
		setState((current) => {
			if (current.mine.includes(domain)) return current;
			const next = {
				...current,
				mine: [...current.mine, domain]
			};
			try {
				writeVault(next);
			} catch {}
			return next;
		});
	}, []);
	const rememberLogins = (0, import_react.useCallback)((updates) => {
		if (!updates.length) return;
		setState((current) => {
			const logins = { ...current.logins };
			let changed = false;
			for (const update of updates) {
				const domain = normalizeDomain(update.domain);
				if (!isPublicDomain(domain)) continue;
				const login = usableLogin(update.login);
				if (!login) {
					if (domain in logins) {
						delete logins[domain];
						changed = true;
					}
					continue;
				}
				const prev = logins[domain];
				if (prev && prev.phone === login.phone && prev.password === login.password) continue;
				logins[domain] = login;
				changed = true;
			}
			if (!changed) return current;
			const next = {
				...current,
				logins
			};
			try {
				writeVault(next);
			} catch {}
			return next;
		});
	}, []);
	const addDomain = (0, import_react.useCallback)((raw) => {
		const domain = normalizeDomain(raw);
		if (!isPublicDomain(domain)) return "Enter a domain like 9au.com";
		let error = null;
		setState((current) => {
			const base = current.listOwned ? current.sites : workingSites(current.custom, current.removed);
			const exists = base.some((site) => site.domain === domain);
			let next = current;
			if (!exists) {
				const saved = withSavedList(current, [siteRecord(domain, (/* @__PURE__ */ new Date()).toISOString()), ...base]);
				if (!saved) {
					error = LIST_ERROR;
					return current;
				}
				next = saved;
			}
			const custom = next.custom.some((item) => item.domain === domain) ? next.custom : [{
				domain,
				addedAt: (/* @__PURE__ */ new Date()).toISOString()
			}, ...next.custom];
			const mine = next.mine.includes(domain) ? next.mine : [...next.mine, domain];
			const removed = next.removed.filter((item) => item !== domain);
			const stored = {
				...next,
				custom,
				mine,
				removed
			};
			try {
				writeVault(stored);
			} catch {}
			return stored;
		});
		return error;
	}, []);
	const addManaged = (0, import_react.useCallback)((raws) => {
		const incoming = Array.from(new Set(raws.map((item) => normalizeDomain(item)).filter(isPublicDomain)));
		if (!incoming.length) return {
			added: 0,
			error: null
		};
		let added = 0;
		let error = null;
		setState((current) => {
			const base = current.listOwned ? current.sites : workingSites(current.custom, current.removed);
			const have = new Set(base.map((site) => site.domain));
			const sites = [...base];
			const stamp = (/* @__PURE__ */ new Date()).toISOString();
			for (const domain of incoming) {
				if (have.has(domain)) continue;
				sites.push(siteRecord(domain, stamp));
				have.add(domain);
				added += 1;
			}
			if (!added) return current;
			const saved = withSavedList(current, sites);
			if (!saved) {
				error = LIST_ERROR;
				added = 0;
				return current;
			}
			return saved;
		});
		return {
			added,
			error
		};
	}, []);
	const removeManaged = (0, import_react.useCallback)((domains) => {
		const drop = new Set(domains.map((item) => normalizeDomain(item)).filter(isPublicDomain));
		if (!drop.size) return null;
		let error = null;
		setState((current) => {
			const saved = withSavedList(current, (current.listOwned ? current.sites : workingSites(current.custom, current.removed)).filter((site) => !drop.has(site.domain)));
			if (!saved) {
				error = LIST_ERROR;
				return current;
			}
			const custom = current.custom.filter((item) => !drop.has(item.domain));
			const mine = current.mine.filter((item) => !drop.has(item));
			const lastFetch = current.lastFetch ? {
				...current.lastFetch,
				rows: current.lastFetch.rows.filter((row) => !drop.has(row.domain))
			} : current.lastFetch;
			const next = {
				...saved,
				custom,
				mine,
				lastFetch
			};
			try {
				writeVault(next);
			} catch {}
			return next;
		});
		return error;
	}, []);
	const saveOk = (0, import_react.useRef)(true);
	const saveFetch = (0, import_react.useCallback)((rows) => {
		const lastFetch = {
			at: Date.now(),
			rows
		};
		(0, import_react_dom.flushSync)(() => {
			setState((current) => {
				const found = rows.filter((row) => row.ok).map((row) => row.domain);
				const mine = Array.from(/* @__PURE__ */ new Set([...current.mine, ...found]));
				const next = {
					...current,
					lastFetch,
					mine
				};
				try {
					writeVault(next);
					saveOk.current = true;
				} catch {
					saveOk.current = false;
				}
				return next;
			});
		});
		return saveOk.current;
	}, []);
	const clearAll = (0, import_react.useCallback)(() => {
		clearOwnedList();
		try {
			localStorage.removeItem(INTEL_KEY);
		} catch {}
		persist(EMPTY);
	}, [persist]);
	const api = (0, import_react.useMemo)(() => ({
		ready,
		state,
		patch,
		toggleVisited,
		markVisited,
		toggleMine,
		addDomain,
		addManaged,
		removeManaged,
		rememberAccount,
		rememberLogins,
		saveFetch,
		clearAll
	}), [
		ready,
		state,
		patch,
		toggleVisited,
		markVisited,
		toggleMine,
		addDomain,
		addManaged,
		removeManaged,
		rememberAccount,
		rememberLogins,
		saveFetch,
		clearAll
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultContext.Provider, {
		value: api,
		children
	});
}
function useVault() {
	const ctx = (0, import_react.useContext)(VaultContext);
	if (!ctx) throw new Error("Vault missing");
	return ctx;
}
var styles_default = "/assets/styles-Cm9kuw35.css";
var Route$7 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: "Pokies Vault" },
			{
				name: "description",
				content: "A private list of pokie sites and a bonus fetcher for accounts that share your phone login."
			},
			{
				name: "theme-color",
				content: "#050507"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/png",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		"data-theme": "vault",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: "try{var t=JSON.parse(localStorage.getItem(\"pokies_vault_v1\")||\"null\");if(t&&typeof t.theme===\"string\")document.documentElement.dataset.theme=t.theme}catch(e){}" } }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$4 = () => import("./routes-DetQDf6O.mjs");
var Route$6 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./bonuses-Bn0E8Qgi.mjs");
var Route$5 = createFileRoute("/bonuses")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./fetch-C6nnTaXx.mjs");
var Route$4 = createFileRoute("/fetch")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./intel-J3eEIF9V.mjs");
var Route$3 = createFileRoute("/intel")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./login-CZcMZlay.mjs");
var Route$2 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route$1 = createFileRoute("/api/fetch-log")({ server: { handlers: { GET: async () => {
	const { requireUserId } = await import("./verify.server-BKa8_qn5.mjs");
	const { listFetchRuns } = await import("./fetch-log.server-BB1nGvZa.mjs");
	try {
		const runs = await listFetchRuns(await requireUserId());
		return Response.json({ runs });
	} catch {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}
} } } });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var rootRouteChildren = {
	IndexRoute: Route$6.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$7
	}),
	BonusesRoute: Route$5.update({
		id: "/bonuses",
		path: "/bonuses",
		getParentRoute: () => Route$7
	}),
	FetchRoute: Route$4.update({
		id: "/fetch",
		path: "/fetch",
		getParentRoute: () => Route$7
	}),
	IntelRoute: Route$3.update({
		id: "/intel",
		path: "/intel",
		getParentRoute: () => Route$7
	}),
	LoginRoute: Route$2.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$7
	}),
	ApiFetchLogRoute: Route$1.update({
		id: "/api/fetch-log",
		path: "/api/fetch-log",
		getParentRoute: () => Route$7
	}),
	ApiAuthSplatRoute: Route.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$7
	})
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { visibleSites as a, BUILT_IN_DOMAINS as c, THEMES as i, useVault as n, INTEL_KEY as o, compareSites as r, domainsFromText as s, router_exports as t };
