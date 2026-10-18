export const prerender = false;

import { Resend } from 'resend';
import {
  CONTACT_FROM,
  CONTACT_LIMITS,
  CONTACT_TO,
  ContactError,
  formatContactEmail,
  parseContactPayload,
} from '../../lib/contact';

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const attempts = new Map<string, number[]>();

const json = (status: number, body: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(ip: string): boolean {
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

function allowedOrigins(): Set<string> {
  const site = (import.meta.env.SITE_URL || process.env.SITE_URL || 'https://www.eduvia.app').replace(
    /\/$/,
    '',
  );
  const extra = (import.meta.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((v: string) => v.trim())
    .filter(Boolean);
  return new Set([
    site,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:4321',
    'http://127.0.0.1:4321',
    ...extra,
  ]);
}

function originAllowed(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  return allowedOrigins().has(origin);
}

export const POST = async ({ request }: { request: Request }) => {
  try {
    if (!originAllowed(request)) {
      return json(403, {
        error: 'Could not send right now. Please email hello@abler.dev directly.',
      });
    }

    const length = Number(request.headers.get('content-length') || 0);
    if (length > CONTACT_LIMITS.payloadBytes) {
      return json(413, { error: 'That message is too large to send.' });
    }

    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      throw new ContactError('Invalid request.');
    }

    const payload = parseContactPayload(raw);
    const ip = clientIp(request);
    if (isRateLimited(ip)) {
      return json(429, { error: 'Please wait a few minutes before sending another message.' });
    }

    const apiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('Contact delivery is not configured.');
      return json(503, {
        error: 'Could not send right now. Please email hello@abler.dev directly.',
        code: 'CONTACT_NOT_CONFIGURED',
      });
    }

    const { subject, text } = formatContactEmail(payload);
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: import.meta.env.CONTACT_FROM || process.env.CONTACT_FROM || CONTACT_FROM,
      to: import.meta.env.CONTACT_TO || process.env.CONTACT_TO || CONTACT_TO,
      replyTo: payload.email,
      subject,
      text,
    });

    if (error) {
      console.error('Contact delivery failed.', { message: error.message });
      return json(502, {
        error: 'Could not send right now. Please email hello@abler.dev directly.',
        code: 'DELIVERY_FAILED',
      });
    }

    return json(200, { ok: 'sent' });
  } catch (error) {
    if (error instanceof ContactError) {
      return json(error.status, { error: error.message });
    }
    console.error('Contact endpoint error.');
    return json(500, { error: 'Could not send right now. Please email hello@abler.dev directly.' });
  }
};
