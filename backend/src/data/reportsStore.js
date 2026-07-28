import { ReportModel } from "../db/schemas.js";

/** Reports created via POST /api/reports/generate. */
export let generatedReports = [];

export async function loadGeneratedReports() {
  let docs = await ReportModel.find().sort({ createdAt: -1 }).lean();
  generatedReports.length = 0;
  generatedReports.push(...docs.map(({ _id, ...rest }) => rest));
  return generatedReports;
}

export async function persistNewReport(report) {
  generatedReports.unshift(report);
  await ReportModel.create(report);
  return report;
}
