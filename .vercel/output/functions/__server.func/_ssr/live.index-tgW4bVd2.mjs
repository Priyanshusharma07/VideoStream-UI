import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Users, u as Radio } from "../_libs/lucide-react.mjs";
import { a as useSession, n as Button, r as Input, t as AppShell } from "./AppShell-CacCG9dI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as timeAgo } from "./format-CMVa2bQM.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { i as listLiveStreams, o as startLiveStream } from "./live.functions-D5-mpNaX.mjs";
import { t as Textarea } from "./textarea-DVfA9G13.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, r as DialogDescription, t as Dialog } from "./dialog-D8P3pPmh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live.index-tgW4bVd2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LivePage() {
	const { user } = useSession();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		description: "",
		category: "General",
		playback_url: ""
	});
	const streams = useQuery({
		queryKey: ["live-streams"],
		queryFn: () => listLiveStreams({ data: { status: "all" } })
	});
	const start = useMutation({
		mutationFn: () => startLiveStream({ data: {
			title: form.title,
			description: form.description,
			category: form.category || "General",
			playback_url: form.playback_url.trim() ? form.playback_url.trim() : null,
			thumbnail_url: null
		} }),
		onSuccess: ({ id }) => {
			setOpen(false);
			queryClient.invalidateQueries({ queryKey: ["live-streams"] });
			navigate({
				to: "/live/$streamId",
				params: { streamId: id }
			});
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not go live")
	});
	const all = streams.data ?? [];
	const live = all.filter((item) => item.status === "live");
	const past = all.filter((item) => item.status !== "live");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mt-4 flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-2 rounded-full border border-live/40 bg-live/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-live",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot h-1.5 w-1.5 rounded-full" }), " Live"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 text-3xl font-bold",
					children: "Live now"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-sm text-muted-foreground",
					children: "Real-time broadcasts with live chat. Start your own in one click."
				})
			] }), user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "rounded-full px-6 font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "mr-2 h-4 w-4" }), " Go live"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Start a live stream" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Give your broadcast a title. Add a playback link (MP4 or HLS) if you already have one." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "space-y-3",
						onSubmit: (event) => {
							event.preventDefault();
							start.mutate();
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.title,
								onChange: (event) => setForm({
									...form,
									title: event.target.value
								}),
								placeholder: "Stream title",
								maxLength: 140,
								required: true,
								"aria-label": "Stream title"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.category,
								onChange: (event) => setForm({
									...form,
									category: event.target.value
								}),
								placeholder: "Category",
								maxLength: 40,
								"aria-label": "Category"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: form.description,
								onChange: (event) => setForm({
									...form,
									description: event.target.value
								}),
								placeholder: "What is this stream about?",
								maxLength: 2e3,
								"aria-label": "Description"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.playback_url,
								onChange: (event) => setForm({
									...form,
									playback_url: event.target.value
								}),
								placeholder: "https://… playback link (optional)",
								maxLength: 1e3,
								"aria-label": "Playback link"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full rounded-full",
								disabled: start.isPending,
								children: start.isPending ? "Starting…" : "Go live"
							})
						]
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "secondary",
				className: "rounded-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/auth",
					children: "Sign in to go live"
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mt-8",
			children: streams.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading streams…"
			}) : live.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel rounded-2xl p-10 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "Nobody is live right now"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-sm text-muted-foreground",
					children: "Be the first to go live and your stream shows up here instantly."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 xl:grid-cols-3",
				children: live.map((stream) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveCard, { stream }, stream.id))
			})
		}),
		past.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold",
				children: "Recently ended"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3",
				children: past.map((stream) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveCard, { stream }, stream.id))
			})]
		}) : null
	] });
}
function LiveCard({ stream }) {
	const isLive = stream.status === "live";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/live/$streamId",
		params: { streamId: stream.id },
		className: "panel group animate-rise block overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex aspect-video items-center justify-center bg-elevated",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" }),
				isLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-live px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-live-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-live-foreground" }), " Live"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
					children: "Ended"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-semibold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }),
						" ",
						stream.viewer_count
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "line-clamp-1 text-sm font-semibold",
				children: stream.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 truncate text-xs text-muted-foreground",
				children: [
					stream.host_name,
					" · ",
					stream.category,
					" · ",
					timeAgo(stream.started_at)
				]
			})]
		})]
	});
}
//#endregion
export { LivePage as component };
