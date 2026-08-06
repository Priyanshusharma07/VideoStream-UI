import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Trash2, i as Upload } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as cn, n as Button, t as AppShell } from "./AppShell-CnphflQx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as getMyVideos, r as deleteVideo } from "./videos.functions-D8NNpIgP.mjs";
import { t as Skeleton } from "./skeleton-CZ-cQ2Z7.mjs";
import { i as timeAgo, n as formatViews, t as formatDuration } from "./format-CMVa2bQM.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function DashboardPage() {
	const queryClient = useQueryClient();
	const { data, isPending } = useQuery({
		queryKey: ["my-videos"],
		queryFn: () => getMyVideos()
	});
	const remove = useMutation({
		mutationFn: (id) => deleteVideo({ data: { id } }),
		onSuccess: () => {
			toast.success("Video deleted");
			queryClient.invalidateQueries({ queryKey: ["my-videos"] });
		},
		onError: () => toast.error("Could not delete that video.")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex items-center justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl font-bold tracking-tight",
			children: "Your videos"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			size: "sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/upload",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-4 w-4" }), " Upload"]
			})
		})]
	}), isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i))
	}) : (data?.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-16 text-center text-sm text-muted-foreground",
		children: "You haven't published anything yet."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-3",
		children: data.map((video) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex flex-wrap items-center gap-4 rounded-xl bg-surface p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/videos/$id",
					params: { id: video.id },
					className: "aspect-video w-40 shrink-0 overflow-hidden rounded-lg bg-background",
					children: video.thumbnail_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: video.thumbnail_url,
						alt: `Thumbnail for ${video.title}`,
						loading: "lazy",
						className: "h-full w-full object-cover"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/videos/$id",
							params: { id: video.id },
							className: "line-clamp-1 text-sm font-semibold hover:text-primary",
							children: video.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								formatViews(Number(video.view_count)),
								" ·",
								" ",
								formatDuration(video.duration_seconds),
								" · ",
								timeAgo(video.created_at)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: "mt-2 capitalize",
							children: video.visibility
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					"aria-label": `Delete ${video.title}`,
					disabled: remove.isPending,
					onClick: () => remove.mutate(video.id),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
				})
			]
		}, video.id))
	})] });
}
//#endregion
export { DashboardPage as component };
