"use client";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-teal-900 leading-tight">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export function SectionTitle({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">
        {title}
      </h2>
      {right}
    </div>
  );
}
