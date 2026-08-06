import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as stringType, i as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explore-Bw7SS1b4.js
var $$splitComponentImporter = () => import("./explore-BzHLPY0l.mjs");
var Route = createFileRoute("/explore")({
	validateSearch: objectType({
		q: stringType().optional(),
		tag: stringType().optional()
	}),
	head: () => ({ meta: [
		{ title: "Explore videos — StreamHub" },
		{
			name: "description",
			content: "Search StreamHub for videos by title, creator or topic, and filter results by tag."
		},
		{
			property: "og:title",
			content: "Explore videos — StreamHub"
		},
		{
			property: "og:description",
			content: "Search StreamHub for videos by title, creator or topic."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
