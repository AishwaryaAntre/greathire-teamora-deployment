import { useEffect, useState } from "react";
import { BellRing, Send, CheckCircle2, AlertCircle } from "lucide-react";

import MasterSidebar from "@/components/layout/MasterSidebar";
import DashboardTopBar from "@/components/layout/DashboardTopBar";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { employeeProfileApi } from "@/lib/api/employeeProfile";
import { notificationsApi } from "@/lib/api/notifications";

export default function SystemNotificationsPage() {
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  const [recipient, setRecipient] = useState("all");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    employeeProfileApi
      .getAll()
      .then((response) => {
        const list = Array.isArray(response)
          ? response
          : response?.data;

        setEmployees(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        setError(err.message || "Unable to load employees.");
      })
      .finally(() => {
        setLoadingEmployees(false);
      });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Please enter both title and message.");
      return;
    }

    const recipients =
      recipient === "all"
        ? employees
        : employees.filter((employee) => employee.id === recipient);

    if (recipients.length === 0) {
      setError("No valid recipient found.");
      return;
    }

    setSubmitting(true);

    try {
      for (const employee of recipients) {
        await notificationsApi.create({
          title: title.trim(),
          description: description.trim(),
          category: "system",
          priority,
          recipientEmployeeId: employee.id,
        });
      }

      setMessage(
  "System notification sent to " +
    recipients.length +
    " recipient(s)."
);

      setTitle("");
      setDescription("");
      setPriority("medium");
      setRecipient("all");
    } catch (err) {
      setError(
        err.message ||
          "Could not send notification. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      <MasterSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopBar />

        <main className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
              <BellRing className="h-7 w-7" />
              System Notifications
            </h1>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Send important system updates and announcements to employees.
            </p>
          </div>

          <Card className="max-w-3xl p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="recipient">
                  Send notification to
                </Label>

                <select
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  disabled={loadingEmployees || submitting}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="all">All Employees and Admin</option>

                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} ({employee.role})
                    </option>
                  ))}
                </select>

                {loadingEmployees && (
                  <p className="text-sm text-slate-500">
                    Loading employees...
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-title">
                  Notification title
                </Label>

                <Input
                  id="notification-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter notification title"
                  maxLength={200}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-description">
                  Message
                </Label>

                <textarea
                  id="notification-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write your announcement here..."
                  maxLength={1000}
                  rows={5}
                  required
                  disabled={submitting}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />

                <p className="text-right text-xs text-slate-500">
                  {description.length}/1000
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>

                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {message && (
                <div className="flex items-start gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={
                  submitting ||
                  loadingEmployees ||
                  employees.length === 0
                }
                className="w-full sm:w-auto"
              >
                <Send className="mr-2 h-4 w-4" />
                {submitting
                  ? "Sending..."
                  : "Send System Notification"}
              </Button>
            </form>
          </Card>
        </main>
      </div>
    </div>
  );
}
