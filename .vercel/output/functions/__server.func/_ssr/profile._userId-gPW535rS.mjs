import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { S as Eye, b as Globe, h as MapPin, n as Users, x as Film } from "../_libs/lucide-react.mjs";
import { a as useSession, n as Button, r as Input, t as AppShell } from "./AppShell-CnphflQx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-XibAT3dJ.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BjMjp4PP.mjs";
import { a as stringType, i as objectType } from "../_libs/zod.mjs";
import { i as timeAgo, n as formatViews, r as initialsOf } from "./format-CMVa2bQM.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as VideoCard } from "./VideoCard-hJW8IbN8.mjs";
import { t as Textarea } from "./textarea-CCVvIhY4.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, t as Dialog } from "./dialog-_wfZk33-.mjs";
import { t as Route } from "./profile._userId-DAtuBsfg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile._userId-gPW535rS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getProfile = createServerFn({ method: "GET" }).validator((input) => objectType({ userId: stringType().uuid() }).parse(input)).handler(createSsrRpc("9df9652da79c7ccc337ce62c64dcd11f1800a8eb6e0bd13747650358f67fe4e8"));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	display_name: stringType().trim().min(1).max(60),
	bio: stringType().max(500).default(""),
	website: stringType().max(200).default(""),
	location: stringType().max(80).default(""),
	avatar_url: stringType().max(1e3).default(""),
	banner_url: stringType().max(1e3).default("")
}).parse(input)).handler(createSsrRpc("af00eb763dce352dc2f42ef901ef426a138feb40fdc7f79166552837a77fae5f"));
function ProfilePage() {
	const { userId } = Route.useParams();
	const { user } = useSession();
	const queryClient = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const profile = useQuery({
		queryKey: ["profile", userId],
		queryFn: () => getProfile({ data: { userId } })
	});
	if (profile.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-10 text-sm text-muted-foreground",
		children: "Loading profile…"
	}) });
	if (!profile.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Profile not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-5 rounded-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: "Back home"
			})
		})]
	}) });
	const { profile: p, videos, stats, live } = profile.data;
	const isMe = user?.id === p.id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "animate-fade panel relative mt-4 overflow-hidden rounded-3xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aurora h-36 w-full sm:h-44",
				children: p.banner_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: p.banner_url,
					alt: "",
					className: "h-full w-full object-cover",
					loading: "lazy"
				}) : null
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "-mt-16 shrink-0 sm:-mt-20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-border bg-primary text-2xl font-bold text-primary-foreground sm:h-28 sm:w-28",
							children: p.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.avatar_url,
								alt: `${p.display_name} avatar`,
								className: "h-full w-full object-cover",
								loading: "lazy"
							}) : initialsOf(p.display_name ?? "Creator")
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl font-bold sm:text-3xl",
									children: p.display_name
								}), live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/live/$streamId",
									params: { streamId: live.id },
									className: "inline-flex items-center gap-1.5 rounded-full bg-live px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-live-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot h-1.5 w-1.5 rounded-full bg-live-foreground" }), " Live now"]
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: [
									p.handle,
									" · joined ",
									timeAgo(p.created_at)
								]
							}),
							p.bio ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 max-w-2xl text-sm text-foreground/90",
								children: p.bio
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground",
								children: [p.location ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }),
										" ",
										p.location
									]
								}) : null, p.website ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: p.website,
									target: "_blank",
									rel: "noreferrer noopener",
									className: "inline-flex items-center gap-1.5 hover:text-primary",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3.5 w-3.5" }),
										" ",
										p.website.replace(/^https?:\/\//, "")
									]
								}) : null]
							})
						]
					}),
					isMe ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditProfileDialog, {
						open,
						onOpenChange: setOpen,
						initial: {
							display_name: p.display_name ?? "",
							bio: p.bio ?? "",
							website: p.website ?? "",
							location: p.location ?? "",
							avatar_url: p.avatar_url ?? "",
							banner_url: p.banner_url ?? ""
						},
						onSaved: () => {
							setOpen(false);
							queryClient.invalidateQueries({ queryKey: ["profile", userId] });
						}
					}) : null
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6 grid grid-cols-3 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: Film,
					label: "Videos",
					value: String(stats.videos)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: Eye,
					label: "Views",
					value: formatViews(stats.views).replace(" views", "")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: Users,
					label: "Subscribers",
					value: String(stats.subscribers)
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold",
				children: "Uploads"
			}), videos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "No public videos yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
				children: videos.map((video) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, { video }, video.id))
			})]
		})
	] });
}
function StatCard({ icon: Icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel rounded-2xl p-4 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mx-auto h-4 w-4 text-primary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xl font-bold",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
				children: label
			})
		]
	});
}
function EditProfileDialog({ open, onOpenChange, initial, onSaved }) {
	const [form, setForm] = (0, import_react.useState)(initial);
	const save = useMutation({
		mutationFn: () => updateMyProfile({ data: form }),
		onSuccess: () => {
			toast.success("Profile updated");
			onSaved();
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				className: "rounded-full sm:self-center",
				children: "Edit profile"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "rounded-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit profile" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (event) => {
					event.preventDefault();
					save.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.display_name,
						onChange: (event) => setForm({
							...form,
							display_name: event.target.value
						}),
						placeholder: "Display name",
						maxLength: 60,
						required: true,
						"aria-label": "Display name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: form.bio,
						onChange: (event) => setForm({
							...form,
							bio: event.target.value
						}),
						placeholder: "Short bio",
						maxLength: 500,
						"aria-label": "Bio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.location,
						onChange: (event) => setForm({
							...form,
							location: event.target.value
						}),
						placeholder: "Location",
						maxLength: 80,
						"aria-label": "Location"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.website,
						onChange: (event) => setForm({
							...form,
							website: event.target.value
						}),
						placeholder: "https://your-site.com",
						maxLength: 200,
						"aria-label": "Website"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.avatar_url,
						onChange: (event) => setForm({
							...form,
							avatar_url: event.target.value
						}),
						placeholder: "Avatar image URL",
						maxLength: 1e3,
						"aria-label": "Avatar URL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.banner_url,
						onChange: (event) => setForm({
							...form,
							banner_url: event.target.value
						}),
						placeholder: "Banner image URL",
						maxLength: 1e3,
						"aria-label": "Banner URL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full rounded-full",
						disabled: save.isPending,
						children: save.isPending ? "Saving…" : "Save changes"
					})
				]
			})]
		})]
	});
}
//#endregion
export { ProfilePage as component };
