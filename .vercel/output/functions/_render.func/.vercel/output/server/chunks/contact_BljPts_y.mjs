import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { Resend } from "resend";
//#region src/lib/contact.ts
var INQUIRY_TYPES = [
	"Schedule a demo",
	"Rollout planning",
	"Support question",
	"Partnership or other"
];
var STUDENT_BANDS = [
	"Under 500 students",
	"500 to 2,000 students",
	"2,000 to 5,000 students",
	"Over 5,000 students"
];
var SCHOOL_ROLES = [
	"School leadership",
	"Operations or admin",
	"Finance",
	"IT",
	"Teacher",
	"Other"
];
var TIMELINES = [
	"Within a month or two",
	"As soon as possible",
	"Within 3 to 6 months",
	"Still planning"
];
var CONTACT_LIMITS = {
	name: 120,
	email: 254,
	school: 160,
	role: 80,
	message: 5e3,
	payloadBytes: 2e4
};
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var ContactError = class extends Error {
	status;
	constructor(message, status = 400) {
		super(message);
		this.status = status;
	}
};
function cleanField(value, max) {
	if (typeof value !== "string") return "";
	return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}
function isAllowed(value, allowed) {
	return allowed.includes(value);
}
function parseContactPayload(body) {
	if (!body || typeof body !== "object" || Array.isArray(body)) throw new ContactError("Invalid request.");
	const raw = body;
	if (cleanField(raw.website, 200)) throw new ContactError("Invalid request.");
	const started = Number(raw.started);
	if (!Number.isFinite(started)) throw new ContactError("Invalid request.");
	const elapsed = Date.now() - started;
	if (elapsed < 1500 || elapsed > 864e5) throw new ContactError("Please wait a moment and try again.");
	const name = cleanField(raw.name, CONTACT_LIMITS.name);
	const email = cleanField(raw.email, CONTACT_LIMITS.email).toLowerCase();
	const school = cleanField(raw.school, CONTACT_LIMITS.school);
	const role = cleanField(raw.role, CONTACT_LIMITS.role);
	const inquiry = cleanField(raw.inquiry, 80);
	const students = cleanField(raw.students, 80);
	const timeline = cleanField(raw.timeline, 80);
	const message = cleanField(raw.message, CONTACT_LIMITS.message);
	if (!name || !email || !school || !role || !inquiry || !students || !timeline || !message) throw new ContactError("Please complete the required fields.");
	if (!EMAIL_PATTERN.test(email)) throw new ContactError("Please enter a valid email address.");
	if (!isAllowed(inquiry, INQUIRY_TYPES) || !isAllowed(students, STUDENT_BANDS) || !isAllowed(role, SCHOOL_ROLES) || !isAllowed(timeline, TIMELINES)) throw new ContactError("Invalid request.");
	return {
		name,
		email,
		school,
		role,
		inquiry,
		students,
		timeline,
		message
	};
}
function formatContactEmail(payload) {
	return {
		subject: `Eduvia inquiry — ${payload.school}`,
		text: [
			"New inquiry from the Eduvia website",
			"",
			`Name: ${payload.name}`,
			`Email: ${payload.email}`,
			`School: ${payload.school}`,
			`Role: ${payload.role}`,
			`Inquiry type: ${payload.inquiry}`,
			`Student count: ${payload.students}`,
			`Timeline: ${payload.timeline}`,
			"",
			"Message",
			payload.message,
			"",
			`Reply directly to ${payload.email}.`
		].join("\n")
	};
}
//#endregion
//#region src/pages/api/contact.ts
var contact_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var WINDOW_MS = 36e5;
var MAX_PER_WINDOW = 5;
var attempts = /* @__PURE__ */ new Map();
var json = (status, body) => new Response(JSON.stringify(body), {
	status,
	headers: {
		"Content-Type": "application/json",
		"Cache-Control": "no-store"
	}
});
function clientIp(request) {
	return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}
function isRateLimited(ip) {
	const now = Date.now();
	const recent = (attempts.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
	if (recent.length >= MAX_PER_WINDOW) {
		attempts.set(ip, recent);
		return true;
	}
	recent.push(now);
	attempts.set(ip, recent);
	return false;
}
function allowedOrigins() {
	const site = (process.env.SITE_URL || "https://www.eduvia.app").replace(/\/$/, "");
	const extra = (process.env.ALLOWED_ORIGINS || "").split(",").map((v) => v.trim()).filter(Boolean);
	return /* @__PURE__ */ new Set([
		site,
		"http://localhost:3000",
		"http://127.0.0.1:3000",
		"http://localhost:4321",
		"http://127.0.0.1:4321",
		...extra
	]);
}
function originAllowed(request) {
	const origin = request.headers.get("origin");
	if (!origin) return true;
	return allowedOrigins().has(origin);
}
var POST = async ({ request }) => {
	try {
		if (!originAllowed(request)) return json(403, { error: "Could not send right now. Please email hello@abler.dev directly." });
		if (Number(request.headers.get("content-length") || 0) > CONTACT_LIMITS.payloadBytes) return json(413, { error: "That message is too large to send." });
		let raw;
		try {
			raw = await request.json();
		} catch {
			throw new ContactError("Invalid request.");
		}
		const payload = parseContactPayload(raw);
		if (isRateLimited(clientIp(request))) return json(429, { error: "Please wait a few minutes before sending another message." });
		const apiKey = process.env.RESEND_API_KEY;
		if (!apiKey) {
			console.error("Contact delivery is not configured.");
			return json(503, {
				error: "Could not send right now. Please email hello@abler.dev directly.",
				code: "CONTACT_NOT_CONFIGURED"
			});
		}
		const { subject, text } = formatContactEmail(payload);
		const { error } = await new Resend(apiKey).emails.send({
			from: process.env.CONTACT_FROM || "Eduvia Website <website@abler.dev>",
			to: process.env.CONTACT_TO || "hello@abler.dev",
			replyTo: payload.email,
			subject,
			text
		});
		if (error) {
			console.error("Contact delivery failed.", { message: error.message });
			return json(502, {
				error: "Could not send right now. Please email hello@abler.dev directly.",
				code: "DELIVERY_FAILED"
			});
		}
		return json(200, { ok: "sent" });
	} catch (error) {
		if (error instanceof ContactError) return json(error.status, { error: error.message });
		console.error("Contact endpoint error.");
		return json(500, { error: "Could not send right now. Please email hello@abler.dev directly." });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/contact@_@ts
var page = () => contact_exports;
//#endregion
export { page };
