"use client";

import ContentEditor from "@/components/admin/ContentEditor";

export default function ContentPage() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Content Management</h1>
      <ContentEditor />
    </div>
  );
}
