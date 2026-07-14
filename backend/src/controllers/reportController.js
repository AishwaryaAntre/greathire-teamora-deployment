import { Report } from "../models/Report.js";

let VALID_RANGES = ["7d", "30d", "12m"];

function normalizeRange(range) {
  return VALID_RANGES.includes(range) ? range : "12m";
}

export let reportController = {
  // GET /api/reports/stats?range=12m&department=
  getStats: (req, res) => {
    let range = normalizeRange(req.query.range);
    res.json({ success: true, data: Report.getStatsCards(range, req.query.department) });
  },

  // GET /api/reports/attendance-trends?range=12m&department=
  getAttendanceTrends: (req, res) => {
    let range = normalizeRange(req.query.range);
    res.json({ success: true, data: Report.getAttendanceTrends(range, req.query.department) });
  },

  // GET /api/reports/working-hours?range=12m&department=
  getWorkingHours: (req, res) => {
    let range = normalizeRange(req.query.range);
    res.json({ success: true, data: Report.getWorkingHoursTrend(range, req.query.department) });
  },

  // GET /api/reports/departments
  listDepartments: (req, res) => {
    res.json({ success: true, data: Report.listDepartments() });
  },

  // POST /api/reports/generate  { range, department, title }
  generate: (req, res) => {
    let { range, department, title } = req.body;
    let report = Report.generate({ range: normalizeRange(range), department, title });
    res.status(201).json({ success: true, data: report });
  },

  // GET /api/reports  — previously generated reports
  listGenerated: (req, res) => {
    res.json({ success: true, data: Report.listGenerated() });
  },
};
