# GreatHire Teamora — WorkTrack

A full-stack workforce management platform: attendance tracking, leave management,
employee directory & profiles, reports/analytics, notifications, and team messaging —
with role-based access control (admin vs. employee) across both the API and the UI.

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
dataset (employees, attendance history, leave requests, notifications, and conversations)
on startup. See `backend/.env.example` if you want to point it at MongoDB instead.

**2. Frontend** (`http://localhost:5173`)

```bash
cd frontend
npm install
npm run dev
```

**3. Sign in**

Every seeded employee shares one demo password (see `backend/README.md` /
`SEED_USER_PASSWORD` in `backend/.env.example`):

```
password123
```

("Continue with Google/Microsoft" stays disabled until OAuth env vars are set — everything
else works without them.)

---

## What's in the app

**Admin views**
- Dashboard — live workforce snapshot, metrics, recent activity
- Employee Directory & Profiles — add/edit employees, stat cards, work summary, activity heatmap, documents
- Attendance Management — live attendance table, check-in/out, CSV export
- Leave Management — request queue with status filtering, approve/reject, approve-all, CSV export
- Reports & Analytics — attendance trends and working-hours charts across 7d/30d/12m
- Notifications Center — filterable feed, read/unread, preferences, CSV export
- Messages — channels + DMs, search within a conversation, emoji, attachments

**Employee self-service**
- Personal dashboard — status, quick actions (check in/out, break), hours stats
- Attendance calendar with month-to-month navigation
- Leave balances with an in-app "Apply for Leave" flow, upcoming holidays, quick links, announcements
- My Profile — personal info editing, documents, account settings

**Cross-cutting**
- Role-based access control end-to-end: the API enforces auth (`requireAuth`) and
  admin-only actions (`requireRole("admin")`) on sensitive routes (exports, approvals,
  employee edits), and the UI mirrors this with route guards
  (`ProtectedRoute`/`PublicOnlyRoute`) and conditional admin-only controls.
- Refresh-token session handling (rotated opaque tokens, see `backend/README.md`).
- One global light/dark theme (persists across reload, respects system preference,
  toggle from either topbar or Account Settings).
- Every button, card, row, and nav item routes somewhere real or is clearly and honestly
  disabled — no dead UI.
- CI (`.github/workflows/ci.yml`) lints/tests the backend and lints/builds the frontend
  on every push and PR.

---

## Tech stack

| | |
|---|---|
| **Frontend** | React 18, Vite, React Router (with lazy-loaded/code-split routes), Tailwind CSS + CSS variables, shadcn/ui-style primitives, lucide-react, recharts |
| **Backend** | Node.js, Express, JWT access + refresh tokens (jsonwebtoken + bcryptjs), Zod request validation, Mongoose (optional MongoDB), Passport (optional Google/Microsoft OAuth), Pino logging |
| **Data** | In-memory seeded store by default; swappable for MongoDB via `MONGODB_URI` |

---

## Project structure at a glance

```
backend/
  server.js                entrypoint — validates env, connects DB, seeds, boots the app
  src/
    app.js                 express app + middleware + route mounting
    config/                DB connection, env validation, logger, OAuth strategies (opt-in)
    db/                    Mongoose schemas, idempotent seeding, in-memory load-all
    data/                  in-memory store accessors used at request time
    models/                query/aggregation logic
    controllers/           request/response shaping per feature
    routes/                route tables (requireAuth / requireRole gating per route)
    middleware/             auth (attachUser/requireAuth/requireRole), validation, error handling
    validators/             Zod schemas per feature, used by the validate() middleware
    services/                cross-cutting business logic
    utils/                  dates, ids, password/jwt/refresh-token helpers, pagination

frontend/
  src/
    components/
      ui/                  shadcn/ui primitives (Button, Card, Input, Checkbox, ...)
      layout/              shared chrome (Sidebar, TopBar, EmployeeTopBar, NavItem, ...)
      routing/             ProtectedRoute, PublicOnlyRoute, PageLoading, PageError, ErrorBoundary
      sections/            login page composition
      dashboard/           admin dashboard composition
      employee/            employee self-service composition (incl. ApplyLeaveModal)
    lib/
      AuthContext.jsx      auth state + access/refresh token handling
      ThemeContext.jsx     global light/dark theme (persisted, system-aware)
      api/                 one client module per backend feature
    pages/                 one component per route
    App.jsx                route table (role-gated, lazy-loaded)
```

Full details, including a complete backend API reference (every route mapped to the
frontend component that calls it, and which routes require which role), live in the two
sub-READMEs linked above.

---

## Notes

- The backend's in-memory data resets on server restart — expected behavior for local
  dev/demo, not a bug. Point `MONGODB_URI` at a real database to persist it.
- Most feature routes require a valid access token (`requireAuth`); a handful of
  admin-only actions (CSV exports, approvals, employee record edits) additionally
  require the `admin` role (`requireRole("admin")`) and are hidden from non-admin users
  in the UI as well.
- A few UI actions (voice/video calling in Messages, document downloads on profiles) are
  intentionally disabled with an explanatory tooltip rather than faked, since there's no
  backend support for them yet.
