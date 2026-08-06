import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-XibAT3dJ.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BjMjp4PP.mjs";
import { a as stringType, i as objectType, n as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live.functions-D7ss4d2_.js
var listLiveStreams = createServerFn({ method: "GET" }).validator((input) => objectType({ status: enumType([
	"live",
	"ended",
	"all"
]).default("all") }).default({ status: "all" }).parse(input ?? {})).handler(createSsrRpc("b7ff2d6536904b7bc0405dec136c51dd7e43e102ecca81614f1c7fd151b9fd99"));
var getLiveStream = createServerFn({ method: "GET" }).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("db37ca105358be39c3f6ef569fbd6d2474351d30a33fef88ce29aee3ab628c8e"));
var getLiveMessages = createServerFn({ method: "GET" }).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("8437c3efa6c0b4d431ea380e6f8c4bee1283f4cedf827a1fc1b7c970a2012b04"));
var startLiveStream = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	title: stringType().trim().min(1).max(140),
	description: stringType().max(2e3).default(""),
	category: stringType().trim().min(1).max(40).default("General"),
	playback_url: stringType().url().max(1e3).nullable().default(null),
	thumbnail_url: stringType().url().max(1e3).nullable().default(null)
}).parse(input)).handler(createSsrRpc("7fd725e674fb811a4141c0e6fc14177a7898a74e5b29b949c37694d33117cd20"));
var endLiveStream = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("49e498daff7857cb9108e4abf119ecc4259fc0ee9ca7c27a9a4089c34e46f90e"));
var sendLiveMessage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	id: stringType().uuid(),
	body: stringType().trim().min(1).max(500)
}).parse(input)).handler(createSsrRpc("fa6523af65725861a27d9025146db32a33f016bc35c9a123908e93cd28981f1d"));
//#endregion
export { sendLiveMessage as a, listLiveStreams as i, getLiveMessages as n, startLiveStream as o, getLiveStream as r, endLiveStream as t };
