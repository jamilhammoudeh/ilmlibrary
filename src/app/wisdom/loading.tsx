import {
  HeroSkeleton,
  DescriptionCardSkeleton,
  PillGridSkeleton,
  ListCardSkeleton,
} from "@/components/skeletons";

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <DescriptionCardSkeleton />
      <PillGridSkeleton count={16} />
      <ListCardSkeleton count={3} />
    </>
  );
}
