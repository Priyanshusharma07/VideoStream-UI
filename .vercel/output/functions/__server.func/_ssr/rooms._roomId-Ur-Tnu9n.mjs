import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rooms._roomId-Ur-Tnu9n.js
var $$splitComponentImporter = () => import("./rooms._roomId-DrBx5iJr.mjs");
var Route = createFileRoute("/_authenticated/rooms/$roomId")({
	head: () => ({ meta: [
		{ title: "Room — StreamHub" },
		{
			name: "description",
			content: "A private StreamHub room with live chat and screen sharing for watching together."
		},
		{
			property: "og:title",
			content: "Room — StreamHub"
		},
		{
			property: "og:description",
			content: "Live chat and screen sharing inside a private StreamHub watch room."
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
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
