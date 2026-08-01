//#region node_modules/.nitro/vite/services/ssr/assets/format-CMVa2bQM.js
function formatViews(count) {
	if (count >= 1e6) return `${(count / 1e6).toFixed(count >= 1e7 ? 0 : 1)}M views`;
	if (count >= 1e3) return `${(count / 1e3).toFixed(count >= 1e4 ? 0 : 1)}K views`;
	if (count === 1) return "1 view";
	return `${count} views`;
}
function formatDuration(seconds) {
	if (!seconds || seconds < 0) return "0:00";
	const h = Math.floor(seconds / 3600);
	const m = Math.floor(seconds % 3600 / 60);
	const s = Math.floor(seconds % 60);
	if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
	return `${m}:${String(s).padStart(2, "0")}`;
}
function timeAgo(iso) {
	const diff = Date.now() - new Date(iso).getTime();
	const mins = Math.floor(diff / 6e4);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
	const days = Math.floor(hours / 24);
	if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
	const months = Math.floor(days / 30);
	if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
	const years = Math.floor(months / 12);
	return `${years} year${years === 1 ? "" : "s"} ago`;
}
function initialsOf(name) {
	return name.split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("");
}
//#endregion
export { timeAgo as i, formatViews as n, initialsOf as r, formatDuration as t };
