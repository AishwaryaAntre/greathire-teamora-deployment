import PDFDocument from "pdfkit";

function printable(value) {
  return String(value ?? "—").replace(/[^\x20-\x7E]/g, "?");
}

const CHART_COLORS = {
  present: "#2563eb",
  late: "#f59e0b",
  absent: "#ef4444",
  hours: "#2563eb",
  hoursFill: "#bfdbfe",
};
const PROJECT_STATUS_COLORS = {
  Active: "#2563eb",
  Working: "#f59e0b",
  Completed: "#10b981",
  "On Hold": "#94a3b8",
  Cancelled: "#ef4444",
};

function shortDate(value) {
  let date = new Date(value);
  return Number.isNaN(date.getTime())
    ? printable(value)
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function drawLegend(doc, entries, x, y) {
  let cursorX = x;
  doc.font("Helvetica").fontSize(7.5);
  for (let entry of entries) {
    doc.fillColor(entry.color).circle(cursorX + 3, y + 4, 3).fill();
    doc.fillColor("#475569").text(entry.label, cursorX + 10, y, { lineBreak: false });
    cursorX += 18 + doc.widthOfString(entry.label);
  }
}

function drawAxes(doc, { x, y, width, height, maxValue, formatValue = String }) {
  let left = x + 34;
  let right = x + width - 8;
  let top = y + 54;
  let bottom = y + height - 28;
  doc.font("Helvetica").fontSize(7).fillColor("#64748b").lineWidth(0.5);

  for (let step = 0; step <= 4; step += 1) {
    let value = (maxValue * step) / 4;
    let lineY = bottom - ((bottom - top) * step) / 4;
    doc.strokeColor("#f1f5f9").moveTo(left, lineY).lineTo(right, lineY).stroke();
    doc.text(formatValue(value), x, lineY - 4, { width: 28, align: "right", lineBreak: false });
  }

  return { left, right, top, bottom };
}

function drawChartCard(doc, x, y, width, height) {
  doc.save();
  doc.roundedRect(x, y, width, height, 9).fillAndStroke("#ffffff", "#e2e8f0");
  doc.restore();
}

function drawSmoothLine(doc, points) {
  if (points.length < 2) return;
  doc.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    let previous = points[index - 1];
    let current = points[index];
    let controlOffset = (current.x - previous.x) / 2;
    doc.bezierCurveTo(
      previous.x + controlOffset,
      previous.y,
      current.x - controlOffset,
      current.y,
      current.x,
      current.y
    );
  }
}

function drawDateLabels(doc, rows, left, right, y) {
  if (!rows.length) return;
  let labelCount = Math.min(rows.length, 6);
  doc.font("Helvetica").fontSize(7).fillColor("#64748b");
  for (let index = 0; index < labelCount; index += 1) {
    let rowIndex = labelCount === 1
      ? 0
      : Math.round((index * (rows.length - 1)) / (labelCount - 1));
    let labelX = left + ((right - left) * rowIndex) / Math.max(rows.length - 1, 1);
    doc.text(shortDate(rows[rowIndex].date), labelX - 22, y, {
      width: 44,
      align: "center",
      lineBreak: false,
    });
  }
}

