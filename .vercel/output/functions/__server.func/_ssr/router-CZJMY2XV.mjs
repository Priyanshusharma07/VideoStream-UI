import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CCZKrZq_.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, j as redirect, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Route$8 } from "./explore-Bw7SS1b4.mjs";
import { t as Route$9 } from "./live._streamId-Ds4cH4tC.mjs";
import { t as Route$10 } from "./profile._userId-DAtuBsfg.mjs";
import { t as Route$11 } from "./rooms._roomId-CznjHS7a.mjs";
import { t as feedQuery } from "./routes-brsQgfFN.mjs";
import { t as Route$12 } from "./videos._id-DlIQRsAd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CZJMY2XV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DShN9WbY.css";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$7 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "StreamHub" },
			{
				name: "description",
				content: "Cinematic streaming with private watch-together rooms."
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "StreamHub"
			},
			{
				property: "og:description",
				content: "Cinematic streaming with private watch-together rooms."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$7.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "bottom-right" })]
	});
}
var $$splitErrorComponentImporter = () => import("./routes-BYO1g6FF.mjs");
var $$splitComponentImporter$6 = () => import("./routes-Bnz5jm0E.mjs");
var Route$6 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "StreamHub — Stream, upload and watch together" },
		{
			name: "description",
			content: "StreamHub is a cinematic streaming platform: browse featured titles, upload your own videos and watch together in private rooms with chat and screen sharing."
		},
		{
			property: "og:title",
			content: "StreamHub — Stream, upload and watch together"
		},
		{
			property: "og:description",
			content: "Featured titles, creator uploads and private watch-together rooms with live chat."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	loader: ({ context }) => context.queryClient.ensureQueryData(feedQuery),
	component: lazyRouteComponent($$splitComponentImporter$6, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
var $$splitComponentImporter$5 = () => import("./route-Di7iQBCH.mjs");
var Route$5 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./auth-CPlaVQ3k.mjs");
var Route$4 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign in — StreamHub" },
		{
			name: "description",
			content: "Sign in or create a StreamHub account to upload videos, like and comment."
		},
		{
			property: "og:title",
			content: "Sign in — StreamHub"
		},
		{
			property: "og:description",
			content: "Create a StreamHub account to upload videos, like and comment."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./dashboard-Bd7viAWc.mjs");
var Route$3 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [
		{ title: "Your videos — StreamHub" },
		{
			name: "description",
			content: "Manage the videos you published on StreamHub: views, visibility and deletion."
		},
		{
			property: "og:title",
			content: "Your videos — StreamHub"
		},
		{
			property: "og:description",
			content: "Manage your published StreamHub videos."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./upload-D-yfV5YA.mjs");
var Route$2 = createFileRoute("/_authenticated/upload")({
	head: () => ({ meta: [
		{ title: "Upload a video — StreamHub" },
		{
			name: "description",
			content: "Upload an MP4, add a thumbnail, tags and visibility, and publish to StreamHub."
		},
		{
			property: "og:title",
			content: "Upload a video — StreamHub"
		},
		{
			property: "og:description",
			content: "Publish your video to StreamHub in a few steps."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./live.index-78oZRZ09.mjs");
var Route$1 = createFileRoute("/live/")({
	head: () => ({ meta: [
		{ title: "Live now — StreamHub" },
		{
			name: "description",
			content: "Watch StreamHub creators broadcasting live right now, join the real-time chat, or start your own live stream in seconds."
		},
		{
			property: "og:title",
			content: "Live now — StreamHub"
		},
		{
			property: "og:description",
			content: "Live broadcasts from StreamHub creators with real-time chat."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./rooms.index-DuPYgxtq.mjs");
var Route = createFileRoute("/_authenticated/rooms/")({
	head: () => ({ meta: [
		{ title: "Watch Rooms — StreamHub" },
		{
			name: "description",
			content: "Create or join a private StreamHub room with a room ID and password to chat live and share your screen with friends."
		},
		{
			property: "og:title",
			content: "Watch Rooms — StreamHub"
		},
		{
			property: "og:description",
			content: "Private watch-together rooms with live chat and screen sharing."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$7
});
var AuthenticatedRouteRoute = Route$5.update({
	id: "/_authenticated",
	getParentRoute: () => Route$7
});
var AuthRoute = Route$4.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$7
});
var ExploreRoute = Route$8.update({
	id: "/explore",
	path: "/explore",
	getParentRoute: () => Route$7
});
var AuthenticatedDashboardRoute = Route$3.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedUploadRoute = Route$2.update({
	id: "/upload",
	path: "/upload",
	getParentRoute: () => AuthenticatedRouteRoute
});
var LiveIndexRoute = Route$1.update({
	id: "/live/",
	path: "/live/",
	getParentRoute: () => Route$7
});
var LiveStreamIdRoute = Route$9.update({
	id: "/live/$streamId",
	path: "/live/$streamId",
	getParentRoute: () => Route$7
});
var ProfileUserIdRoute = Route$10.update({
	id: "/profile/$userId",
	path: "/profile/$userId",
	getParentRoute: () => Route$7
});
var VideosIdRoute = Route$12.update({
	id: "/videos/$id",
	path: "/videos/$id",
	getParentRoute: () => Route$7
});
var AuthenticatedRoomsIndexRoute = Route.update({
	id: "/rooms/",
	path: "/rooms/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedDashboardRoute,
	AuthenticatedUploadRoute,
	AuthenticatedRoomsRoomIdRoute: Route$11.update({
		id: "/rooms/$roomId",
		path: "/rooms/$roomId",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedRoomsIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	ExploreRoute,
	LiveStreamIdRoute,
	ProfileUserIdRoute,
	VideosIdRoute,
	LiveIndexRoute
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
