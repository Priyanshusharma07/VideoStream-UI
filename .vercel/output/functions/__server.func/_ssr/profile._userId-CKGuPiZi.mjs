import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile._userId-CKGuPiZi.js
var $$splitComponentImporter = () => import("./profile._userId-OveSucfM.mjs");
var Route = createFileRoute("/profile/$userId")({
	head: () => ({ meta: [
		{ title: "Creator profile — StreamHub" },
		{
			name: "description",
			content: "See a StreamHub creator's profile: their bio, uploaded videos, total views and whether they are live right now."
		},
		{
			property: "og:title",
			content: "Creator profile — StreamHub"
		},
		{
			property: "og:description",
			content: "A StreamHub creator profile with uploads, stats and live status."
		},
		{
			property: "og:type",
			content: "profile"
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
