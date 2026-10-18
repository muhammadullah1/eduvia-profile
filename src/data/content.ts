/** Grounded in Eduvia-Frontend `navigation.ts` and Eduvia-Api `permissions.js`. */

export const portalRoles = [
  {
    id: 'super_admin',
    title: 'Super Admin',
    summary:
      'Full school control: fee totals, finance, settings, and every academic module. The dashboard is a live view of people, learning, fees, and operations.',
    highlights: [
      'Dashboard, finance, and school-wide fee management',
      'Configure pass criteria, result fee rules, and academic settings',
      'Reports with printable insight and audit history',
    ],
  },
  {
    id: 'operations_manager',
    title: 'Operations Manager',
    summary:
      'Runs day-to-day academics and people without seeing school-wide fee totals. Focused on cover, curriculum flow, tests, results, and admissions.',
    highlights: [
      'Sessions, classes, subjects, timetable, and substitutes',
      'Admissions, students, enrollment, promotion, and lifecycle',
      'Lesson plans, daily test schedule, examinations, and communication review',
    ],
  },
  {
    id: 'accountant',
    title: 'Accountant',
    summary:
      'A focused desk for recording payments and printing daily receipts. Payments clear the oldest unpaid month first, matching school collection practice.',
    highlights: [
      'Record fee payments and confirm collections',
      'View monthly fee status without school-wide totals (unless granted)',
      'My daily receipts for accountability at the counter',
    ],
  },
  {
    id: 'teacher',
    title: 'Teacher',
    summary:
      'Class delivery in one place: today’s timetable (including substitute duties), attendance, daily chapter updates, weekly tests, notices, and marks entry.',
    highlights: [
      'Mark attendance for assigned classes',
      'Submit daily updates from the planned lesson chapters',
      'Enter draft marks and submit locked examination sheets',
    ],
  },
  {
    id: 'parent',
    title: 'Parent',
    summary:
      'A clear view of each child: attendance, published results and DMC, weekly tests, fees and receipts, timetable, and approved school updates.',
    highlights: [
      'Fees and receipts without calling the office',
      'Published results and report cards when the school allows',
      'Timetable and approved lesson updates and notices',
    ],
  },
] as const;

export const moduleGroups = [
  {
    title: 'Academic foundation',
    description: 'Structure the school year before day-to-day work begins.',
    modules: [
      {
        name: 'Sessions',
        detail:
          'Manage academic sessions with one marked current at a time so registers, fees, and reports stay aligned.',
      },
      {
        name: 'Classes',
        detail:
          'Class sections for the active session with students, subjects, and status in one place.',
      },
      {
        name: 'Subjects',
        detail: 'Subject catalog for the current session, linked to classes and teacher assignments.',
      },
      {
        name: 'Timetable',
        detail:
          'Periods, rooms, and conflict-aware scheduling. Parents see their child’s weekly timetable in the family portal.',
      },
    ],
  },
  {
    title: 'People and admissions',
    description: 'From application to enrolled student with guardians attached.',
    modules: [
      {
        name: 'Admissions',
        detail:
          'Applications, document capture, and enrollment steps that feed the student register.',
      },
      {
        name: 'Students',
        detail: 'Enrolled students and class registers for the current session.',
      },
      {
        name: 'Staff',
        detail:
          'Portal users, teachers, and office staff. Teachers carry one active subject assignment at a time.',
      },
      {
        name: 'Enrollment and promotion',
        detail: 'Enrollment workflows and class promotion between sessions.',
      },
      {
        name: 'Lifecycle',
        detail:
          'Student lifecycle stages and rules for when results become visible to families.',
      },
    ],
  },
  {
    title: 'Teaching and cover',
    description: 'What happens in classrooms every week.',
    modules: [
      {
        name: 'Substitutes',
        detail:
          'Mark teacher absences by period and assign cover from available staff.',
      },
      {
        name: 'Lesson plan',
        detail:
          'Planned chapters that teachers select when submitting daily updates for review.',
      },
      {
        name: 'Daily test schedule',
        detail:
          'Weekly test calendar per subject, marks, publishing, and monthly outcomes.',
      },
      {
        name: 'Attendance',
        detail: 'School-wide attendance insight for leaders; teachers mark assigned classes.',
      },
    ],
  },
  {
    title: 'Assessment and results',
    description: 'Controlled marks, verification, and family visibility.',
    modules: [
      {
        name: 'Examinations',
        detail:
          'Examination cycles with draft marks, verification, and publishing when ready.',
      },
      {
        name: 'Results and DMC',
        detail:
          'Parents see published examinations and downloadable report cards. Fee rules at view time can be enforced with audited overrides.',
      },
    ],
  },
  {
    title: 'Fees and finance',
    description: 'Collections at the desk and leadership view of the school position.',
    modules: [
      {
        name: 'Fee management',
        detail:
          'Monthly fee status, receipts, and offline synchronisation when collections happen away from the network.',
      },
      {
        name: 'Collect fee',
        detail:
          'Record payments at the counter; allocations follow school rules (oldest unpaid month first).',
      },
      {
        name: 'Finance',
        detail: 'Income, expenses, and operating position for super administrators.',
      },
    ],
  },
  {
    title: 'Communication and trust',
    description: 'What families are allowed to see is deliberate, not accidental.',
    modules: [
      {
        name: 'Communication',
        detail:
          'Review and approve notices and updates before they reach parents.',
      },
      {
        name: 'Reports and audit',
        detail:
          'Operational reports for leadership plus traceable audit history where the API enforces access.',
      },
      {
        name: 'Settings',
        detail:
          'Academic and fee settings, including configurable pass criteria and result visibility rules.',
      },
    ],
  },
] as const;

