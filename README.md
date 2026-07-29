# GreatHire Teamora — WorkTrack

A full-stack workforce management platform: attendance tracking, leave management,
employee directory & profiles, reports/analytics, notifications, and team messaging —
with an admin view and a self-service employee view.

```
greathire-teamora/
├── frontend/   React 18 + Vite + Tailwind CSS (shadcn/ui conventions)
└── backend/    Node.js + Express API (in-memory data by default, MongoDB-ready)
```

Each app has its own detailed README — [`frontend/README.md`](./frontend/README.md) and
[`backend/README.md`](./backend/README.md) — with full folder structures and API
references. This top-level README is the fastest way to get both running together and
see what's in the app.

---

## Quick start

You need two terminals — one for the API, one for the UI.

**1. Backend** (`http://localhost:5000`)

```bash
cd backend
npm install
npm run dev
```

No database setup is required to try the app: the backend seeds a realistic in-memory
dataset (13 employees, 60 days of attendance history, leave requests, notifications, and
conversations) on startup. See `backend/.env.example` if you want to point it at MongoDB
instead.

**2. Frontend** (`http://localhost:5173`)

```bash
cd frontend
npm install
npm run dev
```

**3. Sign in**

Every seeded employee has a matching login, all sharing one demo password:

```

```

("Continue with Google/Microsoft" stays disabled until OAuth env vars are set — everything
else works without them.)

---

## What's in the app

**Admin views**
- Dashboard — live workforce snapshot, metrics, recent activity
- Employee Directory & Profiles — stat cards, work summary, activity heatmap, documents
- Attendance Management — live attendance table, check-in/out, CSV export
- Leave Management — request queue with status filtering, approve/reject, approve-all, CSV export
- Reports & Analytics — attendance trends and working-hours charts across 7d/30d/12m
- Notifications Center — filterable feed, read/unread, preferences, CSV export
- Messages — channels + DMs, search within a conversation, formatting, attachments

**Employee self-service**
- Personal dashboard — status, quick actions (check in/out, break), hours stats
- Attendance calendar with month-to-month navigation
- Leave balances, upcoming holidays, quick links, announcements
- My Profile — personal info editing, documents, account settings

**Cross-cutting**
- One global light/dark theme (persists across reload, respects system preference,
  toggle from either topbar or Account Settings)
- Every button, card, row, and nav item routes somewhere real or is clearly and honestly
  disabled — no dead UI

---

## Tech stack

| | |
|---|---|
| **Frontend** | React 18, Vite, React Router, Tailwind CSS + CSS variables, shadcn/ui-style primitives, lucide-react, recharts |
| **Backend** | Node.js, Express, JWT auth (jsonwebtoken + bcryptjs), Mongoose (optional MongoDB), Passport (optional Google/Microsoft OAuth) |
| **Data** | In-memory seeded store by default; swappable for MongoDB via `MONGODB_URI` |

---

## Project structure at a glance

```
backend/
  server.js                entrypoint
  src/
    app.js                 express app + middleware + route mounting
    config/                OAuth strategies (opt-in)
    data/                  in-memory "database" + seed generators
    models/                query/aggregation logic
    controllers/            request/response shaping per feature
    routes/                 route tables
    middleware/             auth, error handling
    utils/                  dates, ids, password/jwt helpers

frontend/
  src/
    components/
      ui/                  shadcn/ui primitives (Button, Card, Input, ...)
      layout/              shared chrome (Sidebar, TopBar, EmployeeTopBar, NavItem, ...)
      sections/            login page composition
      dashboard/           admin dashboard composition
      employee/            employee self-service composition
    lib/
      AuthContext.jsx      auth state + token handling
      ThemeContext.jsx     global light/dark theme (persisted, system-aware)
      api/                 one client module per backend feature
    pages/                 one component per route
    App.jsx                route table
```

Full details, including a complete backend API reference (every route mapped to the
frontend component that calls it), live in the two sub-READMEs linked above.

---

## Notes

- The backend's in-memory data resets on server restart — expected behavior for local
  dev/demo, not a bug. Point `MONGODB_URI` at a real database to persist it.
- Feature routes (attendance, leave, reports, dashboards, notifications, messages) work
  with or without a login token; a valid token just personalizes responses to that
  employee instead of the seeded default user.
- A few UI actions (voice/video calling in Messages, document downloads on profiles,
  admin-editing another employee's record) are intentionally disabled with an explanatory
  tooltip rather than faked, since there's no backend support for them yet.
