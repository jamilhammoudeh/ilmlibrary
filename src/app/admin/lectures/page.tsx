"use client";

import { MediaAdmin } from "@/components/admin/media-admin";

export default function AdminLecturesPage() {
  return (
    <MediaAdmin
      table="lectures"
      contentType="lecture"
      singularLabel="Lecture"
      pluralLabel="Lectures"
      subtitle="Manage audio and video lectures in your library"
    />
  );
}
