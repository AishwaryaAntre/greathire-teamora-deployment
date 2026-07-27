# GreatHire WorkTrack

Pixel-match implementation of two "Teamora" screens, built with React + Vite, Tailwind CSS, and shadcn/ui conventions:

- **`/`** — Sign in to Teamora (login screen)
- **`/dashboard`** — Admin Dashboard (workforce overview)

Submitting the sign-in form navigates from `/` to `/dashboard`.

## Stack

- React 18 + Vite
- React Router (`react-router-dom`) for the two pages
- Tailwind CSS (with CSS variables, matching shadcn/ui's theming approach)
- Hand-rolled shadcn/ui primitives (`Button`, `Input`, `Label`, `Checkbox`, `Badge`, `Card`) built with `class-variance-authority` + `tailwind-merge`, following the exact shadcn file/API conventions so they're swappable with `npx shadcn add` output later
- `lucide-react` for icons

## Getting started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Folder structure

```
src/
  components/
    ui/            # shadcn/ui primitives (Button, Input, Label, Checkbox, Badge, Card)
    layout/         # Page chrome shared across pages (TopBar, SiteFooter, Sidebar,
                     # DashboardTopBar, NavItem, IconButton)
    sections/       # Login page composition (HeroPanel, LoginPanel, LoginForm, ...)
    dashboard/      # Dashboard page composition (DashboardOverviewCard,
                     # WorkforceSnapshot, MetricRow, LiveWorkforceTable,
                     # RecentActivity, StatusBadge, Avatar, ...)
  pages/
    LoginPage.jsx    # "/" — sign-in screen
    DashboardPage.jsx  # "/dashboard" — admin dashboard
  data/
    dashboardData.js  # Nav items, employees, activity feed, snapshot stats
  lib/
    utils.js        # cn() classname helper
  App.jsx           # React Router route table
  index.css         # Tailwind layers + shadcn CSS variables
  main.jsx          # React entry point
```

## Notes

- Layout is a two-column CSS grid on `lg` breakpoints and up; the marketing hero panel collapses on smaller screens so the sign-in card remains the focus on mobile/tablet, matching how this kind of split-screen auth layout is expected to respond.
- Colors, spacing, radii and type sizes are all driven by Tailwind config tokens (`brand.*` palette, `--radius`, `shadow-panel`) rather than inline styles or one-off magic numbers, so the theme can be retargeted from a single place.
- Google/Microsoft buttons use inline brand-mark SVGs (`BrandIcons.jsx`) rather than external logo assets, so the project has no image dependencies.
