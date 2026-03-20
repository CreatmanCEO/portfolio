"use client"

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="text-sm text-muted">Projects</p>
          <p className="mt-2 text-3xl font-bold">20</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="text-sm text-muted">Blog Posts</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="text-sm text-muted">Page Views</p>
          <p className="mt-2 text-3xl font-bold">&mdash;</p>
        </div>
      </div>
      <p className="mt-8 text-sm text-muted">
        Admin panel is ready. Configure Google OAuth credentials in .env to
        enable authentication.
      </p>
    </div>
  )
}
