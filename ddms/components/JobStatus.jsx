"use client";
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json()).catch(() => ({}));

export default function JobStatus() {
  const { data } = useSWR('/api/ai/jobs', fetcher, { refreshInterval: 5000 });
  const counts = data?.counts || {};

  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <h3 className="font-semibold mb-2 text-black">Job Queue Status</h3>
      <div className="grid grid-cols-2 gap-2 text-sm text-black">
        <div>Waiting: <strong>{counts.waiting ?? 0}</strong></div>
        <div>Active: <strong>{counts.active ?? 0}</strong></div>
        <div>Completed: <strong>{counts.completed ?? 0}</strong></div>
        <div>Failed: <strong>{counts.failed ?? 0}</strong></div>
        <div>Delayed: <strong>{counts.delayed ?? 0}</strong></div>
      </div>
    </div>
  );
}
