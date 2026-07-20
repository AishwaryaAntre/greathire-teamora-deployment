# GreatHire Teamora — Backend API

Node.js + Express API built specifically to power three pages of the `greathire-teamora`
frontend: **Attendance Management**, **Leave Management**, and **Reports & Analytics**.

No database is required — data lives in memory (seeded with 12 employees and 60 days of
generated attendance history) so you can `npm install && npm run dev` and immediately get
real numbers behind every stat card, table, and chart. The data layer (`src/models/`) is
isolated from the in-memory store (`src/data/`), so swapping in Postgres/Mongo later only
means rewriting the files in `src/data/`.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev        # auto-restarts on file changes (Node's built-in --watch)
# or: npm start
```

Server runs at `http://localhost:5000` by default. Set `CLIENT_ORIGIN` in `.env` to your
Vite dev server URL (e.g. `http://localhost:5173`) to restrict CORS in production; it
defaults to `*` for local development.

## Project structure

```
server.js                        # entrypoint
src/
  app.js                         # express app, middleware, route mounting
  data/                          # in-memory "database" + seed generators
    employees.js
    attendanceStore.js
    leaveStore.js
    reportsStore.js
  models/                        # query/aggregation logic over the data layer
    Employee.js
    Attendance.js
    LeaveRequest.js
    Report.js
  controllers/                   # request/response shaping per page
    attendanceController.js
    leaveController.js
    reportController.js
  routes/
    attendanceRoutes.js
    leaveRoutes.js
    reportRoutes.js
  middleware/
    asyncHandler.js              # wraps async routes so errors reach errorHandler
    errorHandler.js              # ApiError class + centralized error responses
  utils/
    dates.js
    id.js
```

## API reference

All responses are JSON of the shape `{ success: boolean, data: ... }` (errors are
`{ success: false, error: "message" }`). Query params are optional unless noted.

### Dashboard — `DashboardPage.jsx`

| Method | Route | Purpose | Maps to |
|---|---|---|---|
| GET | `/api/dashboard/overview` | Greeting + Total Employees / Live Online / Attendance % | `DashboardOverviewCard` |
| GET | `/api/dashboard/snapshot` | Total / Working / Break / Leave, each with a percent bar | `WorkforceSnapshot` |
| GET | `/api/dashboard/metrics` | Total Employees / Currently Working / On Break / Avg Working Hrs (+ trend) | `MetricRow` |
| GET | `/api/dashboard/live-workforce?limit=` | Employees currently working, on break, or on leave today | `LiveWorkforceTable` |
| GET | `/api/dashboard/activity?limit=` | Recent check-in/check-out/break events, newest first | `RecentActivity` |
| GET | `/api/dashboard` | All 5 shapes above bundled into one response | initial page load |

Check-in, check-out, and break corrections made via the Attendance endpoints automatically
append to the activity feed backing `/api/dashboard/activity`.

 Attendance — `AttendanceManagement.jsx`

| Method | Route | Purpose | Maps to |
|---|---|---|---|
| GET | `/api/attendance/stats?date=` | Total Expected / Present / Late / Currently Working | `StatsCards` |
| GET | `/api/attendance/live?date=&department=&status=&search=` | Employees currently clocked in | `LiveAttendanceTable` |
| GET | `/api/attendance/summary?date=` | On Time / Late counts | `ActivityPanel` ("Today's Summary") |
| GET | `/api/attendance/departments` | Department list | "All Departments" filter |
| GET | `/api/attendance?date=&department=&status=&search=&page=&pageSize=` | Full paginated record list | future full table view |
| GET | `/api/attendance/export?date=&department=&status=` | CSV download | "Export" / "CSV" buttons |
| POST | `/api/attendance/check-in` `{ employeeId }` | Clock an employee in | "Check In" button (TopBar) |
| POST | `/api/attendance/check-out` `{ employeeId }` | Clock an employee out | — |
| PATCH | `/api/attendance/:id` `{ status?, liveStatus? }` | Admin correction | row "⋮" action |

### Leave — `LeaveManagement.jsx`

| Method | Route | Purpose | Maps to |
|---|---|---|---|
| GET | `/api/leave/stats` | Pending / Approved Today / On Leave Today | `StatsCards` |
| GET | `/api/leave/team-availability` | Working / On Leave / Sick Leave counts | `ActivityPanel` |
| GET | `/api/leave/types` | Leave type options | request form dropdown |
| GET | `/api/leave/requests?status=&period=This%20Month\|Last%20Month&search=` | Filtered request list | `LeaveRequestsTable` (also powers the "This Month/Last Month" tabs) |
| GET | `/api/leave/requests/:id` | Single request | detail drawer |
| POST | `/api/leave/requests` `{ employeeId, leaveType, startDate, endDate, reason }` | Submit new request | new-request form |
| POST | `/api/leave/requests/approve-all` | Approve every pending request | "Approve All Pending" quick action |
| PATCH | `/api/leave/requests/:id/approve` | Approve one | row "⋮" action |
| PATCH | `/api/leave/requests/:id/reject` | Reject one | row "⋮" action |
| GET | `/api/leave/export?status=&period=` | CSV download | "Export" button |

### Reports — `Report.jsx`

`range` accepts `7d`, `30d`, or `12m` (matches the "7 Days / 30 Days / 12 Months" tabs).

| Method | Route | Purpose | Maps to |
|---|---|---|---|
| GET | `/api/reports/stats?range=&department=` | Total Employees / Avg Attendance, each vs. previous period | `StatsCards` |
| GET | `/api/reports/attendance-trends?range=&department=` | Daily present/absent/late series | "Attendance Trends" line chart |
| GET | `/api/reports/working-hours?range=&department=` | Daily avg-hours series + overall average | "Avg Working Hours" area chart |
| GET | `/api/reports/departments` | Department list | "All Departments" filter |
| POST | `/api/reports/generate` `{ range, department, title }` | Create a report snapshot | "Generate" button |
| GET | `/api/reports` | List previously generated reports | `ReportsTable` (currently a stub in the frontend) |

## Example: wiring into `AttendanceManagement.jsx`

```jsx
const [stats, setStats] = useState([]);
const [live, setLive] = useState([]);

useEffect(() => {
  fetch("/api/attendance/stats").then((r) => r.json()).then((res) => setStats(res.data));
  fetch("/api/attendance/live").then((r) => r.json()).then((res) => setLive(res.data));
}, []);
```

If the Vite dev server proxies `/api` to `http://localhost:5000` (add this to
`vite.config.js`), no CORS setup is needed in dev:

```js
server: {
  proxy: { "/api": "http://localhost:5000" }
}
```

## Notes

- Seed data is deterministic (seeded PRNG) so numbers stay consistent across restarts —
  useful for demoing without the UI feeling like it's showing random data every reload.
- `hoursWorked`, `late`, and `liveStatus` are derived once at seed time; `checkIn`/`checkOut`
  mutate that same in-memory record for the current server session only (resets on restart).
