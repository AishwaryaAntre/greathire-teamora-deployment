import { Report } from "../models/Report.js";

export let reportController = {
  // GET /api/reports/stats?range=12m&department=
  getStats: (req, res) => {
    res.json({ success: true, data: Report.getStatsCards(req.query.range, req.query.department) });
  },

  // GET /api/reports/attendance-trends?range=12m&department=
  getAttendanceTrends: (req, res) => {
    res.json({ success: true, data: Report.getAttendanceTrends(req.query.range, req.query.department) });
  },

  // GET /api/reports/working-hours?range=12m&department=
  getWorkingHours: (req, res) => {
    res.json({ success: true, data: Report.getWorkingHoursTrend(req.query.range, req.query.department) });
  },

  // GET /api/reports/departments
  listDepartments: (req, res) => {
    res.json({ success: true, data: Report.listDepartments() });
  },

  // GET /api/reports/project-completion
  getProjectCompletionStats: (req, res) => {
    res.json({ success: true, data: Report.getProjectCompletionStats() });
  },

  // POST /api/reports/generate  { range, department, title }
  generate: async (req, res) => {
    let { range, department, title } = req.body;
    let report = await Report.generate({ range, department, title });
    res.status(201).json({ success: true, data: report });
  },

  // GET /api/reports  — previously generated reports
  listGenerated: (req, res) => {
    res.json({ success: true, data: Report.listGenerated() });
  },
};
