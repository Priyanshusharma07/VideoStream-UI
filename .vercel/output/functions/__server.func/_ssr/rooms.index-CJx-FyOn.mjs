import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as DoorOpen, d as Plus, n as Users, w as Copy } from "../_libs/lucide-react.mjs";
import { n as Button, r as Input, t as AppShell } from "./AppShell-CacCG9dI.mjs";
import { t as Label } from "./label-BBS1D7O_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as timeAgo } from "./format-CMVa2bQM.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { i as joinRoom, o as listMyRooms, t as createRoom } from "./rooms.functions-BBD_9XKm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rooms.index-CJx-FyOn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RoomsPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [name, setName] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [joinPassword, setJoinPassword] = (0, import_react.useState)("");
	const rooms = useQuery({
		queryKey: ["my-rooms"],
		queryFn: () => listMyRooms()
	});
	const create = useMutation({
		mutationFn: () => createRoom({ data: {
			name: name.trim(),
			password: newPassword
		} }),
		onSuccess: (room) => {
			toast.success(`Room created — ID ${room.code}`);
			queryClient.invalidateQueries({ queryKey: ["my-rooms"] });
			navigate({
				to: "/rooms/$roomId",
				params: { roomId: room.id }
			});
		},
		onError: () => toast.error("Could not create the room.")
	});
	const join = useMutation({
		mutationFn: () => joinRoom({ data: {
			code: code.trim().toUpperCase(),
			password: joinPassword
		} }),
		onSuccess: (result) => {
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			queryClient.invalidateQueries({ queryKey: ["my-rooms"] });
			navigate({
				to: "/rooms/$roomId",
				params: { roomId: result.id }
			});
		},
		onError: () => toast.error("Could not join the room.")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "animate-rise mt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5" }), " Watch together"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-4 text-3xl font-extrabold sm:text-4xl",
					children: ["Private ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-gradient",
						children: "Rooms"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted-foreground",
					children: "Spin up a room, share the ID and password, then chat and present your screen together in real time."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-5 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "panel rounded-3xl p-6",
				onSubmit: (e) => {
					e.preventDefault();
					if (!name.trim() || newPassword.length < 4) return;
					create.mutate();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-2 text-lg font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 text-primary-glow" }), " Create a room"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "room-name",
								children: "Room name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "room-name",
								value: name,
								maxLength: 60,
								onChange: (e) => setName(e.target.value),
								placeholder: "Friday movie night",
								className: "rounded-xl bg-surface/70"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "room-password",
								children: "Room password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "room-password",
								type: "password",
								value: newPassword,
								maxLength: 72,
								onChange: (e) => setNewPassword(e.target.value),
								placeholder: "At least 4 characters",
								className: "rounded-xl bg-surface/70"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: create.isPending || !name.trim() || newPassword.length < 4,
							className: "gradient-brand w-full rounded-full font-semibold text-primary-foreground",
							children: create.isPending ? "Creating…" : "Create room"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "panel rounded-3xl p-6",
				onSubmit: (e) => {
					e.preventDefault();
					if (!code.trim() || !joinPassword) return;
					join.mutate();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-2 text-lg font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoorOpen, { className: "h-4 w-4 text-brand" }), " Join a room"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "join-code",
								children: "Room ID"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "join-code",
								value: code,
								maxLength: 12,
								onChange: (e) => setCode(e.target.value.toUpperCase()),
								placeholder: "e.g. K7QT2M",
								className: "rounded-xl bg-surface/70 font-mono tracking-[0.3em]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "join-password",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "join-password",
								type: "password",
								value: joinPassword,
								maxLength: 72,
								onChange: (e) => setJoinPassword(e.target.value),
								className: "rounded-xl bg-surface/70"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "secondary",
							disabled: join.isPending || !code.trim() || !joinPassword,
							className: "w-full rounded-full font-semibold",
							children: join.isPending ? "Joining…" : "Join room"
						})
					]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold",
				children: "Your rooms"
			}), rooms.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "Loading rooms…"
			}) : (rooms.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "You haven't joined any room yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
				children: (rooms.data ?? []).map((room) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel animate-rise rounded-2xl p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "truncate text-base font-bold",
								children: room.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold",
								children: [room.member_count, " members"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								navigator.clipboard?.writeText(room.code);
								toast.success("Room ID copied");
							},
							className: "mt-3 inline-flex items-center gap-2 rounded-lg bg-surface/70 px-3 py-1.5 font-mono text-sm tracking-[0.2em] text-brand",
							children: [
								room.code,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: ["Created ", timeAgo(room.created_at)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							className: "mt-4 w-full rounded-full font-semibold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/rooms/$roomId",
								params: { roomId: room.id },
								children: "Enter room"
							})
						})
					]
				}, room.id))
			})]
		})
	] });
}
//#endregion
export { RoomsPage as component };