function drawAttendanceChart(doc, trends, x, y, width, height) {
  doc.font("Helvetica-Bold").fontSize(10).fillColor("#1e293b").text("Attendance Trends", x, y);
  doc.font("Helvetica").fontSize(7.5).fillColor("#94a3b8")
    .text("Present, Late, Absent by day", x, y + 14);
  drawLegend(doc, [
    { label: "Present", color: CHART_COLORS.present },
    { label: "Late", color: CHART_COLORS.late },
    { label: "Absent", color: CHART_COLORS.absent },
  ], x, y + 17);

  let maxValue = Math.max(1, ...trends.flatMap((row) => [row.present, row.late, row.absent].map(Number)));
  let axes = drawAxes(doc, { x, y, width, height, maxValue, formatValue: (value) => String(Math.round(value)) });
  if (!trends.length) {
    doc.font("Helvetica").fontSize(9).fillColor("#64748b").text("No attendance data for this range.", axes.left, axes.top + 24);
    return;
  }

  for (let [key, color] of [
    ["present", CHART_COLORS.present],
    ["late", CHART_COLORS.late],
    ["absent", CHART_COLORS.absent],
  ]) {
    let points = trends.map((row, index) => ({
      x: axes.left + ((axes.right - axes.left) * index) / Math.max(trends.length - 1, 1),
      y: axes.bottom - ((axes.bottom - axes.top) * Number(row[key] || 0)) / maxValue,
    }));
    doc.lineWidth(1.8).strokeColor(color);
    drawSmoothLine(doc, points);
    if (points.length > 1) doc.stroke();
    else {
      doc.circle(points[0].x, points[0].y, 2.5).fill(color);
    }
  }

  drawDateLabels(doc, trends, axes.left, axes.right, axes.bottom + 8);
}

function drawWorkingHoursChart(doc, series, overallAvg, x, y, width, height) {
  doc.font("Helvetica-Bold").fontSize(10).fillColor("#1e293b").text("Avg Working Hours", x, y);
  doc.font("Helvetica").fontSize(7.5).fillColor("#94a3b8")
    .text("Daily average", x, y + 14);
  doc.font("Helvetica-Bold").fontSize(9).fillColor(CHART_COLORS.hours)
    .text(`${printable(overallAvg)}h`, x + width - 42, y, { width: 42, align: "right" });

  let maxValue = Math.max(1, ...series.map((row) => Number(row.avgHours || 0)));
  let axes = drawAxes(doc, { x, y, width, height, maxValue, formatValue: (value) => value.toFixed(1) });
  if (!series.length) {
    doc.font("Helvetica").fontSize(9).fillColor("#64748b").text("No working-hours data for this range.", axes.left, axes.top + 24);
    return;
  }

  let points = series.map((row, index) => ({
    x: axes.left + ((axes.right - axes.left) * index) / Math.max(series.length - 1, 1),
    y: axes.bottom - ((axes.bottom - axes.top) * Number(row.avgHours || 0)) / maxValue,
  }));

  doc.save();
  doc.moveTo(points[0].x, axes.bottom).lineTo(points[0].x, points[0].y);
  drawSmoothLine(doc, points);
  doc.lineTo(points[points.length - 1].x, axes.bottom).closePath().fillColor(CHART_COLORS.hoursFill).fill();
  doc.restore();

  if (points.length > 1) {
    doc.lineWidth(1.8).strokeColor(CHART_COLORS.hours);
    drawSmoothLine(doc, points);
    doc.stroke();
  } else {
    doc.circle(points[0].x, points[0].y, 2.5).fill(CHART_COLORS.hours);
  }
  drawDateLabels(doc, series, axes.left, axes.right, axes.bottom + 8);
}

