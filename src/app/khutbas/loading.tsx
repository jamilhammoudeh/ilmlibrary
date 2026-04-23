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
      <PillGridSkeleton count={4} />
    </>
  );
}
