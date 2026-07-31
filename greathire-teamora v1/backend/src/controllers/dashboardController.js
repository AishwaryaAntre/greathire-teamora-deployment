import { Dashboard } from "../models/Dashboard.js";

export let dashboardController = {
  // GET /api/dashboard/overview
  // -> DashboardOverviewCard (greeting + OVERVIEW_STATS)
  getOverview: (req, res) => {
    res.json({ success: true, data: Dashboard.getOverview() });
  },

  // GET /api/dashboard/snapshot
  // -> WorkforceSnapshot (SNAPSHOT_STATS)
  getSnapshot: (req, res) => {
    res.json({ success: true, data: Dashboard.getSnapshot() });
  },

  // GET /api/dashboard/metrics
  // -> MetricRow (4 stat cards + avg-hours trend)
  getMetrics: (req, res) => {
    res.json({ success: true, data: Dashboard.getMetrics() });
  },

  // GET /api/dashboard/live-workforce?limit=
  // -> LiveWorkforceTable (LIVE_WORKFORCE)
  getLiveWorkforce: (req, res) => {
    res.json({ success: true, data: Dashboard.getLiveWorkforce(req.query.limit) });
  },

  // GET /api/dashboard/activity?limit=
  // -> RecentActivity (RECENT_ACTIVITY)
  getRecentActivity: (req, res) => {
    res.json({ success: true, data: Dashboard.getRecentActivity(req.query.limit) });
  },

  // GET /api/dashboard
  // -> convenience bundle: all 5 shapes in one call, for the initial page load
  getAll: (req, res) => {
    res.json({
      success: true,
      data: {
        overview: Dashboard.getOverview(),
        snapshot: Dashboard.getSnapshot(),
        metrics: Dashboard.getMetrics(),
        liveWorkforce: Dashboard.getLiveWorkforce(10),
        recentActivity: Dashboard.getRecentActivity(10),
      },
    });
  },
};
