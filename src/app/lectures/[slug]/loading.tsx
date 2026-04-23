import { HeroSkeleton, ListCardSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <ListCardSkeleton count={6} />
    </>
  );
}