function drawProjectChart(doc, projects, x, y, width, height) {
  doc.font("Helvetica-Bold").fontSize(10).fillColor("#1e293b").text("Projects: Completed vs Not Completed", x, y);
  doc.font("Helvetica").fontSize(7.5).fillColor("#64748b")
    .text("Breakdown by project status, all projects", x, y + 14);

  let entries = (projects.byStatus || []).filter((entry) => Number(entry.value) > 0);
  let total = Number(projects.total || 0);
  let completedPct = total ? Math.round((Number(projects.completed || 0) / total) * 100) : 0;
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#2563eb")
    .text(`${completedPct}% completed`, x + width - 100, y, { width: 100, align: "right" });
  if (!total || !entries.length) {
    doc.font("Helvetica").fontSize(9).fillColor("#64748b").text("No projects yet.", x, y + 72);
    return;
  }

  let centerX = x + 150;
  let centerY = y + height / 2 + 7;
  let radius = Math.min(67, height / 2 - 19);
  let startAngle = -Math.PI / 2;
  for (let entry of entries) {
    let sweep = (Number(entry.value) / total) * Math.PI * 2;
    let steps = Math.max(2, Math.ceil(sweep / (Math.PI / 24)));
    doc.save();
    doc.moveTo(centerX, centerY);
    for (let step = 0; step <= steps; step += 1) {
      let angle = startAngle + (sweep * step) / steps;
      let pointX = centerX + radius * Math.cos(angle);
      let pointY = centerY + radius * Math.sin(angle);
      if (step === 0) doc.lineTo(pointX, pointY);
      else doc.lineTo(pointX, pointY);
    }
    doc.closePath()
      .lineWidth(1.5)
      .fillColor(PROJECT_STATUS_COLORS[entry.status] || "#94a3b8")
      .strokeColor("#ffffff")
      .fillAndStroke();
    doc.restore();
    startAngle += sweep;
  }

  doc.circle(centerX, centerY, radius * 0.63).fillColor("#ffffff").fill();
  doc.font("Helvetica-Bold").fontSize(11).fillColor("#1e293b")
    .text(String(total), centerX - 20, centerY - 6, { width: 40, align: "center" });

  let legendY = y + 42;
  for (let entry of entries) {
    let color = PROJECT_STATUS_COLORS[entry.status] || "#94a3b8";
    doc.fillColor(color).circle(x + 285, legendY + 4, 3).fill();
    doc.font("Helvetica").fontSize(8).fillColor("#475569")
      .text(`${printable(entry.status)} (${entry.value})`, x + 294, legendY, {
        width: Math.max(40, width - 299),
        lineBreak: false,
      });
    legendY += 15;
  }
}

function drawChartsPage(doc, { trends, workingHours, projects }) {
  doc.addPage();
  doc.font("Helvetica-Bold").fontSize(16).fillColor("#1d4ed8").text("Analytics Charts", 36, 34);
  doc.font("Helvetica").fontSize(8).fillColor("#64748b")
    .text("Reports & Analytics dashboard", 36, 56);

  drawChartCard(doc, 36, 78, 476, 275);
  drawChartCard(doc, 527, 78, 229, 275);
  drawChartCard(doc, 36, 370, 720, 195);
  drawAttendanceChart(doc, trends, 54, 96, 440, 238);
  drawWorkingHoursChart(doc, workingHours.series, workingHours.overallAvg, 545, 96, 193, 238);
  drawProjectChart(doc, projects, 54, 386, 684, 162);
}

