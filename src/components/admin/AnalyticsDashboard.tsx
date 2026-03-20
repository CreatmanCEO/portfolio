"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  viewsByDay: { date: string; count: number }[];
  topPages: { path: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  topCountries: { country: string; count: number }[];
  recentVisits: {
    path: string;
    referrer: string | null;
    country: string | null;
    createdAt: string;
  }[];
}

const periods = [
  { value: "1d", label: "Today" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "all", label: "All" },
];

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState("7d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/analytics?period=${period}`);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  if (loading && !data) {
    return <div className="text-muted">Loading analytics...</div>;
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Period Selector */}
      <div className="flex gap-2">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              period === p.value
                ? "bg-foreground text-background"
                : "border border-border text-muted hover:text-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="text-sm text-muted">Total Views</p>
          <p className="mt-2 text-3xl font-bold">
            {data.totalViews.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="text-sm text-muted">Unique Visitors</p>
          <p className="mt-2 text-3xl font-bold">
            {data.uniqueVisitors.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Views Chart */}
      {data.viewsByDay.length > 0 && (
        <div className="rounded-lg border border-border bg-surface p-6">
          <h3 className="mb-4 text-sm font-medium">Views Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.viewsByDay}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border, #e5e7eb)"
              />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="var(--color-accent, #f59e0b)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tables Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Top Pages */}
        <div className="rounded-lg border border-border bg-surface p-4">
          <h3 className="mb-3 text-sm font-medium">Top Pages</h3>
          <div className="space-y-2">
            {data.topPages.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="truncate text-muted">{p.path}</span>
                <span className="font-medium">{p.count}</span>
              </div>
            ))}
            {data.topPages.length === 0 && (
              <p className="text-xs text-muted">No data yet</p>
            )}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="rounded-lg border border-border bg-surface p-4">
          <h3 className="mb-3 text-sm font-medium">Top Referrers</h3>
          <div className="space-y-2">
            {data.topReferrers.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="truncate text-muted">{r.referrer}</span>
                <span className="font-medium">{r.count}</span>
              </div>
            ))}
            {data.topReferrers.length === 0 && (
              <p className="text-xs text-muted">No data yet</p>
            )}
          </div>
        </div>

        {/* Top Countries */}
        <div className="rounded-lg border border-border bg-surface p-4">
          <h3 className="mb-3 text-sm font-medium">Top Countries</h3>
          <div className="space-y-2">
            {data.topCountries.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-muted">{c.country}</span>
                <span className="font-medium">{c.count}</span>
              </div>
            ))}
            {data.topCountries.length === 0 && (
              <p className="text-xs text-muted">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Visits */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <h3 className="mb-3 text-sm font-medium">Recent Visits (last 50)</h3>
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="text-muted">
              <tr>
                <th className="pb-2 text-left font-medium">Path</th>
                <th className="pb-2 text-left font-medium">Referrer</th>
                <th className="pb-2 text-left font-medium">Country</th>
                <th className="pb-2 text-left font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.recentVisits.map((v, i) => (
                <tr key={i}>
                  <td className="py-1.5">{v.path}</td>
                  <td className="py-1.5 text-muted truncate max-w-[150px]">
                    {v.referrer || "\u2014"}
                  </td>
                  <td className="py-1.5 text-muted">{v.country || "\u2014"}</td>
                  <td className="py-1.5 text-muted whitespace-nowrap">
                    {new Date(v.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {data.recentVisits.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-muted">
                    No visits yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
