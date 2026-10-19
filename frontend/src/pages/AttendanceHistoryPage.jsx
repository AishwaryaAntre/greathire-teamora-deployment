import { useCallback, useEffect, useState } from "react";
import { attendanceApi } from "@/lib/api/attendance";
import { useNavigate } from "react-router-dom";

function getDate(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatHours(hours) {
  const value = Number(hours);
  return Number.isFinite(value) ? `${value.toFixed(2)} hrs` : "—";
}

export default function AttendanceHistoryPage() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(getDate(-30));
  const [endDate, setEndDate] = useState(getDate());
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await attendanceApi.getHistory({
        startDate,
        endDate,
      });

const payload = response?.data ?? response;
const rows = Array.isArray(payload) ? payload : payload?.data;
setRecords(Array.isArray(rows) ? rows : []);
    } catch (err) {
      setRecords([]);
      setError(
        err?.message || "Unable to load attendance history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const invalidRange = startDate && endDate && startDate > endDate;

  function handleFilter(event) {
    event.preventDefault();
    if (invalidRange) {
      setError("Start date cannot be after end date.");
      return;
    }
    loadHistory();
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate("/employee-dashboard")}
          className="mb-5 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Dashboard
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Attendance History
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            View your check-in, check-out and working hours.
          </p>
        </div>

        <form
          onSubmit={handleFilter}
          className="mb-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
        >
          <div>
            <label
              htmlFor="startDate"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              From date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) => setStartDate(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              To date
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              min={startDate || undefined}
              max={getDate()}
              onChange={(event) => setEndDate(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading || invalidRange}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Loading..." : "Apply Filter"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStartDate(getDate(-30));
              setEndDate(getDate());
            }}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Last 30 Days
          </button>
        </form>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
            <button
              type="button"
              onClick={loadHistory}
              className="ml-2 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6">
            <h2 className="font-semibold text-slate-900">Your Records</h2>
            <span className="text-sm text-slate-500">
              {records.length} record{records.length === 1 ? "" : "s"}
            </span>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading attendance history...
            </div>
          ) : records.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-medium text-slate-700">
                No attendance records found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try selecting a different date range.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Check In</th>
                    <th className="px-5 py-3 font-semibold">Check Out</th>
                    <th className="px-5 py-3 font-semibold">Working Hours</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-800">
                        {formatDate(record.date)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {record.checkIn || "—"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {record.checkOut || "—"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {formatHours(record.hoursWorked)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            record.status === "Present"
                              ? "bg-green-100 text-green-700"
                              : record.status === "Late"
                                ? "bg-amber-100 text-amber-700"
                                : record.status === "Absent"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {record.status || "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
