export const INQUIRY_TYPES = [
  'Schedule a demo',
  'Rollout planning',
  'Support question',
  'Partnership or other',
] as const;

export const STUDENT_BANDS = [
  'Under 500 students',
  '500 to 2,000 students',
  '2,000 to 5,000 students',
  'Over 5,000 students',
] as const;

export const SCHOOL_ROLES = [
  'School leadership',
  'Operations or admin',
  'Finance',
  'IT',
  'Teacher',
  'Other',
] as const;

export const TIMELINES = [
  'Within a month or two',
  'As soon as possible',
  'Within 3 to 6 months',
  'Still planning',
] as const;

export const CONTACT_LIMITS = {
  name: 120,
  email: 254,
  school: 160,
  role: 80,
  message: 5000,
  payloadBytes: 20_000,
} as const;

export const CONTACT_TO = 'hello@abler.dev';
export const CONTACT_FROM = 'Eduvia Website <website@abler.dev>';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactPayload = {
  name: string;
  email: string;
  school: string;
  role: string;
  inquiry: string;
  students: string;
  timeline: string;
  message: string;
};

export class ContactError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function cleanField(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
}

function isAllowed<T extends readonly string[]>(value: string, allowed: T): boolean {
  return (allowed as readonly string[]).includes(value);
}

export function parseContactPayload(body: unknown): ContactPayload {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ContactError('Invalid request.');
  }

  const raw = body as Record<string, unknown>;

  if (cleanField(raw.website, 200)) {
    throw new ContactError('Invalid request.');
  }

  const started = Number(raw.started);
  if (!Number.isFinite(started)) {
    throw new ContactError('Invalid request.');
  }
  const elapsed = Date.now() - started;
  if (elapsed < 1500 || elapsed > 24 * 60 * 60 * 1000) {
    throw new ContactError('Please wait a moment and try again.');
  }

  const name = cleanField(raw.name, CONTACT_LIMITS.name);
  const email = cleanField(raw.email, CONTACT_LIMITS.email).toLowerCase();
  const school = cleanField(raw.school, CONTACT_LIMITS.school);
  const role = cleanField(raw.role, CONTACT_LIMITS.role);
  const inquiry = cleanField(raw.inquiry, 80);
  const students = cleanField(raw.students, 80);
  const timeline = cleanField(raw.timeline, 80);
  const message = cleanField(raw.message, CONTACT_LIMITS.message);

  if (!name || !email || !school || !role || !inquiry || !students || !timeline || !message) {
    throw new ContactError('Please complete the required fields.');
  }
  if (!EMAIL_PATTERN.test(email)) {
    throw new ContactError('Please enter a valid email address.');
  }
  if (
    !isAllowed(inquiry, INQUIRY_TYPES) ||
    !isAllowed(students, STUDENT_BANDS) ||
    !isAllowed(role, SCHOOL_ROLES) ||
    !isAllowed(timeline, TIMELINES)
  ) {
    throw new ContactError('Invalid request.');
  }

  return { name, email, school, role, inquiry, students, timeline, message };
}

export function formatContactEmail(payload: ContactPayload): { subject: string; text: string } {
  return {
    subject: `Eduvia inquiry — ${payload.school}`,
    text: [
      'New inquiry from the Eduvia website',
      '',
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `School: ${payload.school}`,
      `Role: ${payload.role}`,
      `Inquiry type: ${payload.inquiry}`,
      `Student count: ${payload.students}`,
      `Timeline: ${payload.timeline}`,
      '',
      'Message',
      payload.message,
      '',
      `Reply directly to ${payload.email}.`,
    ].join('\n'),
  };
}
