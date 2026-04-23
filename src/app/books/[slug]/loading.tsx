import { HeroSkeleton, BookGridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <BookGridSkeleton count={10} />
    </>
  );
}
