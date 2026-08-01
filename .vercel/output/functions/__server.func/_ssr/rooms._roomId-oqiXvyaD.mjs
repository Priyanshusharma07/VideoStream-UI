import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C_Ev7sJO.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as Send, g as LogOut, j as ArrowLeft, m as MonitorUp, n as Users, p as MonitorX, w as Copy } from "../_libs/lucide-react.mjs";
import { i as cn, n as Button, r as Input, t as AppShell } from "./AppShell-CacCG9dI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Route } from "./rooms._roomId-HBpX7r6r.mjs";
import { a as leaveRoom, n as getRoom, r as getRoomMessages, s as sendRoomMessage } from "./rooms.functions-BBD_9XKm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rooms._roomId-oqiXvyaD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RoomChat({ roomId, meId }) {
	const [body, setBody] = (0, import_react.useState)("");
	const queryClient = useQueryClient();
	const bottomRef = (0, import_react.useRef)(null);
	const messages = useQuery({
		queryKey: ["room-messages", roomId],
		queryFn: () => getRoomMessages({ data: { id: roomId } })
	});
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel(`room-messages-${roomId}`).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "room_messages",
			filter: `room_id=eq.${roomId}`
		}, () => {
			queryClient.invalidateQueries({ queryKey: ["room-messages", roomId] });
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [roomId, queryClient]);
	(0, import_react.useEffect)(() => {
		bottomRef.current?.scrollIntoView({ block: "end" });
	}, [messages.data?.length]);
	const send = useMutation({
		mutationFn: () => sendRoomMessage({ data: {
			id: roomId,
			body
		} }),
		onSuccess: () => {
			setBody("");
			queryClient.invalidateQueries({ queryKey: ["room-messages", roomId] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel flex h-[520px] flex-col rounded-2xl xl:h-[calc(100vh-11rem)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border/60 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-bold",
					children: "Live chat"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Messages sync instantly with everyone in the room."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-3 overflow-y-auto px-4 py-4",
				children: [messages.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Loading messages…"
				}) : (messages.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "No messages yet — say hello."
				}) : (messages.data ?? []).map((m) => {
					const mine = m.user_id === meId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex flex-col gap-1", mine && "items-end"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-1 text-[10px] uppercase tracking-wide text-muted-foreground",
							children: mine ? "You" : m.author_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("max-w-[85%] rounded-2xl px-3 py-2 text-sm", mine ? "gradient-brand rounded-br-sm text-primary-foreground" : "rounded-bl-sm bg-secondary text-secondary-foreground"),
							children: m.body
						})]
					}, m.id);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottomRef })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex items-center gap-2 border-t border-border/60 p-3",
				onSubmit: (e) => {
					e.preventDefault();
					if (!body.trim() || send.isPending) return;
					send.mutate();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: body,
					onChange: (e) => setBody(e.target.value),
					maxLength: 1e3,
					placeholder: "Send a message",
					"aria-label": "Chat message",
					className: "rounded-full border-border/70 bg-surface/70"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "icon",
					disabled: !body.trim() || send.isPending,
					className: "gradient-brand shrink-0 rounded-full text-primary-foreground",
					"aria-label": "Send message",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
				})]
			})
		]
	});
}
var ICE = { iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:global.stun.twilio.com:3478"] }] };
function RoomStage({ roomId, meId, meName }) {
	const videoRef = (0, import_react.useRef)(null);
	const channelRef = (0, import_react.useRef)(null);
	const peersRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const streamRef = (0, import_react.useRef)(null);
	const [sharing, setSharing] = (0, import_react.useState)(false);
	const [presenter, setPresenter] = (0, import_react.useState)(null);
	const [presenterName, setPresenterName] = (0, import_react.useState)("");
	const [participants, setParticipants] = (0, import_react.useState)(1);
	const [error, setError] = (0, import_react.useState)(null);
	const post = (0, import_react.useCallback)((payload) => {
		channelRef.current?.send({
			type: "broadcast",
			event: "signal",
			payload
		});
	}, []);
	const closePeer = (0, import_react.useCallback)((id) => {
		peersRef.current.get(id)?.close();
		peersRef.current.delete(id);
	}, []);
	const stopSharing = (0, import_react.useCallback)(() => {
		streamRef.current?.getTracks().forEach((t) => t.stop());
		streamRef.current = null;
		peersRef.current.forEach((pc) => pc.close());
		peersRef.current.clear();
		setSharing(false);
		setPresenter(null);
		if (videoRef.current) videoRef.current.srcObject = null;
		post({
			kind: "stopped",
			from: meId
		});
	}, [meId, post]);
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel(`room-stage-${roomId}`, { config: {
			presence: { key: meId },
			broadcast: { self: false }
		} });
		channelRef.current = channel;
		channel.on("presence", { event: "sync" }, () => {
			setParticipants(Object.keys(channel.presenceState()).length || 1);
		});
		channel.on("broadcast", { event: "signal" }, async ({ payload }) => {
			const msg = payload;
			if (msg.from === meId) return;
			if (msg.kind === "presenting") {
				setPresenter(msg.from);
				setPresenterName(msg.name);
				if (!streamRef.current) post({
					kind: "request",
					from: meId
				});
				return;
			}
			if (msg.kind === "stopped") {
				setPresenter(null);
				closePeer(msg.from);
				if (videoRef.current) videoRef.current.srcObject = null;
				return;
			}
			if (msg.kind === "request" && streamRef.current) {
				const pc = new RTCPeerConnection(ICE);
				peersRef.current.set(msg.from, pc);
				streamRef.current.getTracks().forEach((track) => pc.addTrack(track, streamRef.current));
				pc.onicecandidate = (e) => {
					if (e.candidate) post({
						kind: "ice",
						from: meId,
						to: msg.from,
						candidate: e.candidate.toJSON()
					});
				};
				const offer = await pc.createOffer();
				await pc.setLocalDescription(offer);
				post({
					kind: "offer",
					from: meId,
					to: msg.from,
					sdp: offer
				});
				return;
			}
			if (msg.kind === "offer" && msg.to === meId) {
				const pc = new RTCPeerConnection(ICE);
				peersRef.current.set(msg.from, pc);
				pc.ontrack = (e) => {
					if (videoRef.current) videoRef.current.srcObject = e.streams[0] ?? null;
				};
				pc.onicecandidate = (e) => {
					if (e.candidate) post({
						kind: "ice",
						from: meId,
						to: msg.from,
						candidate: e.candidate.toJSON()
					});
				};
				await pc.setRemoteDescription(msg.sdp);
				const answer = await pc.createAnswer();
				await pc.setLocalDescription(answer);
				post({
					kind: "answer",
					from: meId,
					to: msg.from,
					sdp: answer
				});
				return;
			}
			if (msg.kind === "answer" && msg.to === meId) {
				await peersRef.current.get(msg.from)?.setRemoteDescription(msg.sdp);
				return;
			}
			if (msg.kind === "ice" && msg.to === meId) try {
				await peersRef.current.get(msg.from)?.addIceCandidate(msg.candidate);
			} catch {}
		});
		channel.subscribe(async (status) => {
			if (status === "SUBSCRIBED") {
				await channel.track({
					id: meId,
					name: meName
				});
				post({
					kind: "request",
					from: meId
				});
			}
		});
		return () => {
			streamRef.current?.getTracks().forEach((t) => t.stop());
			peersRef.current.forEach((pc) => pc.close());
			peersRef.current.clear();
			supabase.removeChannel(channel);
			channelRef.current = null;
		};
	}, [
		roomId,
		meId,
		meName,
		post,
		closePeer
	]);
	async function startSharing() {
		setError(null);
		try {
			const stream = await navigator.mediaDevices.getDisplayMedia({
				video: true,
				audio: true
			});
			streamRef.current = stream;
			setSharing(true);
			setPresenter(meId);
			setPresenterName(meName);
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				videoRef.current.muted = true;
			}
			stream.getVideoTracks()[0]?.addEventListener("ended", stopSharing);
			post({
				kind: "presenting",
				from: meId,
				name: meName
			});
		} catch {
			setError("Screen sharing was blocked or cancelled.");
		}
	}
	const live = Boolean(presenter);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel overflow-hidden rounded-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-video w-full bg-background",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					autoPlay: true,
					playsInline: true,
					className: "h-full w-full object-contain"
				}),
				!live && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 flex flex-col items-center justify-center gap-3 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "gradient-brand flex h-14 w-14 items-center justify-center rounded-2xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorUp, { className: "h-6 w-6 text-primary-foreground" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: "Nobody is presenting"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-sm px-6 text-xs text-muted-foreground",
							children: "Share your screen to stream a video, a match or anything else to everyone in this room."
						})
					]
				}),
				live && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-[11px] font-semibold backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-live h-2 w-2 rounded-full bg-destructive" }), sharing ? "You are presenting" : `${presenterName || "A member"} is presenting`]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }),
					" ",
					participants,
					" in room"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-destructive",
					children: error
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: sharing ? stopSharing : startSharing,
					size: "sm",
					className: cn("rounded-full font-semibold", sharing ? "bg-destructive text-destructive-foreground" : "gradient-brand text-primary-foreground"),
					children: sharing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorX, { className: "mr-2 h-4 w-4" }), " Stop sharing"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorUp, { className: "mr-2 h-4 w-4" }), " Share screen"] })
				})]
			})]
		})]
	});
}
function RoomPage() {
	const { roomId } = Route.useParams();
	const navigate = useNavigate();
	const room = useQuery({
		queryKey: ["room", roomId],
		queryFn: () => getRoom({ data: { id: roomId } })
	});
	const leave = useMutation({
		mutationFn: () => leaveRoom({ data: { id: roomId } }),
		onSuccess: () => navigate({ to: "/rooms" })
	});
	if (room.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-10 text-sm text-muted-foreground",
		children: "Opening room…"
	}) });
	if (!room.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold",
				children: "Room not available"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "You are not a member of this room, or it no longer exists."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-5 rounded-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/rooms",
					children: "Back to rooms"
				})
			})
		]
	}) });
	const { room: data, me } = room.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/rooms",
				"aria-label": "Back to rooms",
				className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "truncate text-xl font-extrabold sm:text-2xl",
					children: data.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						navigator.clipboard?.writeText(data.code);
						toast.success("Room ID copied");
					},
					className: "mt-1 inline-flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-brand",
					children: [
						data.code,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "secondary",
			size: "sm",
			className: "rounded-full",
			onClick: () => leave.mutate(),
			disabled: leave.isPending,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-4 w-4" }), " Leave"]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomStage, {
			roomId,
			meId: me.id,
			meName: me.name
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomChat, {
			roomId,
			meId: me.id
		})]
	})] });
}
//#endregion
export { RoomPage as component };
