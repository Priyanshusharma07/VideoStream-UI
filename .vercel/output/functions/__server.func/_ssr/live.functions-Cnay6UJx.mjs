import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-0_baoq69.mjs";
import { a as stringType, i as objectType, n as enumType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { s as publicClient } from "./videos.server-CGlfCHHi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live.functions-Cnay6UJx.js
var SELECT = "id, owner_id, title, description, category, thumbnail_url, playback_url, status, viewer_count, started_at, ended_at";
async function withHosts(rows) {
	if (rows.length === 0) return [];
	const client = publicClient();
	const ids = [...new Set(rows.map((row) => row.owner_id))];
	const { data: profiles } = await client.from("profiles").select("id, display_name, avatar_url").in("id", ids);
	const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
	return rows.map((row) => ({
		...row,
		host_name: byId.get(row.owner_id)?.display_name ?? "Creator",
		host_avatar: byId.get(row.owner_id)?.avatar_url ?? null
	}));
}
async function fetchLiveStreams(status = "all") {
	let request = publicClient().from("live_streams").select(SELECT);
	if (status !== "all") request = request.eq("status", status);
	const { data, error } = await request.order("started_at", { ascending: false }).limit(48);
	if (error) throw new Error(error.message);
	return withHosts(data ?? []);
}
async function fetchLiveStream(id) {
	const { data, error } = await publicClient().from("live_streams").select(SELECT).eq("id", id).maybeSingle();
	if (error) throw new Error(error.message);
	if (!data) return null;
	const [row] = await withHosts([data]);
	return row ?? null;
}
async function fetchLiveMessages(streamId) {
	const client = publicClient();
	const { data, error } = await client.from("live_messages").select("id, body, user_id, created_at").eq("stream_id", streamId).order("created_at", { ascending: true }).limit(200);
	if (error) throw new Error(error.message);
	const rows = data ?? [];
	if (rows.length === 0) return [];
	const ids = [...new Set(rows.map((row) => row.user_id))];
	const { data: profiles } = await client.from("profiles").select("id, display_name, avatar_url").in("id", ids);
	const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
	return rows.map((row) => ({
		...row,
		author_name: byId.get(row.user_id)?.display_name ?? "Viewer",
		author_avatar: byId.get(row.user_id)?.avatar_url ?? null
	}));
}
var listLiveStreams_createServerFn_handler = createServerRpc({
	id: "b7ff2d6536904b7bc0405dec136c51dd7e43e102ecca81614f1c7fd151b9fd99",
	name: "listLiveStreams",
	filename: "src/lib/live.functions.ts"
}, (opts) => listLiveStreams.__executeServer(opts));
var listLiveStreams = createServerFn({ method: "GET" }).validator((input) => objectType({ status: enumType([
	"live",
	"ended",
	"all"
]).default("all") }).default({ status: "all" }).parse(input ?? {})).handler(listLiveStreams_createServerFn_handler, async ({ data }) => fetchLiveStreams(data.status));
var getLiveStream_createServerFn_handler = createServerRpc({
	id: "db37ca105358be39c3f6ef569fbd6d2474351d30a33fef88ce29aee3ab628c8e",
	name: "getLiveStream",
	filename: "src/lib/live.functions.ts"
}, (opts) => getLiveStream.__executeServer(opts));
var getLiveStream = createServerFn({ method: "GET" }).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(getLiveStream_createServerFn_handler, async ({ data }) => fetchLiveStream(data.id));
var getLiveMessages_createServerFn_handler = createServerRpc({
	id: "8437c3efa6c0b4d431ea380e6f8c4bee1283f4cedf827a1fc1b7c970a2012b04",
	name: "getLiveMessages",
	filename: "src/lib/live.functions.ts"
}, (opts) => getLiveMessages.__executeServer(opts));
var getLiveMessages = createServerFn({ method: "GET" }).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(getLiveMessages_createServerFn_handler, async ({ data }) => fetchLiveMessages(data.id));
var startLiveStream_createServerFn_handler = createServerRpc({
	id: "7fd725e674fb811a4141c0e6fc14177a7898a74e5b29b949c37694d33117cd20",
	name: "startLiveStream",
	filename: "src/lib/live.functions.ts"
}, (opts) => startLiveStream.__executeServer(opts));
var startLiveStream = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	title: stringType().trim().min(1).max(140),
	description: stringType().max(2e3).default(""),
	category: stringType().trim().min(1).max(40).default("General"),
	playback_url: stringType().url().max(1e3).nullable().default(null),
	thumbnail_url: stringType().url().max(1e3).nullable().default(null)
}).parse(input)).handler(startLiveStream_createServerFn_handler, async ({ data, context }) => {
	const { data: row, error } = await context.supabase.from("live_streams").insert({
		...data,
		owner_id: context.userId,
		status: "live"
	}).select("id").single();
	if (error) throw new Error(error.message);
	return { id: row.id };
});
var endLiveStream_createServerFn_handler = createServerRpc({
	id: "49e498daff7857cb9108e4abf119ecc4259fc0ee9ca7c27a9a4089c34e46f90e",
	name: "endLiveStream",
	filename: "src/lib/live.functions.ts"
}, (opts) => endLiveStream.__executeServer(opts));
var endLiveStream = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(endLiveStream_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("live_streams").update({
		status: "ended",
		ended_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.id).eq("owner_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var sendLiveMessage_createServerFn_handler = createServerRpc({
	id: "fa6523af65725861a27d9025146db32a33f016bc35c9a123908e93cd28981f1d",
	name: "sendLiveMessage",
	filename: "src/lib/live.functions.ts"
}, (opts) => sendLiveMessage.__executeServer(opts));
var sendLiveMessage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	id: stringType().uuid(),
	body: stringType().trim().min(1).max(500)
}).parse(input)).handler(sendLiveMessage_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("live_messages").insert({
		stream_id: data.id,
		user_id: context.userId,
		body: data.body
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { endLiveStream_createServerFn_handler, getLiveMessages_createServerFn_handler, getLiveStream_createServerFn_handler, listLiveStreams_createServerFn_handler, sendLiveMessage_createServerFn_handler, startLiveStream_createServerFn_handler };
