import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-XibAT3dJ.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BjMjp4PP.mjs";
import { a as stringType, i as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rooms.functions-D3jY0SVy.js
var listMyRooms = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("9eeedacd22cae3bf75e2d314a3f76a2fe2dd2e63ca0f25ccfeb3687cca06f294"));
var createRoom = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	name: stringType().trim().min(1).max(60),
	password: stringType().min(4).max(72)
}).parse(input)).handler(createSsrRpc("6a56a1959ab0c01348361c8afd3f81642ccaed0e6f7386bdeffc960904161e74"));
var joinRoom = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	code: stringType().trim().min(4).max(12),
	password: stringType().min(1).max(72)
}).parse(input)).handler(createSsrRpc("b1eaa648fafcba7ac73372187e97f4cb3c08e5c04c0bd53ec434bee5327384db"));
var getRoom = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("9196ea101134a394afa38dbb21c9c8785975e03e0999ebfa299605ec5a4cffbd"));
var getRoomMessages = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("2946d922d6950937bf5788d921d4a13cff26a6b805e98d937bf26b65ef24effe"));
var sendRoomMessage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	id: stringType().uuid(),
	body: stringType().trim().min(1).max(1e3)
}).parse(input)).handler(createSsrRpc("c8fca4c6fd38539fe9386f6a38addf8ade44eb22947e6e7c9f4206479bc1444a"));
var leaveRoom = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("573aaae5ed954ebedc3dbafa50daf911c6bb786d98ae5d6ef582ddb0351f22cb"));
//#endregion
export { leaveRoom as a, joinRoom as i, getRoom as n, listMyRooms as o, getRoomMessages as r, sendRoomMessage as s, createRoom as t };
