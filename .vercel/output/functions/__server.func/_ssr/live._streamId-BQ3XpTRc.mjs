import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live._streamId-BQ3XpTRc.js
var $$splitComponentImporter = () => import("./live._streamId-HEy-t-vE.mjs");
var Route = createFileRoute("/live/$streamId")({
	head: () => ({ meta: [
		{ title: "Live stream — StreamHub" },
		{
			name: "description",
			content: "Watch this StreamHub live broadcast and join the real-time chat with other viewers."
		},
		{
			property: "og:title",
			content: "Live stream — StreamHub"
		},
		{
			property: "og:description",
			content: "A StreamHub live broadcast with real-time viewer chat."
		},
		{
			property: "og:type",
			content: "video.other"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
