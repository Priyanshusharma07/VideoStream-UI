import { a as getFeed } from "./videos.functions-D8NNpIgP.mjs";
import { n as queryOptions } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-brsQgfFN.js
var feedQuery = queryOptions({
	queryKey: ["feed"],
	queryFn: () => getFeed()
});
//#endregion
export { feedQuery as t };
