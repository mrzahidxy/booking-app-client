import { Skeleton } from "@/components/ui/skeleton";

export default function HotelLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-6 space-y-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-6 w-72" />
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </main>
    </div>
  );
}
