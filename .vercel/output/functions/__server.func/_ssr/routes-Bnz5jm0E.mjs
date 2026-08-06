import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { f as Play, n as Users, v as Info } from "../_libs/lucide-react.mjs";
import { n as Button, t as AppShell } from "./AppShell-CnphflQx.mjs";
import { n as formatViews } from "./format-CMVa2bQM.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Rail } from "./VideoCard-hJW8IbN8.mjs";
import { t as feedQuery } from "./routes-brsQgfFN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bnz5jm0E.js
var import_jsx_runtime = require_jsx_runtime();
function HeroBanner({ video }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative isolate h-[68vh] min-h-[420px] w-full overflow-hidden",
		children: [
			video.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: video.thumbnail_url,
				alt: `Featured artwork for ${video.title}`,
				className: "absolute inset-0 h-full w-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "gradient-brand absolute inset-0 opacity-60" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "animate-rise relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-14 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-glow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-live h-1.5 w-1.5 rounded-full bg-primary-glow" }), " Featured today"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl",
						children: video.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-sm text-muted-foreground line-clamp-3 sm:text-base",
						children: video.description || `A featured pick from ${video.channel_name}.`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: [
							video.channel_name,
							" · ",
							formatViews(Number(video.view_count))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							className: "gradient-brand rounded-full px-7 font-semibold text-primary-foreground transition-transform hover:scale-[1.03]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/videos/$id",
								params: { id: video.id },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mr-2 h-5 w-5 fill-current" }), " Watch now"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "secondary",
							className: "rounded-full px-7 font-semibold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/videos/$id",
								params: { id: video.id },
								hash: "details",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "mr-2 h-5 w-5" }), " More info"]
							})
						})]
					})
				]
			})
		]
	});
}
function FeedPage() {
	const { data } = useSuspenseQuery(feedQuery);
	const featured = data[0];
	const trending = [...data].sort((a, b) => Number(b.view_count) - Number(a.view_count));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		bleed: true,
		children: [featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroBanner, { video: featured }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "aurora px-4 pt-24 text-center sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-extrabold",
				children: "Nothing streaming yet"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Upload your first video to get started."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 mx-auto -mt-8 max-w-[1600px] px-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
					title: "Trending now",
					videos: trending.slice(0, 12)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
					title: "New releases",
					videos: data.slice(0, 12),
					wide: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
					title: "Because you watch on StreamHub",
					videos: [...data].reverse().slice(0, 12)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "panel mt-14 overflow-hidden rounded-3xl p-8 sm:p-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5" }), " Watch party"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "mt-4 text-2xl font-extrabold sm:text-3xl",
									children: [
										"Create a ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gradient",
											children: "Room"
										}),
										" and watch together"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 max-w-xl text-sm text-muted-foreground",
									children: "Share a room ID and password with friends. Chat in real time and share your screen — like a private cinema meet, right inside StreamHub."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							className: "gradient-brand w-fit rounded-full px-8 font-semibold text-primary-foreground transition-transform hover:scale-[1.03]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/rooms",
								children: "Open Rooms"
							})
						})]
					})
				})
			]
		})]
	});
}
//#endregion
export { FeedPage as component };
