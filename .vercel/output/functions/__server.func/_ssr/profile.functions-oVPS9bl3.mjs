import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-0_baoq69.mjs";
import { a as stringType, i as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { c as withSignedMedia, s as publicClient } from "./videos.server-CGlfCHHi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile.functions-oVPS9bl3.js
var VIDEO_SELECT = "id, owner_id, channel_name, title, description, tags, visibility, duration_seconds, view_count, video_url, thumbnail_url, created_at";
var getProfile_createServerFn_handler = createServerRpc({
	id: "9df9652da79c7ccc337ce62c64dcd11f1800a8eb6e0bd13747650358f67fe4e8",
	name: "getProfile",
	filename: "src/lib/profile.functions.ts"
}, (opts) => getProfile.__executeServer(opts));
var getProfile = createServerFn({ method: "GET" }).validator((input) => objectType({ userId: stringType().uuid() }).parse(input)).handler(getProfile_createServerFn_handler, async ({ data }) => {
	const client = publicClient();
	const { data: profile } = await client.from("profiles").select("id, display_name, handle, avatar_url, banner_url, bio, website, location, created_at").eq("id", data.userId).maybeSingle();
	if (!profile) return null;
	const { data: videoRows } = await client.from("videos").select(VIDEO_SELECT).eq("owner_id", data.userId).eq("visibility", "public").order("created_at", { ascending: false }).limit(48);
	const videos = await withSignedMedia(client, videoRows ?? []);
	const { count: subscribers } = await client.from("subscriptions").select("channel_id", {
		count: "exact",
		head: true
	}).eq("channel_id", data.userId);
	const { data: live } = await client.from("live_streams").select("id, title, status, started_at").eq("owner_id", data.userId).eq("status", "live").order("started_at", { ascending: false }).limit(1).maybeSingle();
	return {
		profile,
		videos,
		live,
		stats: {
			videos: videos.length,
			views: videos.reduce((sum, v) => sum + Number(v.view_count ?? 0), 0),
			subscribers: subscribers ?? 0
		}
	};
});
var updateMyProfile_createServerFn_handler = createServerRpc({
	id: "af00eb763dce352dc2f42ef901ef426a138feb40fdc7f79166552837a77fae5f",
	name: "updateMyProfile",
	filename: "src/lib/profile.functions.ts"
}, (opts) => updateMyProfile.__executeServer(opts));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	display_name: stringType().trim().min(1).max(60),
	bio: stringType().max(500).default(""),
	website: stringType().max(200).default(""),
	location: stringType().max(80).default(""),
	avatar_url: stringType().max(1e3).default(""),
	banner_url: stringType().max(1e3).default("")
}).parse(input)).handler(updateMyProfile_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("profiles").update({
		display_name: data.display_name,
		bio: data.bio || null,
		website: data.website || null,
		location: data.location || null,
		avatar_url: data.avatar_url || null,
		banner_url: data.banner_url || null
	}).eq("id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { getProfile_createServerFn_handler, updateMyProfile_createServerFn_handler };
