# GreatHire Teamora — Backend API

Node.js + Express API built specifically to power the `greathire-teamora` frontend:
**Login/Auth**, **Dashboard**, **Employee Dashboard**, **Employee Profile**, **Attendance
Management**, **Leave Management**, **Reports & Analytics**, **Notifications**, and
**Messages**.

No database is required — data lives in memory (seeded with 13 employees, 60 days of
generated attendance history, demo notifications, and seed conversations) so you can
`npm install && npm run dev` and immediately get real numbers behind every stat card,
table, and chart. The data layer (`src/models/`) is isolated from the in-memory store
(`src/data/`), so swapping in Postgres/Mongo later only means rewriting the files in
`src/data/`.

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

### Signing in

Every seeded employee (see `src/data/employees.js`) has a matching login in
`src/data/usersStore.js`, all sharing one demo password:

```
email:    swaraj.kadam@greathire.com   (or any other seeded employee's email)
password: password123
```

Change `SEED_USER_PASSWORD` in `.env` to reseed with a different shared password.
"Continue with Google/Microsoft" stays disabled (returns `501`) until you set the
corresponding `GOOGLE_CLIENT_ID`/`MICROSOFT_CLIENT_ID` env vars — everything else works
without them.

## Project structure

```
server.js                        # entrypoint
src/
  app.js                         # express app, middleware, route mounting
  config/
    passport.js                  # Google/Microsoft OAuth strategies (opt-in via env vars)
  data/                          # in-memory "database" + seed generators
    employees.js
    usersStore.js                # auth users (linked 1:1 to employees) + reset tokens
    attendanceStore.js
    leaveStore.js
    reportsStore.js
    notificationsStore.js
    messagesStore.js             # channels, DMs, seed messages
    activityStore.js
    announcementsStore.js
    holidaysStore.js
  models/                        # query/aggregation logic over the data layer
    Employee.js
    EmployeeProfile.js
    EmployeeDashboard.js
    Attendance.js
    LeaveRequest.js
    Report.js
    Notification.js
    Message.js
    Dashboard.js
  controllers/                   # request/response shaping per page
    authController.js
    attendanceController.js
    leaveController.js
    reportController.js
    dashboardController.js
    employeeDashboardController.js
    employeeProfileController.js
    notificationController.js
    messageController.js
  routes/
    authRoutes.js
    attendanceRoutes.js
    leaveRoutes.js
    reportRoutes.js
    dashboardRoutes.js
    employeeDashboardRoutes.js
    employeeProfileRoutes.js
    notificationRoutes.js
    messageRoutes.js
  middleware/
    asyncHandler.js              # wraps async routes so errors reach errorHandler
    errorHandler.js              # ApiError class + centralized error responses
    auth.js                      # attachUser (optional), requireAuth, requireRole
  utils/
    dates.js
    id.js
    password.js                  # bcrypt hash/compare
    jwt.js                       # sign/verify access tokens
```

## Auth model

Existing feature routes (attendance, leave, reports, dashboards, notifications, messages)
are **not** locked behind auth — they keep working exactly as before, with or without a
token, matching this backend's "zero-friction local dev" philosophy. Sending a valid
`Authorization: Bearer <token>` header simply personalizes responses to the logged-in
employee (via `req.user`) instead of the seeded `CURRENT_EMPLOYEE_ID`.

Only `GET /api/auth/me` requires a token. If you later want to lock down write routes
(e.g. approve leave, delete an employee) behind roles, `requireAuth`/`requireRole` in
`src/middleware/auth.js` are ready to drop onto any route.

## API reference

All responses are JSON of the shape `{ success: boolean, data: ... }` (errors are
`{ success: false, error: "message" }`). Query params are optional unless noted.

