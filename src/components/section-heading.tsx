import { Ornament } from "@/components/ornament";

// Shared heading for homepage/listing sections: centered ornament + Playfair
// title, optional subtitle, optional action slot (e.g. a language toggle)
// that drops below the title on small screens.

export function SectionHeading({
  title,
  subtitle,
  action,
  className = "",
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-8 md:mb-10 ${className}`}>
      <div className="text-center">
        <Ornament className="mb-3" />
        <h2 className="text-[26px] md:text-[34px] font-bold font-[family-name:var(--font-playfair)] text-teal-950 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-[15px] md:text-base text-ink/60 max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
