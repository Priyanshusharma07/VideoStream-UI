import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-0_baoq69.mjs";
import { a as stringType, i as objectType, n as enumType, r as numberType, t as arrayType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { a as fetchSearch, c as withSignedMedia, i as fetchLikeCount, n as fetchComments, o as fetchVideo, r as fetchFeed, s as publicClient, t as bumpViews } from "./videos.server-CGlfCHHi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/videos.functions-CkVjGjea.js
var getFeed_createServerFn_handler = createServerRpc({
	id: "7318d1ebef3ce782f7baeb90ba6182b0fbf9e7250cdc93f143cc1ef704e24fa5",
	name: "getFeed",
	filename: "src/lib/videos.functions.ts"
}, (opts) => getFeed.__executeServer(opts));
var getFeed = createServerFn({ method: "GET" }).handler(getFeed_createServerFn_handler, async () => fetchFeed());
var searchVideos_createServerFn_handler = createServerRpc({
	id: "9732118caeb24c4a8ccddf8a23bf04fd53bef7afac5daeafceeb848b4a181a5e",
	name: "searchVideos",
	filename: "src/lib/videos.functions.ts"
}, (opts) => searchVideos.__executeServer(opts));
var searchVideos = createServerFn({ method: "GET" }).validator((input) => objectType({
	q: stringType().max(120).default(""),
	tag: stringType().max(60).nullable().default(null)
}).parse(input)).handler(searchVideos_createServerFn_handler, async ({ data }) => fetchSearch(data.q, data.tag));
var getVideo_createServerFn_handler = createServerRpc({
	id: "86ee313542ae1c5e995371f17bedebdc2795fc08cc6ec53a8735fea34e67cb4c",
	name: "getVideo",
	filename: "src/lib/videos.functions.ts"
}, (opts) => getVideo.__executeServer(opts));
var getVideo = createServerFn({ method: "GET" }).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(getVideo_createServerFn_handler, async ({ data }) => fetchVideo(data.id));
var getComments_createServerFn_handler = createServerRpc({
	id: "d0c723d1e55efde7de9774baeb16bce9d1d459a67eb5318ec526537b85bafcfb",
	name: "getComments",
	filename: "src/lib/videos.functions.ts"
}, (opts) => getComments.__executeServer(opts));
var getComments = createServerFn({ method: "GET" }).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(getComments_createServerFn_handler, async ({ data }) => fetchComments(data.id));
var getLikeCount_createServerFn_handler = createServerRpc({
	id: "805b79b7b241fbe9b3d44e72587335bca505f0570d425f7d387b7800adc4599f",
	name: "getLikeCount",
	filename: "src/lib/videos.functions.ts"
}, (opts) => getLikeCount.__executeServer(opts));
var getLikeCount = createServerFn({ method: "GET" }).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(getLikeCount_createServerFn_handler, async ({ data }) => fetchLikeCount(data.id));
var registerView_createServerFn_handler = createServerRpc({
	id: "62f6b528352f4cfbfa459f8b60c841a83eb6158139a9681ab381a2cf7fdb7e41",
	name: "registerView",
	filename: "src/lib/videos.functions.ts"
}, (opts) => registerView.__executeServer(opts));
var registerView = createServerFn({ method: "POST" }).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(registerView_createServerFn_handler, async ({ data }) => {
	await bumpViews(data.id);
	return { ok: true };
});
var getMyVideos_createServerFn_handler = createServerRpc({
	id: "4f00ada363127aaca7635554b52d0684dc489e6ca6f8909cba82a673bd00efd2",
	name: "getMyVideos",
	filename: "src/lib/videos.functions.ts"
}, (opts) => getMyVideos.__executeServer(opts));
var getMyVideos = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getMyVideos_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("videos").select("*").eq("owner_id", context.userId).order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return withSignedMedia(publicClient(), data ?? []);
});
var createVideo_createServerFn_handler = createServerRpc({
	id: "ef36ed1464bdf94c95727b9952cc2015433451f20b7167c9fd4847557c36d9a2",
	name: "createVideo",
	filename: "src/lib/videos.functions.ts"
}, (opts) => createVideo.__executeServer(opts));
var createVideo = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	title: stringType().min(1).max(140),
	description: stringType().max(5e3).default(""),
	tags: arrayType(stringType().max(40)).max(12).default([]),
	visibility: enumType([
		"public",
		"unlisted",
		"private"
	]).default("public"),
	duration_seconds: numberType().int().min(0).max(86400).default(0),
	video_path: stringType().min(1).max(500),
	thumbnail_path: stringType().max(500).nullable().default(null)
}).parse(input)).handler(createVideo_createServerFn_handler, async ({ data, context }) => {
	const { data: profile } = await context.supabase.from("profiles").select("display_name").eq("id", context.userId).maybeSingle();
	const { data: row, error } = await context.supabase.from("videos").insert({
		owner_id: context.userId,
		channel_name: profile?.display_name ?? "Creator",
		title: data.title,
		description: data.description,
		tags: data.tags,
		visibility: data.visibility,
		duration_seconds: data.duration_seconds,
		video_url: data.video_path,
		thumbnail_url: data.thumbnail_path
	}).select("id").single();
	if (error) throw new Error(error.message);
	return { id: row.id };
});
var deleteVideo_createServerFn_handler = createServerRpc({
	id: "3fcd159205240d6926126acac1e16e0b826c923dfac07b14dd13822331355611",
	name: "deleteVideo",
	filename: "src/lib/videos.functions.ts"
}, (opts) => deleteVideo.__executeServer(opts));
var deleteVideo = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(deleteVideo_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("videos").delete().eq("id", data.id).eq("owner_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var toggleLike_createServerFn_handler = createServerRpc({
	id: "db8f94db4ba02a4874dddd7d30c5b501756ca392d67bf2321761a7a630d96441",
	name: "toggleLike",
	filename: "src/lib/videos.functions.ts"
}, (opts) => toggleLike.__executeServer(opts));
var toggleLike = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(toggleLike_createServerFn_handler, async ({ data, context }) => {
	const { data: existing } = await context.supabase.from("video_likes").select("video_id").eq("video_id", data.id).eq("user_id", context.userId).maybeSingle();
	if (existing) {
		await context.supabase.from("video_likes").delete().eq("video_id", data.id).eq("user_id", context.userId);
		return { liked: false };
	}
	await context.supabase.from("video_likes").insert({
		video_id: data.id,
		user_id: context.userId
	});
	return { liked: true };
});
var getMyLike_createServerFn_handler = createServerRpc({
	id: "842c9cfb1f32148d9e797da27bf7be26697a20ff42b9744bdc5a8cdb62afe458",
	name: "getMyLike",
	filename: "src/lib/videos.functions.ts"
}, (opts) => getMyLike.__executeServer(opts));
var getMyLike = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(getMyLike_createServerFn_handler, async ({ data, context }) => {
	const { data: existing } = await context.supabase.from("video_likes").select("video_id").eq("video_id", data.id).eq("user_id", context.userId).maybeSingle();
	return { liked: Boolean(existing) };
});
var addComment_createServerFn_handler = createServerRpc({
	id: "adb847b22bfa2b0decb5282939fef5f11794adcce32b3c09f64fdeb0e4a17329",
	name: "addComment",
	filename: "src/lib/videos.functions.ts"
}, (opts) => addComment.__executeServer(opts));
var addComment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	id: stringType().uuid(),
	body: stringType().min(1).max(2e3)
}).parse(input)).handler(addComment_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("comments").insert({
		video_id: data.id,
		user_id: context.userId,
		body: data.body
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { addComment_createServerFn_handler, createVideo_createServerFn_handler, deleteVideo_createServerFn_handler, getComments_createServerFn_handler, getFeed_createServerFn_handler, getLikeCount_createServerFn_handler, getMyLike_createServerFn_handler, getMyVideos_createServerFn_handler, getVideo_createServerFn_handler, registerView_createServerFn_handler, searchVideos_createServerFn_handler, toggleLike_createServerFn_handler };