### Auth — `LoginPage.jsx`

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/register` `{ name, email, password }` | Create a new account |
| POST | `/api/auth/login` `{ email, password, rememberMe? }` | Returns `{ user, token }` |
| POST | `/api/auth/logout` | Client-side no-op (stateless JWT) |
| GET | `/api/auth/me` *(requires token)* | Current user profile |
| POST | `/api/auth/forgot-password` `{ email }` | Logs a reset token to the server console (no email transport wired up) |
| POST | `/api/auth/reset-password` `{ token, password }` | Consumes the reset token |
| GET | `/api/auth/oauth/google` → `/callback` | Google sign-in (only active if `GOOGLE_CLIENT_ID`/`SECRET` are set) |
| GET | `/api/auth/oauth/microsoft` → `/callback` | Microsoft sign-in (only active if `MICROSOFT_CLIENT_ID`/`SECRET` are set) |

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

### Employee Dashboard — `EmployeeDashboardPage.jsx`

Self-service view for the logged-in employee. Defaults to `CURRENT_EMPLOYEE_ID`
("Swaraj Kadam", `emp_013`) unless called with a `/:id/...` path, or with an
`Authorization` header for a user linked to a different employee.

| Method | Route | Purpose | Maps to |
|---|---|---|---|
| GET | `/api/employee/dashboard` | All rows below, bundled into one response | initial page load |
| GET | `/api/employee/current-user` | Name / role / today's date / last login | `EmployeeTopBar`, `GreetingBanner` |
| GET | `/api/employee/status` | Working / On Break / Checked Out + session length | `CurrentStatusCard` |
| GET | `/api/employee/quick-actions` | Check In / Start Break / Resume / Check Out buttons | `QuickActionsGrid` (calls Attendance endpoints) |
| GET | `/api/employee/hours-stats` | Today / Weekly / Monthly hours + avg login | `StatsRow` |
| GET | `/api/employee/attendance-legend` | Present/Absent/Leave/Late legend | `AttendanceLegend` |
| GET | `/api/employee/attendance-month?year=&month=` | Monday-start calendar grid for one month | `AttendanceCalendar` |
| GET | `/api/employee/timeline` | Today's real check-in/break/check-out events | `TimelineCard` |
| GET | `/api/employee/leave-balances` | Casual/Paid/Sick days remaining | `LeaveBalanceCard` |
| GET | `/api/employee/upcoming-holidays?limit=` | Next N company holidays | `UpcomingHolidaysCard` |
| GET | `/api/employee/quick-links` | Nav shortcuts | `QuickLinksCard` |
| GET | `/api/employee/attendance-summary` | This month's attendance %, present/late/leave days | `AttendanceSummaryCard` |
| GET | `/api/employee/announcement` | Latest company announcement | `AnnouncementCard` |

Every route above also has an `/:id/...` variant (e.g. `/api/employee/emp_001/dashboard`) for viewing
another employee's dashboard.

### Employee Profile — `EmployeeProfilePage.jsx`, `MyProfilePage.jsx`

`/api/employees/profile*` defaults to the self-service employee; `/api/employees/:id/profile*`
looks up any employee by id.

| Method | Route | Purpose | Maps to |
|---|---|---|---|
| GET | `/api/employees/:id/profile/bundle` | All rows below, bundled into one response | initial page load |
| GET | `/api/employees/:id/profile` | Name / role / employee code / status / breadcrumb | `ProfileHeaderCard`, `PageActions` |
| GET | `/api/employees/:id/profile/stat-cards` | Attendance % / Monthly Hrs / Present Days / Leave Balance / Avg Login / Perf. Score | `StatCards` |
| GET | `/api/employees/:id/profile/work-summary` | Today / This Week / Avg Break / Current Session | `WorkSummaryCard` |
| GET | `/api/employees/:id/profile/activity-map` | 7×5 grid of daily work intensity (0-4) | `ActivityMapCard` |
| GET | `/api/employees/:id/profile/personal-info` | Employee ID / Department / Joining date / Contact | `PersonalInfoCard` |
| PUT | `/api/employees/:id/profile/personal-info` `{ name?, email?, phone?, avatar? }` | Edit personal info | `PersonalInfoCard` edit/pencil icon |
| GET | `/api/employees/:id/profile/documents` | On-file documents | `DocumentsCard` |

Drop `:id` (e.g. `/api/employees/profile/bundle`) to get the self-service employee's own profile.

### Attendance — `AttendanceManagement.jsx`

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
| GET | `/api/reports` | List previously generated reports | `ReportsTable` |

### Notifications — `NotificationsCenterPage.jsx`

Defaults to the self-service employee, same pattern as the Employee Dashboard/Profile routes.

| Method | Route | Purpose | Maps to |
|---|---|---|---|
| GET | `/api/notifications?filter=all\|unread\|attendance\|leave\|system&search=` | Filtered notification list | notification feed |
| GET | `/api/notifications/summary` | Unread / High Priority counts | summary chips |
| GET | `/api/notifications/preferences` | Current email/push/category toggles | Settings panel |
| PUT | `/api/notifications/preferences` `{ email?, push?, attendanceAlerts?, leaveAlerts?, systemAlerts? }` | Update toggles | Settings panel |
| POST | `/api/notifications` `{ title, description, category?, priority?, recipientEmployeeId? }` | Create a notification | server-triggered alerts |
| PATCH | `/api/notifications/:id/read` | Mark one as read | click on a notification |
| POST | `/api/notifications/mark-all-read` | Mark all as read | "Mark all as read" button |

### Messages — `MessagesPage.jsx`

Channels (team-wide) and direct-message threads, both scoped to the logged-in employee.

| Method | Route | Purpose | Maps to |
|---|---|---|---|
| GET | `/api/messages/conversations` | Sidebar list: channels + DMs, last message preview, unread count | `Sidebar` (channels + direct messages) |
| GET | `/api/messages/conversations/:id` | Header info, contact card, shared files/links | chat header + right rail |
| GET | `/api/messages/conversations/:id/messages` | Full message thread | chat body |
| POST | `/api/messages/conversations/:id/messages` `{ content, attachments? }` | Send a message | message composer |
| POST | `/api/messages/conversations/:id/read` | Mark a thread as read | opening a conversation |

## Example: wiring into `AttendanceManagement.jsx`

```jsx
const [stats, setStats] = useState([]);
const [live, setLive] = useState([]);

useEffect(() => {
  fetch("/api/attendance/stats").then((r) => r.json()).then((res) => setStats(res.data));
  fetch("/api/attendance/live").then((r) => r.json()).then((res) => setLive(res.data));
}, []);
```

## Example: wiring in login

```jsx
const res = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password, rememberMe }),
});
const { data } = await res.json();
localStorage.setItem("token", data.token);
// then on every subsequent request:
fetch("/api/employee/dashboard", {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});
```

If the Vite dev server proxies `/api` to `http://localhost:5000` (add this to
`vite.config.js`), no CORS setup is needed in dev:

```js
server: {
  proxy: { "/api": "http://localhost:5000" }
}
```


## mongodb
MONGODB_URI=mongodb://127.0.0.1:27017/greathire


## Notes

- Seed data is deterministic (seeded PRNG) so numbers stay consistent across restarts —
  useful for demoing without the UI feeling like it's showing random data every reload.
- `hoursWorked`, `late`, and `liveStatus` are derived once at seed time; `checkIn`/`checkOut`
  mutate that same in-memory record for the current server session only (resets on restart).
- Everything (users, notifications, messages, password reset tokens) lives in memory and
  resets on server restart — expected for a zero-DB local backend, same as attendance/leave.
- JWTs are stateless (no server-side session/blacklist), which keeps `logout` a client-side
  token-discard. Fine for local dev; swap in refresh-token rotation before shipping to prod.
