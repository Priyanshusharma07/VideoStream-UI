import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { f as Play } from "../_libs/lucide-react.mjs";
import { i as cn } from "./AppShell-CnphflQx.mjs";
import { i as timeAgo, n as formatViews, t as formatDuration } from "./format-CMVa2bQM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/VideoCard-hJW8IbN8.js
var import_jsx_runtime = require_jsx_runtime();
function PosterCard({ video, index = 0, wide = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/videos/$id",
		params: { id: video.id },
		"aria-label": video.title,
		className: "group animate-rise block",
		style: { animationDelay: `${Math.min(index, 8) * 45}ms` },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-card transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/60 group-hover:glow", wide ? "aspect-video" : "aspect-[2/3]"),
			children: [
				video.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: video.thumbnail_url,
					alt: `Cover art for ${video.title}`,
					loading: "lazy",
					className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "gradient-brand flex h-full w-full items-center justify-center opacity-70",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-8 w-8 text-primary-foreground" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent opacity-90" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute right-2 top-2 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-semibold tabular-nums backdrop-blur",
					children: formatDuration(video.duration_seconds)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "gradient-brand flex h-12 w-12 items-center justify-center rounded-full shadow-glow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-5 w-5 fill-primary-foreground text-primary-foreground" })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 bottom-0 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "line-clamp-2 text-sm font-semibold leading-snug",
						children: video.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 truncate text-[11px] text-muted-foreground",
						children: [
							video.channel_name,
							" · ",
							formatViews(Number(video.view_count))
						]
					})]
				})
			]
		})
	});
}
function VideoCard({ video }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/videos/$id",
		params: { id: video.id },
		className: "group block",
		"aria-label": video.title,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-video overflow-hidden rounded-2xl border border-border/60 bg-surface",
			children: [video.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: video.thumbnail_url,
				alt: `Thumbnail for ${video.title}`,
				loading: "lazy",
				className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full w-full items-center justify-center text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-8 w-8" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute bottom-2 right-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold tabular-nums",
				children: formatDuration(video.duration_seconds)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "gradient-brand mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase text-primary-foreground",
				children: video.channel_name.slice(0, 2)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary-glow",
						children: video.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 truncate text-xs text-muted-foreground",
						children: video.channel_name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							formatViews(Number(video.view_count)),
							" · ",
							timeAgo(video.created_at)
						]
					})
				]
			})]
		})]
	});
}
function VideoGrid({ videos }) {
	if (videos.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-16 text-center text-sm text-muted-foreground",
		children: "Nothing here yet."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
		children: videos.map((video) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, { video }, video.id))
	});
}
function Rail({ title, videos, wide = false }) {
	if (videos.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold sm:text-xl",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted-foreground",
				children: [videos.length, " titles"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6",
			children: videos.map((video, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("shrink-0 snap-start", wide ? "w-[300px] sm:w-[360px]" : "w-[150px] sm:w-[180px]"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosterCard, {
					video,
					index: i,
					wide
				})
			}, video.id))
		})]
	});
}
//#endregion
export { VideoCard as n, VideoGrid as r, Rail as t };
