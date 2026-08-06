import { P as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as getVideo } from "./videos.functions-D8NNpIgP.mjs";
import { n as queryOptions } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/videos._id-DlIQRsAd.js
var videoQuery = (id) => queryOptions({
	queryKey: ["video", id],
	queryFn: () => getVideo({ data: { id } })
});
var $$splitErrorComponentImporter = () => import("./videos._id-B7PwMflo.mjs");
var $$splitNotFoundComponentImporter = () => import("./videos2._id-DV7JXNaU.mjs");
var $$splitComponentImporter = () => import("./videos._id-BNCZOMec.mjs");
var Route = createFileRoute("/videos/$id")({
	loader: async ({ context, params }) => {
		const data = await context.queryClient.ensureQueryData(videoQuery(params.id));
		if (!data) throw notFound();
		return data;
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Video unavailable — StreamHub" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { video } = loaderData;
		const description = video.description.slice(0, 150) || `Watch ${video.title} on StreamHub.`;
		return { meta: [
			{ title: `${video.title} — StreamHub` },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: video.title
			},
			{
				property: "og:description",
				content: description
			},
			{
				property: "og:type",
				content: "video.other"
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
//#endregion
export { videoQuery as n, Route as t };
