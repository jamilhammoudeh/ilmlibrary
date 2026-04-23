import { FolderOpen } from "lucide-react";

export function EmptyState({
  title,
  message,
  icon,
}: {
  title: string;
  message?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="max-w-md mx-auto py-16 px-6 text-center fade-in">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-50 flex items-center justify-center text-teal-700">
        {icon ?? <FolderOpen size={28} />}
      </div>
      <h3 className="text-lg font-semibold text-teal-900 mb-1 font-[family-name:var(--font-amiri)]">
        {title}
      </h3>
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  );
}
