import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useDashboardData() {
  const [data, setData] = useState({
    overview: null,
    snapshot: [],
    metrics: null,
    workforce: [],
    activity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [overview, snapshot, metrics, workforce, activity] = await Promise.all([
          api.get("/dashboard/overview"),
          api.get("/dashboard/snapshot"),
          api.get("/dashboard/metrics"),
          api.get("/dashboard/live-workforce"),
          api.get("/dashboard/recent-activity"),
        ]);
        if (cancelled) return;
        setData({
          overview: overview.data,
          snapshot: snapshot.data.snapshot,
          metrics: metrics.data.metrics,
          workforce: workforce.data.workforce,
          activity: activity.data.activity,
        });
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { ...data, loading, error };
}
