import { HeroSkeleton, ChapterGridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <ChapterGridSkeleton count={16} />
    </>
  );
}
