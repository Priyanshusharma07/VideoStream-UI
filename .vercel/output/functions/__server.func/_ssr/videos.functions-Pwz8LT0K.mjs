import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-0_baoq69.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BBhlQc5O.mjs";
import { a as stringType, i as objectType, n as enumType, r as numberType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/videos.functions-Pwz8LT0K.js
var getFeed = createServerFn({ method: "GET" }).handler(createSsrRpc("7318d1ebef3ce782f7baeb90ba6182b0fbf9e7250cdc93f143cc1ef704e24fa5"));
var searchVideos = createServerFn({ method: "GET" }).validator((input) => objectType({
	q: stringType().max(120).default(""),
	tag: stringType().max(60).nullable().default(null)
}).parse(input)).handler(createSsrRpc("9732118caeb24c4a8ccddf8a23bf04fd53bef7afac5daeafceeb848b4a181a5e"));
var getVideo = createServerFn({ method: "GET" }).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("86ee313542ae1c5e995371f17bedebdc2795fc08cc6ec53a8735fea34e67cb4c"));
var getComments = createServerFn({ method: "GET" }).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("d0c723d1e55efde7de9774baeb16bce9d1d459a67eb5318ec526537b85bafcfb"));
var getLikeCount = createServerFn({ method: "GET" }).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("805b79b7b241fbe9b3d44e72587335bca505f0570d425f7d387b7800adc4599f"));
var registerView = createServerFn({ method: "POST" }).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("62f6b528352f4cfbfa459f8b60c841a83eb6158139a9681ab381a2cf7fdb7e41"));
var getMyVideos = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("4f00ada363127aaca7635554b52d0684dc489e6ca6f8909cba82a673bd00efd2"));
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
}).parse(input)).handler(createSsrRpc("ef36ed1464bdf94c95727b9952cc2015433451f20b7167c9fd4847557c36d9a2"));
var deleteVideo = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("3fcd159205240d6926126acac1e16e0b826c923dfac07b14dd13822331355611"));
var toggleLike = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("db8f94db4ba02a4874dddd7d30c5b501756ca392d67bf2321761a7a630d96441"));
var getMyLike = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("842c9cfb1f32148d9e797da27bf7be26697a20ff42b9744bdc5a8cdb62afe458"));
var addComment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	id: stringType().uuid(),
	body: stringType().min(1).max(2e3)
}).parse(input)).handler(createSsrRpc("adb847b22bfa2b0decb5282939fef5f11794adcce32b3c09f64fdeb0e4a17329"));
//#endregion
export { getFeed as a, getMyVideos as c, searchVideos as d, toggleLike as f, getComments as i, getVideo as l, createVideo as n, getLikeCount as o, deleteVideo as r, getMyLike as s, addComment as t, registerView as u };
