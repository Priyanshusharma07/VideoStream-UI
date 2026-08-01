import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as getSupabasePublicEnv } from "./auth-middleware-0_baoq69.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/videos.server-CGlfCHHi.js
function publicClient() {
	const { url, publishableKey: key } = getSupabasePublicEnv();
	return createClient(url, key, {
		auth: {
			storage: void 0,
			persistSession: false,
			autoRefreshToken: false
		},
		global: { fetch: (input, init) => {
			const headers = new Headers(init?.headers);
			if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
			headers.set("apikey", key);
			return fetch(input, {
				...init,
				headers
			});
		} }
	});
}
var SELECT = "id, owner_id, channel_name, title, description, tags, visibility, duration_seconds, view_count, video_url, thumbnail_url, created_at";
async function signOne(client, bucket, value) {
	if (!value) return null;
	if (value.startsWith("http://") || value.startsWith("https://")) return value;
	const { data } = await client.storage.from(bucket).createSignedUrl(value, 21600);
	return data?.signedUrl ?? null;
}
async function withSignedMedia(client, rows) {
	return Promise.all(rows.map(async (row) => ({
		...row,
		video_url: await signOne(client, "videos", row.video_url),
		thumbnail_url: await signOne(client, "thumbnails", row.thumbnail_url)
	})));
}
async function fetchFeed(limit = 24) {
	const client = publicClient();
	const { data, error } = await client.from("videos").select(SELECT).eq("visibility", "public").order("created_at", { ascending: false }).limit(limit);
	if (error) throw new Error(error.message);
	return withSignedMedia(client, data ?? []);
}
async function fetchSearch(query, tag) {
	const client = publicClient();
	let request = client.from("videos").select(SELECT).eq("visibility", "public");
	if (query.trim()) {
		const q = query.trim().replace(/[%,]/g, " ");
		request = request.or(`title.ilike.%${q}%,description.ilike.%${q}%,channel_name.ilike.%${q}%`);
	}
	if (tag) request = request.contains("tags", [tag]);
	const { data, error } = await request.order("view_count", { ascending: false }).limit(48);
	if (error) throw new Error(error.message);
	return withSignedMedia(client, data ?? []);
}
async function fetchVideo(id) {
	const client = publicClient();
	const { data, error } = await client.from("videos").select(SELECT).eq("id", id).maybeSingle();
	if (error) throw new Error(error.message);
	if (!data) return null;
	const { data: related } = await client.from("videos").select(SELECT).eq("visibility", "public").neq("id", id).order("view_count", { ascending: false }).limit(10);
	const [video] = await withSignedMedia(client, [data]);
	return {
		video,
		related: await withSignedMedia(client, related ?? [])
	};
}
async function fetchComments(videoId) {
	const client = publicClient();
	const { data, error } = await client.from("comments").select("id, body, created_at, user_id").eq("video_id", videoId).order("created_at", { ascending: false }).limit(100);
	if (error) throw new Error(error.message);
	const rows = data ?? [];
	if (rows.length === 0) return [];
	const ids = [...new Set(rows.map((row) => row.user_id))];
	const { data: profiles } = await client.from("profiles").select("id, display_name, avatar_url").in("id", ids);
	const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
	return rows.map((row) => ({
		id: row.id,
		body: row.body,
		created_at: row.created_at,
		user_id: row.user_id,
		author_name: byId.get(row.user_id)?.display_name ?? "Viewer",
		author_avatar: byId.get(row.user_id)?.avatar_url ?? null
	}));
}
async function fetchLikeCount(videoId) {
	const { count } = await publicClient().from("video_likes").select("video_id", {
		count: "exact",
		head: true
	}).eq("video_id", videoId);
	return count ?? 0;
}
async function bumpViews(videoId) {
	const { supabaseAdmin } = await import("./client.server-B6y01odK.mjs");
	const { data } = await supabaseAdmin.from("videos").select("view_count").eq("id", videoId).maybeSingle();
	if (!data) return;
	await supabaseAdmin.from("videos").update({ view_count: Number(data.view_count) + 1 }).eq("id", videoId);
}
//#endregion
export { fetchSearch as a, withSignedMedia as c, fetchLikeCount as i, fetchComments as n, fetchVideo as o, fetchFeed as r, publicClient as s, bumpViews as t };
