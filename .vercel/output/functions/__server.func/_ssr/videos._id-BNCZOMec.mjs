import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as ThumbsUp, s as Share2 } from "../_libs/lucide-react.mjs";
import { a as useSession, i as cn, n as Button, t as AppShell } from "./AppShell-CnphflQx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as toggleLike, i as getComments, o as getLikeCount, s as getMyLike, t as addComment, u as registerView } from "./videos.functions-D8NNpIgP.mjs";
import { i as timeAgo, n as formatViews, t as formatDuration } from "./format-CMVa2bQM.mjs";
import { i as useQuery, o as useQueryClient, r as useSuspenseQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Textarea } from "./textarea-CCVvIhY4.mjs";
import { n as videoQuery, t as Route } from "./videos._id-DlIQRsAd.mjs";
import { t as Root } from "../_libs/radix-ui__react-separator.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/videos._id-BNCZOMec.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Separator = import_react.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = Root.displayName;
function WatchPage() {
	const { id } = Route.useParams();
	const { data } = useSuspenseQuery(videoQuery(id));
	const { user } = useSession();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [body, setBody] = (0, import_react.useState)("");
	const viewed = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (viewed.current) return;
		viewed.current = true;
		registerView({ data: { id } });
	}, [id]);
	const comments = useQuery({
		queryKey: ["comments", id],
		queryFn: () => getComments({ data: { id } })
	});
	const likes = useQuery({
		queryKey: ["likes", id],
		queryFn: () => getLikeCount({ data: { id } })
	});
	const myLike = useQuery({
		queryKey: [
			"my-like",
			id,
			user?.id ?? null
		],
		queryFn: () => getMyLike({ data: { id } }),
		enabled: Boolean(user)
	});
	const likeMutation = useMutation({
		mutationFn: () => toggleLike({ data: { id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["likes", id] });
			queryClient.invalidateQueries({ queryKey: ["my-like", id] });
		},
		onError: () => toast.error("Could not update your like.")
	});
	const commentMutation = useMutation({
		mutationFn: () => addComment({ data: {
			id,
			body
		} }),
		onSuccess: () => {
			setBody("");
			queryClient.invalidateQueries({ queryKey: ["comments", id] });
		},
		onError: () => toast.error("Could not post your comment.")
	});
	if (!data) return null;
	const { video, related } = data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-xl bg-black",
					children: video.video_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: video.video_url,
						poster: video.thumbnail_url ?? void 0,
						controls: true,
						playsInline: true,
						className: "aspect-video w-full"
					}, video.video_url) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex aspect-video items-center justify-center text-sm text-muted-foreground",
						children: "This video is still processing."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-xl font-bold leading-snug",
					children: video.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold uppercase",
							children: video.channel_name.slice(0, 2)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: video.channel_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								formatDuration(video.duration_seconds),
								" · ",
								timeAgo(video.created_at)
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: myLike.data?.liked ? "default" : "secondary",
							size: "sm",
							className: "rounded-full",
							disabled: likeMutation.isPending,
							onClick: () => {
								if (!user) {
									toast("Sign in to like this video.");
									navigate({ to: "/auth" });
									return;
								}
								likeMutation.mutate();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "mr-2 h-4 w-4" }), likes.data ?? 0]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							size: "sm",
							className: "rounded-full",
							onClick: () => {
								navigator.clipboard?.writeText(window.location.href);
								toast.success("Link copied");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "mr-2 h-4 w-4" }), " Share"]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-xl bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-medium",
							children: [
								formatViews(Number(video.view_count)),
								" · ",
								timeAgo(video.created_at)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 whitespace-pre-wrap text-sm text-muted-foreground",
							children: video.description || "No description provided."
						}),
						video.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: video.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/explore",
								search: { tag },
								className: "text-xs text-primary hover:underline",
								children: ["#", tag]
							}, tag))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-6" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-label": "Comments",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-base font-semibold",
							children: [comments.data?.length ?? 0, " Comments"]
						}),
						user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-4 flex gap-3",
							onSubmit: (e) => {
								e.preventDefault();
								if (body.trim()) commentMutation.mutate();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: body,
								onChange: (e) => setBody(e.target.value),
								placeholder: "Add a comment…",
								rows: 2,
								className: "bg-surface"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: !body.trim() || commentMutation.isPending,
								children: "Comment"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									className: "text-primary underline",
									children: "Sign in"
								}),
								" ",
								"to join the conversation."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-6 space-y-5",
							children: (comments.data ?? []).map((comment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold uppercase",
									children: comment.author_name.slice(0, 2)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: comment.author_name
										}),
										" ",
										timeAgo(comment.created_at)
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 whitespace-pre-wrap text-sm",
									children: comment.body
								})] })]
							}, comment.id))
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold text-muted-foreground",
				children: "Up next"
			}), related.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/videos/$id",
				params: { id: item.id },
				className: "flex gap-3 group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-video w-40 shrink-0 overflow-hidden rounded-lg bg-surface",
					children: item.thumbnail_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.thumbnail_url,
						alt: `Thumbnail for ${item.title}`,
						loading: "lazy",
						className: "h-full w-full object-cover"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "line-clamp-2 text-sm font-medium group-hover:text-primary",
							children: item.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 truncate text-xs text-muted-foreground",
							children: item.channel_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: formatViews(Number(item.view_count))
						})
					]
				})]
			}, item.id))]
		})]
	}) });
}
//#endregion
export { WatchPage as component };
