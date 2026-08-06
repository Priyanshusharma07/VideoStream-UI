import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-XibAT3dJ.mjs";
import { a as stringType, i as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rooms.functions-DJzFHJBz.js
var ITERATIONS = 1e5;
function toHex(buffer) {
	return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function fromHex(hex) {
	const out = new Uint8Array(hex.length / 2);
	for (let i = 0; i < out.length; i += 1) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
	return out;
}
async function derive(password, salt) {
	const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
	return toHex(await crypto.subtle.deriveBits({
		name: "PBKDF2",
		salt,
		iterations: ITERATIONS,
		hash: "SHA-256"
	}, key, 256));
}
async function hashPassword(password) {
	const salt = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	return `pbkdf2$${ITERATIONS}$${toHex(salt.buffer)}$${await derive(password, salt)}`;
}
async function verifyPassword(password, stored) {
	const [scheme, , saltHex, digest] = stored.split("$");
	if (scheme !== "pbkdf2" || !saltHex || !digest) return false;
	const candidate = await derive(password, fromHex(saltHex));
	if (candidate.length !== digest.length) return false;
	let diff = 0;
	for (let i = 0; i < candidate.length; i += 1) diff |= candidate.charCodeAt(i) ^ digest.charCodeAt(i);
	return diff === 0;
}
var ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function generateRoomCode() {
	return [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(6))].map((b) => ALPHABET[b % 31]).join("");
}
async function listRoomsFor(client, userId) {
	const { data, error } = await client.from("rooms").select("id, code, name, owner_id, created_at").order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	const rows = data ?? [];
	if (rows.length === 0) return [];
	const { data: members } = await client.from("room_members").select("room_id").in("room_id", rows.map((row) => row.id));
	const counts = /* @__PURE__ */ new Map();
	for (const m of members ?? []) counts.set(m.room_id, (counts.get(m.room_id) ?? 0) + 1);
	return rows.map((row) => ({
		...row,
		owner_id: row.owner_id ?? userId,
		member_count: counts.get(row.id) ?? 0
	}));
}
var listMyRooms_createServerFn_handler = createServerRpc({
	id: "9eeedacd22cae3bf75e2d314a3f76a2fe2dd2e63ca0f25ccfeb3687cca06f294",
	name: "listMyRooms",
	filename: "src/lib/rooms.functions.ts"
}, (opts) => listMyRooms.__executeServer(opts));
var listMyRooms = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listMyRooms_createServerFn_handler, async ({ context }) => listRoomsFor(context.supabase, context.userId));
var createRoom_createServerFn_handler = createServerRpc({
	id: "6a56a1959ab0c01348361c8afd3f81642ccaed0e6f7386bdeffc960904161e74",
	name: "createRoom",
	filename: "src/lib/rooms.functions.ts"
}, (opts) => createRoom.__executeServer(opts));
var createRoom = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	name: stringType().trim().min(1).max(60),
	password: stringType().min(4).max(72)
}).parse(input)).handler(createRoom_createServerFn_handler, async ({ data, context }) => {
	const code = generateRoomCode();
	const password_hash = await hashPassword(data.password);
	const { data: room, error } = await context.supabase.from("rooms").insert({
		code,
		name: data.name,
		owner_id: context.userId,
		password_hash
	}).select("id, code").single();
	if (error) throw new Error(error.message);
	await context.supabase.from("room_members").insert({
		room_id: room.id,
		user_id: context.userId
	});
	return {
		id: room.id,
		code: room.code
	};
});
var joinRoom_createServerFn_handler = createServerRpc({
	id: "b1eaa648fafcba7ac73372187e97f4cb3c08e5c04c0bd53ec434bee5327384db",
	name: "joinRoom",
	filename: "src/lib/rooms.functions.ts"
}, (opts) => joinRoom.__executeServer(opts));
var joinRoom = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	code: stringType().trim().min(4).max(12),
	password: stringType().min(1).max(72)
}).parse(input)).handler(joinRoom_createServerFn_handler, async ({ data, context }) => {
	const { supabaseAdmin } = await import("./client.server-BMIyIfYd.mjs");
	const { data: room } = await supabaseAdmin.from("rooms").select("id, password_hash").eq("code", data.code.toUpperCase()).maybeSingle();
	if (!room || !await verifyPassword(data.password, room.password_hash)) return {
		ok: false,
		error: "Invalid room ID or password."
	};
	const { error } = await supabaseAdmin.from("room_members").upsert({
		room_id: room.id,
		user_id: context.userId
	}, { onConflict: "room_id,user_id" });
	if (error) throw new Error(error.message);
	return {
		ok: true,
		id: room.id
	};
});
var getRoom_createServerFn_handler = createServerRpc({
	id: "9196ea101134a394afa38dbb21c9c8785975e03e0999ebfa299605ec5a4cffbd",
	name: "getRoom",
	filename: "src/lib/rooms.functions.ts"
}, (opts) => getRoom.__executeServer(opts));
var getRoom = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(getRoom_createServerFn_handler, async ({ data, context }) => {
	const { data: room } = await context.supabase.from("rooms").select("id, code, name, owner_id, created_at").eq("id", data.id).maybeSingle();
	if (!room) return null;
	const { data: profile } = await context.supabase.from("profiles").select("display_name").eq("id", context.userId).maybeSingle();
	return {
		room,
		me: {
			id: context.userId,
			name: profile?.display_name ?? "Viewer"
		},
		isOwner: room.owner_id === context.userId
	};
});
var getRoomMessages_createServerFn_handler = createServerRpc({
	id: "2946d922d6950937bf5788d921d4a13cff26a6b805e98d937bf26b65ef24effe",
	name: "getRoomMessages",
	filename: "src/lib/rooms.functions.ts"
}, (opts) => getRoomMessages.__executeServer(opts));
var getRoomMessages = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(getRoomMessages_createServerFn_handler, async ({ data, context }) => {
	const { data: rows, error } = await context.supabase.from("room_messages").select("id, body, user_id, created_at").eq("room_id", data.id).order("created_at", { ascending: true }).limit(200);
	if (error) throw new Error(error.message);
	const ids = [...new Set((rows ?? []).map((r) => r.user_id))];
	const { data: profiles } = ids.length ? await context.supabase.from("profiles").select("id, display_name").in("id", ids) : { data: [] };
	const names = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));
	return (rows ?? []).map((row) => ({
		...row,
		author_name: names.get(row.user_id) ?? "Viewer"
	}));
});
var sendRoomMessage_createServerFn_handler = createServerRpc({
	id: "c8fca4c6fd38539fe9386f6a38addf8ade44eb22947e6e7c9f4206479bc1444a",
	name: "sendRoomMessage",
	filename: "src/lib/rooms.functions.ts"
}, (opts) => sendRoomMessage.__executeServer(opts));
var sendRoomMessage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	id: stringType().uuid(),
	body: stringType().trim().min(1).max(1e3)
}).parse(input)).handler(sendRoomMessage_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("room_messages").insert({
		room_id: data.id,
		user_id: context.userId,
		body: data.body
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
var leaveRoom_createServerFn_handler = createServerRpc({
	id: "573aaae5ed954ebedc3dbafa50daf911c6bb786d98ae5d6ef582ddb0351f22cb",
	name: "leaveRoom",
	filename: "src/lib/rooms.functions.ts"
}, (opts) => leaveRoom.__executeServer(opts));
var leaveRoom = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(leaveRoom_createServerFn_handler, async ({ data, context }) => {
	await context.supabase.from("room_members").delete().eq("room_id", data.id).eq("user_id", context.userId);
	return { ok: true };
});
//#endregion
export { createRoom_createServerFn_handler, getRoomMessages_createServerFn_handler, getRoom_createServerFn_handler, joinRoom_createServerFn_handler, leaveRoom_createServerFn_handler, listMyRooms_createServerFn_handler, sendRoomMessage_createServerFn_handler };
