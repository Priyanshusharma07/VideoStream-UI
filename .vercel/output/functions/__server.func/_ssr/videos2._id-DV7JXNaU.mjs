import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-CnphflQx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/videos2._id-DV7JXNaU.js
var import_jsx_runtime = require_jsx_runtime();
var SplitNotFoundComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
	className: "text-sm text-muted-foreground",
	children: [
		"This video doesn't exist.",
		" ",
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "text-primary underline",
			children: "Back to the feed"
		})
	]
}) });
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
