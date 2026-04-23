// Shared loading skeletons. Each exports a grid or list of placeholder shapes
// that mirror the real content shown on the corresponding route. The visual
// rhythm (spacing, sizing, roundedness) matches the loaded state so the layout
// doesn't jump when real content arrives.

export function HeroSkeleton({ withSubtitle = true }: { withSubtitle?: boolean }) {
  return (
    <section className="bg-[#f0f0f0] pt-8 md:pt-10 pb-3 px-5 flex flex-col items-center">
      <div className="skeleton h-10 md:h-14 w-3/4 max-w-[560px] rounded-lg mb-3" />
      {withSubtitle && (
        <div className="skeleton h-5 md:h-7 w-2/3 max-w-[420px] rounded" />
      )}
    </section>
  );
}

export function DescriptionCardSkeleton() {
  return (
    <section className="w-[92%] mx-auto my-8">
      <div className="bg-teal-100 rounded-2xl px-8 py-10 shadow-[0_4px_12px_rgba(0,0,0,0.08)] space-y-3">
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-5 w-11/12 mx-auto rounded" />
        <div className="skeleton h-5 w-4/5 mx-auto rounded" />
      </div>
    </section>
  );
}

export function PillGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <section className="py-6 px-5">
      <div className="flex flex-wrap justify-center gap-4 max-w-7xl mx-auto">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="skeleton w-[calc(50%-0.5rem)] sm:w-[230px] h-[58px] rounded-2xl"
          />
        ))}
      </div>
    </section>
  );
}

export function BookGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <section className="py-10 px-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-7xl mx-auto">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          >
            <div className="skeleton aspect-[2/3] w-full" />
            <div className="p-3 space-y-2">
              <div className="skeleton h-4 w-5/6 rounded" />
              <div className="skeleton h-3 w-2/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ListCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-10 space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] space-y-3"
        >
          <div className="skeleton h-5 w-2/3 rounded" />
          <div className="skeleton h-3 w-1/3 rounded" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-5/6 rounded" />
        </div>
      ))}
    </section>
  );
}

export function ChapterGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <section className="max-w-7xl mx-auto px-5 py-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-3 sm:p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center gap-3 sm:gap-4"
          >
            <div className="skeleton w-9 h-9 sm:w-10 sm:h-10 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
            <div className="skeleton w-10 h-5 rounded shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
}
