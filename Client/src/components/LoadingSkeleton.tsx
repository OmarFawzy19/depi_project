import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  variant?: "card" | "list" | "detail";
}

export function LoadingSkeleton({ variant = "card" }: LoadingSkeletonProps) {
  if (variant === "detail") {
    return (
      <div className="space-y-4">
        <Skeleton className="h-80 w-full rounded-2xl" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  if (variant === "list") {
    return (
      <div className="flex gap-4 rounded-2xl bg-card p-3 shadow-card">
        <Skeleton className="h-24 w-32 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-card">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}