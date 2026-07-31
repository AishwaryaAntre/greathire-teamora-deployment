# Merge notes: `greathire-teamora-merged` → `greathire-teamora-rbac_session5`

This branch was reconciled against a sibling snapshot (`greathire-teamora-merged`) that
had evolved independently and included its own `newchanges.txt` claiming a set of new
features (dark mode, navigation fixes, several page-level features). Rather than copy
that file or its changes wholesale, each claim was verified against this branch's actual
code before anything was ported. Summary of what that review found:

## Already present here (no action needed)

This branch had independently implemented — and in most cases exceeded — nearly
everything `merged`'s changelog described:

- **Dark mode** — `ThemeContext.jsx`, the `.dark` CSS palette, the pre-hydration script
  in `index.html`, and `dark:` variants across components were already fully wired here
  (514 `dark:` class usages vs. 8 in `merged`, where `ThemeProvider` was never actually
  mounted in `main.jsx`).
- **Login forgot-password flow**, **attendance calendar month navigation**, **leave
  status filter + CSV export**, **Messages search/emoji/attachments**, **Notifications
  preferences panel + CSV export**, and **My Profile account actions** were all already
  implemented here, generally with additional admin-only gating that `merged` lacked.
- **Add/Edit Employee modals** — already implemented inline in `EmployeesListPage.jsx`
  and `EmployeeProfilePage.jsx` respectively, wired to this branch's dedicated
  `updatePersonalInfoFor(id)` endpoint.

## Actually ported from `merged`

Two genuine gaps were found and added:

- **`components/routing/PublicOnlyRoute.jsx`** — redirects an already-authenticated user
  away from the login route (`/`) to their dashboard. Wired into `App.jsx`.
- **`components/employee/ApplyLeaveModal.jsx`** — gives employees a way to actually
  submit a leave request (previously the "Apply" action on the dashboard's leave-balance
  card just navigated to `/leave` with no submission UI there either). Wired into both
  `EmployeeDashboardPage.jsx` and `LeaveManagement.jsx` (as a quick action for
  non-admin users).

## Deliberately not ported

- **`backend/scripts/seed.js`** — targets a MongoDB-specific schema layout
  (`src/schemas/employeeSchema.js` / `userSchema.js`) that doesn't match this branch's
  schema structure (`src/db/schemas.js`). This branch's `src/db/seed.js` already covers
  idempotent seeding for the full data set (employees, attendance, leave, notifications,
  messages, announcements, holidays), not just employees/users.
- **`lib/iconMap.js`** — `merged` centralizes icon lookups in one allow-listed module;
  this branch resolves icons inline per-component (`import * as icons from
  "lucide-react"`, `icons[name] ?? icons.Circle`). Functionally equivalent, different
  pattern — not worth a cross-cutting refactor for parity alone.
