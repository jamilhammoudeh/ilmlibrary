import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = {
  label: string;
  href?: string;
};

export function ContentHeader({
  title,
  subtitle,
  breadcrumbs,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
}) {
  return (
    <div>
      <section className="bg-[#f0f0f0] pt-8 md:pt-10 pb-3 px-5 text-center fade-in-up">
        <h1 className="text-[28px] sm:text-[38px] md:text-[48px] font-bold font-[family-name:var(--font-playfair)] text-teal-900 leading-[1.1] mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[18px] sm:text-[24px] md:text-[28px] font-normal font-[family-name:var(--font-amiri)] text-teal-900 max-w-[720px] mx-auto px-2 [text-shadow:1px_1px_16px_rgba(0,0,0,0.45)]">
            {subtitle}
          </p>
        )}
      </section>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="max-w-7xl mx-auto px-5 pt-5 flex items-center gap-1 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-teal-700 transition-colors">
            Home
          </Link>
          {breadcrumbs.map((item, i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight size={14} className="text-gray-300" />
              {item.href ? (
                <Link href={item.href} className="hover:text-teal-700 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-700 font-medium">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
    </div>
  );
}
