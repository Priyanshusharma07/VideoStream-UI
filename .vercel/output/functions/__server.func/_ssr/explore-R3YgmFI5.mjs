import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-CacCG9dI.mjs";
import { d as searchVideos } from "./videos.functions-Pwz8LT0K.mjs";
import { t as Skeleton } from "./skeleton-DrCGcbun.mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Route } from "./explore-CL3pvHwW.mjs";
import { r as VideoGrid } from "./VideoCard-BoFdZjQQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explore-R3YgmFI5.js
var import_jsx_runtime = require_jsx_runtime();
var TAGS = [
	"animation",
	"music",
	"science",
	"coding",
	"food",
	"nature",
	"travel",
	"explainer"
];
function ExplorePage() {
	const { q = "", tag } = Route.useSearch();
	const { data, isPending } = useQuery({
		queryKey: [
			"search",
			q,
			tag ?? null
		],
		queryFn: () => searchVideos({ data: {
			q,
			tag: tag ?? null
		} })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-4 text-3xl font-extrabold sm:text-4xl",
			children: q ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Results for ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-gradient",
				children: q
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Explore ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-gradient",
				children: "everything"
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "my-5 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/explore",
				search: { q: q || void 0 },
				className: `rounded-full border border-border/70 px-4 py-1.5 text-sm transition-colors ${!tag ? "gradient-brand border-transparent font-semibold text-primary-foreground" : "bg-surface/70 hover:bg-secondary"}`,
				children: "All"
			}), TAGS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/explore",
				search: {
					q: q || void 0,
					tag: t
				},
				className: `rounded-full border border-border/70 px-4 py-1.5 text-sm capitalize transition-colors ${tag === t ? "gradient-brand border-transparent font-semibold text-primary-foreground" : "bg-surface/70 hover:bg-secondary"}`,
				children: t
			}, t))]
		}),
		isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
			children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-video rounded-2xl" }, i))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoGrid, { videos: data ?? [] })
	] });
}
//#endregion
export { ExplorePage as component };
