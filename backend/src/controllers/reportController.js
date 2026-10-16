import { Report } from "../models/Report.js";
import { createReportPdf } from "../utils/reportPdf.js";

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

  // GET /api/reports/export?range=12m&department=
  exportCsv: (req, res) => {
    let { range, department } = req.query;
    let stats = Report.getStatsCards(range, department);
    let attendanceRows = Report.getAttendanceRows(range, department);
    let trends = Report.getAttendanceTrends(range, department);
    let workingHours = Report.getWorkingHoursTrend(range, department);
    let projects = Report.getProjectCompletionStats();

    let rows = [
      ["GreatHire Attendance Analytics Report"],
      ["Generated At", new Date().toISOString()],
      ["Date Range", range],
      ["Department", department || "All Departments"],
      [],
      ["Summary", "Value", "Change"],
      ...stats.map((stat) => [stat.label, stat.value, stat.change]),
      [],
      ["Attendance Records", "Date", "Employee", "Department", "Status", "Check In", "Check Out", "Hours Worked"],
      ...attendanceRows.map((record) => [
        "Attendance",
        record.date,
        record.employee?.name,
        record.employee?.department,
        record.status,
        record.checkIn,
        record.checkOut,
        record.hoursWorked,
      ]),
      [],
      ["Attendance Trends", "Date", "Present", "Absent", "Late", "Leave"],
      ...trends.map((trend) => [
        "Trend",
        trend.date,
        trend.present,
        trend.absent,
        trend.late,
        trend.leave,
      ]),
      [],
      ["Working Hours", "Date", "Average Hours"],
      ...workingHours.series.map((item) => ["Daily Average", item.date, item.avgHours]),
      ["Overall Average", "", workingHours.overallAvg],
      [],
      ["Project Completion", "Total Projects", "Completed", "Not Completed"],
      ["Projects", projects.total, projects.completed, projects.notCompleted],
      ...projects.byStatus.map((item) => ["Project Status", item.status, item.value]),
    ];

    let csv = rows
      .map((row) =>
        row
          .map((value) => {
            let text = String(value ?? "");
            if (/^[\t\r ]*[=+\-@]/.test(text)) text = `'${text}`;
            return `"${text.replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\r\n");
    let filename = `greathire-report-${range}-${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(`\uFEFF${csv}`);
  },

  // GET /api/reports/export.pdf?range=12m&department=
  exportPdf: async (req, res) => {
    let { range, department } = req.query;
    let pdf = await createReportPdf({
      range,
      department,
      stats: Report.getStatsCards(range, department),
      attendanceRows: Report.getAttendanceRows(range, department),
      trends: Report.getAttendanceTrends(range, department),
      workingHours: Report.getWorkingHoursTrend(range, department),
      projects: Report.getProjectCompletionStats(),
    });
    let filename = `greathire-report-${range}-${new Date().toISOString().slice(0, 10)}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(pdf);
  },

  // GET /api/reports  — previously generated reports
  listGenerated: (req, res) => {
    res.json({ success: true, data: Report.listGenerated() });
  },
};
