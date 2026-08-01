import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { u as getRequest } from "./createServerFn-BFFE07zL.mjs";
import { t as createMiddleware } from "./createMiddleware-B_4t7rW1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-middleware-0_baoq69.js
function getSupabasePublicEnv() {
	const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
	const publishableKey = process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
	if (!url || !publishableKey) {
		const missing = [...!url ? ["SUPABASE_URL or VITE_SUPABASE_URL"] : [], ...!publishableKey ? ["SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_PUBLISHABLE_KEY"] : []];
		throw new Error(`Missing Supabase environment variable(s): ${missing.join(", ")}`);
	}
	return {
		url,
		publishableKey
	};
}
function getSupabaseServiceEnv() {
	const { url } = getSupabasePublicEnv();
	const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
	if (!serviceRoleKey) throw new Error("Missing Supabase environment variable: SUPABASE_SERVICE_ROLE_KEY");
	return {
		url,
		serviceRoleKey
	};
}
function isNewSupabaseApiKey(value) {
	return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
		headers.set("apikey", supabaseKey);
		return fetch(input, {
			...init,
			headers
		});
	};
}
var requireSupabaseAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
	const { url: SUPABASE_URL, publishableKey: SUPABASE_PUBLISHABLE_KEY } = getSupabasePublicEnv();
	const request = getRequest();
	if (!request?.headers) throw new Error("Unauthorized: No request headers available");
	const authHeader = request.headers.get("authorization");
	if (!authHeader) throw new Error("Unauthorized: No authorization header provided");
	if (!authHeader.startsWith("Bearer ")) throw new Error("Unauthorized: Only Bearer tokens are supported");
	const token = authHeader.replace("Bearer ", "");
	if (!token) throw new Error("Unauthorized: No token provided");
	if (token.split(".").length !== 3) throw new Error("Unauthorized: Invalid token");
	const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
		global: {
			fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
			headers: { Authorization: `Bearer ${token}` }
		},
		auth: {
			storage: void 0,
			persistSession: false,
			autoRefreshToken: false
		}
	});
	const { data, error } = await supabase.auth.getClaims(token);
	if (error || !data?.claims) throw new Error("Unauthorized: Invalid token");
	if (!data.claims.sub) throw new Error("Unauthorized: No user ID found in token");
	return next({ context: {
		supabase,
		userId: data.claims.sub,
		claims: data.claims
	} });
});
//#endregion
export { getSupabaseServiceEnv as n, requireSupabaseAuth as r, getSupabasePublicEnv as t };
