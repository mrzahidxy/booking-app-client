import { Skeleton } from "@/components/ui/skeleton";

type HomeSectionSkeletonProps = {
  title: string;
  items?: number;
  className?: string;
};

export default function HomeSectionSkeleton({
  title,
  items = 5,
  className,
}: HomeSectionSkeletonProps) {
  return (
    <section className={`py-16 ${className ?? ""}`} aria-busy="true">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold mb-8">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {Array.from({ length: items }).map((_, index) => (
            <Skeleton key={index} className="h-[360px] w-full" />
          ))}
        </div>
      </div>
    </section>
  );
}
