import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CCZKrZq_.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as Send, n as Users, u as Radio } from "../_libs/lucide-react.mjs";
import { a as useSession, n as Button, r as Input, t as AppShell } from "./AppShell-CnphflQx.mjs";
import { i as timeAgo, r as initialsOf } from "./format-CMVa2bQM.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Route } from "./live._streamId-Ds4cH4tC.mjs";
import { a as sendLiveMessage, n as getLiveMessages, r as getLiveStream, t as endLiveStream } from "./live.functions-D7ss4d2_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live._streamId-DmH1hnen.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LiveChat({ streamId }) {
	const [body, setBody] = (0, import_react.useState)("");
	const { user } = useSession();
	const queryClient = useQueryClient();
	const bottomRef = (0, import_react.useRef)(null);
	const messages = useQuery({
		queryKey: ["live-messages", streamId],
		queryFn: () => getLiveMessages({ data: { id: streamId } })
	});
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel(`live-messages-${streamId}`).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "live_messages",
			filter: `stream_id=eq.${streamId}`
		}, () => {
			queryClient.invalidateQueries({ queryKey: ["live-messages", streamId] });
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [streamId, queryClient]);
	(0, import_react.useEffect)(() => {
		bottomRef.current?.scrollIntoView({ block: "end" });
	}, [messages.data?.length]);
	const send = useMutation({
		mutationFn: () => sendLiveMessage({ data: {
			id: streamId,
			body
		} }),
		onSuccess: () => {
			setBody("");
			queryClient.invalidateQueries({ queryKey: ["live-messages", streamId] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "panel flex h-[480px] flex-col rounded-2xl xl:h-[calc(100vh-11rem)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border/60 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Live chat"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Messages appear instantly for everyone watching."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-3 overflow-y-auto px-4 py-4",
				children: [messages.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Loading chat…"
				}) : (messages.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Be the first to say something."
				}) : (messages.data ?? []).map((message) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold",
						children: initialsOf(message.author_name)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "min-w-0 text-sm leading-snug",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-1.5 font-semibold text-brand",
							children: message.author_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground/90 break-words",
							children: message.body
						})]
					})]
				}, message.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottomRef })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
				className: "flex items-center gap-2 border-t border-border/60 p-3",
				onSubmit: (event) => {
					event.preventDefault();
					if (body.trim()) send.mutate();
				},
				children: user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: body,
					onChange: (event) => setBody(event.target.value),
					placeholder: "Send a message…",
					maxLength: 500,
					"aria-label": "Live chat message",
					className: "h-10 rounded-full bg-surface/70"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "icon",
					className: "h-10 w-10 shrink-0 rounded-full",
					disabled: send.isPending || !body.trim(),
					"aria-label": "Send message",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					className: "w-full rounded-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						children: "Sign in to chat"
					})
				})
			})
		]
	});
}
function LiveStreamPage() {
	const { streamId } = Route.useParams();
	const { user } = useSession();
	const queryClient = useQueryClient();
	const stream = useQuery({
		queryKey: ["live-stream", streamId],
		queryFn: () => getLiveStream({ data: { id: streamId } })
	});
	const end = useMutation({
		mutationFn: () => endLiveStream({ data: { id: streamId } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["live-stream", streamId] });
			queryClient.invalidateQueries({ queryKey: ["live-streams"] });
		}
	});
	if (stream.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-10 text-sm text-muted-foreground",
		children: "Loading stream…"
	}) });
	if (!stream.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Stream not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-5 rounded-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/live",
				children: "Back to live"
			})
		})]
	}) });
	const data = stream.data;
	const isLive = data.status === "live";
	const isHost = user?.id === data.owner_id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "panel overflow-hidden rounded-2xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative aspect-video bg-black",
						children: [data.playback_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							src: data.playback_url,
							controls: true,
							autoPlay: true,
							playsInline: true,
							className: "h-full w-full object-contain"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-9 w-9" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: isLive ? "Waiting for the host's video feed…" : "This stream has ended."
							})]
						}), isLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-live px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-live-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot h-1.5 w-1.5 rounded-full bg-live-foreground" }), " Live"]
						}) : null]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold",
							children: data.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/profile/$userId",
									params: { userId: data.owner_id },
									className: "font-semibold text-foreground hover:text-primary",
									children: data.host_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5" }),
										" ",
										data.viewer_count,
										" watching"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: data.category }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["started ", timeAgo(data.started_at)] })
							]
						})]
					}), isHost && isLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						className: "rounded-full",
						onClick: () => end.mutate(),
						disabled: end.isPending,
						children: "End stream"
					}) : null]
				}),
				data.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "panel mt-5 rounded-2xl p-5 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap",
					children: data.description
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveChat, { streamId })]
	}) });
}
//#endregion
export { LiveStreamPage as component };