export const homePillars = [
  {
    title: 'Role-based portals',
    body:
      'Super Admin, Operations, Accountant, Teacher, and Parent each sign in to a purpose-built workspace. Permissions follow the API capability matrix, not just hidden menu items.',
    href: '/roles',
    cta: 'See each role',
  },
  {
    title: 'Academic operations in sync',
    body:
      'Sessions, timetable, substitutes, lesson plans, and daily tests connect so cover, teaching, and publishing stay coherent across the week.',
    href: '/platform#teaching',
    cta: 'Explore the platform',
  },
  {
    title: 'Fees with clear rules',
    body:
      'Accountants record payments at the desk while leaders configure fee months, visibility, and finance summaries appropriate to their role.',
    href: '/features#fees',
    cta: 'Fee and finance modules',
  },
] as const;

export const trustPoints = [
  {
    title: 'API-enforced permissions',
    body:
      'Sensitive actions such as fee totals, finance management, and result overrides are gated on the server. The portal reflects the same rules.',
  },
  {
    title: 'Review before parents see it',
    body:
      'Daily lesson updates, class notices, and communication items can be reviewed so families only see approved content.',
  },
  {
    title: 'Built with schools in Pakistan',
    body:
      'Eduvia is developed by Abler Software Solutions for real schools moving from registers and spreadsheets to one system.',
  },
] as const;

export const faqs = [
  {
    q: 'What is Eduvia?',
    a: 'Eduvia is Abler’s school management platform. It gives each role a dedicated portal for academics, attendance, assessments, fees, and family communication while the API enforces who can do what.',
  },
  {
    q: 'Which roles does Eduvia support?',
    a: 'Super Admin, Operations Manager, Accountant, Teacher, and Parent. Each role sees a different navigation set aligned to their responsibilities, from finance totals for super admins to fees and results for parents.',
  },
  {
    q: 'How do admissions and enrollment work?',
    a: 'Admissions handles applications and documents. When a student is enrolled, they appear in the student register with guardians linked for parent portal access.',
  },
  {
    q: 'How are fees collected?',
    a: 'Super admins and accountants generate monthly fee status and record payments. Accountants focus on recording payments and printing their own daily receipts. Payment allocation follows your school’s rules, including clearing older unpaid months first.',
  },
  {
    q: 'Can parents see results before fees are cleared?',
    a: 'Schools can configure result and fee rules in settings. Lifecycle and results workflows support controlled publishing and audited overrides when leadership allows exceptions.',
  },
  {
    q: 'How do teachers use Eduvia day to day?',
    a: 'Teachers open Today for their timetable, mark attendance, pick chapters for daily updates, enter weekly test or exam marks, and draft class notices for approval.',
  },
  {
    q: 'How do we request a demo or rollout?',
    a: 'Use the contact page to reach Abler through the same inquiry flow as our main profile site. Share your school size and which modules you want to prioritise.',
  },
] as const;
