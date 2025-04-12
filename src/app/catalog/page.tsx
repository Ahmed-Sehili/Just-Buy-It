import { Suspense } from "react";
import ProductCatalogue from "@/components/product-catalog";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Catalogue | Just Buy It",
  description: "Browse our collection of Nike products",
};

export default function CataloguePage() {
  return (
    <div className="flex flex-col h-screen">
      {/* Fixed header */}
      <div className="flex-none py-6 px-4 border-b bg-background">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold tracking-tight">Nike Collection</h1>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 h-full">
          <Suspense fallback={<CatalogueSkeleton />}>
            <ProductCatalogue />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function CatalogueSkeleton() {
  return (
    <div className="flex h-full">
      {/* Sidebar skeleton */}
      <div className="hidden md:block w-56 shrink-0 pr-6 border-r h-full py-6">
        <Skeleton className="h-6 w-24 mb-6" />
        <div className="space-y-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <div className="space-y-2">
                  {Array(4)
                    .fill(0)
                    .map((_, j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                </div>
                {i < 2 && <Skeleton className="h-px w-full" />}
              </div>
            ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 md:pl-6 py-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-9 w-[120px]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[250px] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
