import {
  HeroSkeleton,
  DescriptionCardSkeleton,
  PillGridSkeleton,
} from "@/components/skeletons";

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <DescriptionCardSkeleton />
      <div className="px-5 mt-2">
        <div className="skeleton h-12 w-[70%] mx-auto rounded-full" />
      </div>
      <PillGridSkeleton count={22} />
    </>
  );
}
