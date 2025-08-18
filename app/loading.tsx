import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="relative">
        <Skeleton className="h-[300px] md:h-[500px] w-full" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="text-center">
            <Skeleton className="h-12 w-72 mb-4 bg-gray-400/50" />
            <Skeleton className="h-6 w-96 mb-8 bg-gray-400/50" />
            <Skeleton className="h-12 w-48 bg-gray-500/50" />
          </div>
        </div>
      </section>

      {/* Featured Products Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-40 md:h-64 w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Skeleton */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <Skeleton className="h-8 w-72 mx-auto mb-12" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 md:gap-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="text-center space-y-3">
              <Skeleton className="w-full h-32 md:h-40 rounded-xl" />
              <Skeleton className="h-5 w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-72 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 space-y-3">
                <Skeleton className="h-5 w-24 mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="pt-2">
                    <Skeleton className="h-5 w-28 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