export function createReportPdf({ range, department, stats, attendanceRows, trends, workingHours, projects }) {
  return new Promise((resolve, reject) => {
    let doc = new PDFDocument({ size: "LETTER", layout: "landscape", margin: 36 });
    let chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    let tableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    let pageBottom = () => doc.page.height - doc.page.margins.bottom;
    let writeTitle = (title) => {
      if (doc.y + 28 > pageBottom()) doc.addPage();
      doc.moveDown(0.4);
      doc.font("Helvetica-Bold").fontSize(13).fillColor("#1e3a8a").text(title);
      doc.moveDown(0.25);
    };
    let drawTable = (headers, rows, requestedWidths) => {
      let widths = requestedWidths || headers.map(() => tableWidth / headers.length);
      let scale = tableWidth / widths.reduce((sum, width) => sum + width, 0);
      widths = widths.map((width) => width * scale);
      let cellPadding = 5;
      let fontSize = 8;
      let lineGap = 1;
      let tableX = doc.page.margins.left;
      let cursorY = doc.y;

      let drawRow = (values, isHeader, rowIndex) => {
        let textOptions = {
          width: 1,
          font: isHeader ? "Helvetica-Bold" : "Helvetica",
          fontSize,
          lineGap,
        };
        let cells = values.map((value, index) => {
          let cellWidth = widths[index];
          let contentWidth = Math.max(1, cellWidth - cellPadding * 2);
          let text = printable(value);
          let textHeight = doc.heightOfString(text, { ...textOptions, width: contentWidth });
          return { text, cellWidth, contentWidth, textHeight };
        });
        let rowHeight = Math.max(22, ...cells.map((cell) => cell.textHeight + cellPadding * 2));
        let bottom = pageBottom();
        if (cursorY + rowHeight > bottom) {
          doc.addPage();
          cursorY = doc.page.margins.top;
          if (!isHeader) {
            drawRow(headers, true, 0);
            return drawRow(values, false, rowIndex);
          }
        }

        let x = tableX;
        cells.forEach((cell, index) => {
          doc.save();
          doc.rect(x, cursorY, cell.cellWidth, rowHeight)
            .fillAndStroke(
              isHeader ? "#1e3a8a" : rowIndex % 2 === 0 ? "#f8fafc" : "#ffffff",
              isHeader ? "#1e3a8a" : "#cbd5e1"
            );
          doc.font(isHeader ? "Helvetica-Bold" : "Helvetica")
            .fontSize(fontSize)
            .fillColor(isHeader ? "#ffffff" : "#1f2937")
            .text(cell.text, x + cellPadding, cursorY + cellPadding, {
              width: cell.contentWidth,
              height: Math.max(1, rowHeight - cellPadding * 2),
              lineGap,
              ellipsis: true,
            });
          doc.restore();
          x += widths[index];
        });
        cursorY += rowHeight;
      };

      drawRow(headers, true, 0);
      if (!rows.length) {
        drawRow(["No records for this selection.", ...headers.slice(1).map(() => "")], false, 0);
      } else {
        rows.forEach((row, index) => drawRow(row, false, index));
      }
      doc.y = cursorY + 8;
    };

    doc.font("Helvetica-Bold").fontSize(20).fillColor("#1d4ed8").text("GreatHire Reports & Analytics");
    doc.moveDown(0.5);
    doc.font("Helvetica").fontSize(10).fillColor("#374151");
    doc.text(`Date range: ${printable(range)}    Department: ${printable(department || "All Departments")}`);
    doc.text(`Generated: ${new Date().toISOString()}`);

    writeTitle("Summary");
    drawTable(
      ["Metric", "Value", "Change"],
      stats.map((item) => [item.label, item.value, item.change]),
      [300, 170, 250]
    );

    drawChartsPage(doc, { trends, workingHours, projects });
    doc.addPage();

    writeTitle(`Attendance Records (${attendanceRows.length})`);
    drawTable(
      ["Date", "Employee", "Department", "Status", "Check In", "Check Out", "Hours"],
      attendanceRows.map((item) => [
        item.date,
        item.employee?.name,
        item.employee?.department,
        item.status,
        item.checkIn,
        item.checkOut,
        item.hoursWorked,
      ]),
      [82, 132, 135, 90, 95, 95, 91]
    );

    writeTitle("Attendance Trends");
    drawTable(
      ["Date", "Present", "Absent", "Late", "Leave"],
      trends.map((item) => [item.date, item.present, item.absent, item.late, item.leave]),
      [280, 110, 110, 110, 110]
    );

    writeTitle("Working Hours");
    drawTable(
      ["Date", "Average Hours"],
      workingHours.series.map((item) => [item.date, item.avgHours]),
      [520, 200]
    );
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#1f2937")
      .text(`Overall average: ${printable(workingHours.overallAvg)} hours`);

    writeTitle("Project Completion");
    drawTable(
      ["Status", "Count"],
      [
        ["Total projects", projects.total],
        ["Completed", projects.completed],
        ["Not completed", projects.notCompleted],
        ...projects.byStatus.map((item) => [item.status, item.value]),
      ],
      [560, 160]
    );

    doc.end();
  });
}
