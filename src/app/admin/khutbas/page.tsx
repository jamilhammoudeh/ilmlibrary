"use client";

import { MediaAdmin } from "@/components/admin/media-admin";

export default function AdminKhutbasPage() {
  return (
    <MediaAdmin
      table="khutbas"
      contentType="khutba"
      singularLabel="Khutba"
      pluralLabel="Khutbas"
      subtitle="Manage Friday khutbas and sermon recordings"
    />
  );
}
