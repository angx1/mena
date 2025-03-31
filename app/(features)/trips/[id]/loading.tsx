import { Skeleton } from "@/components/ui/skeleton";

export default function TripLoading() {
  return (
    <div className="w-full max-w-screen-md flex flex-col gap-6">
      <div className="flex flex-col gap-1 max-w-full">
        <Skeleton className="h-8 w-3/4" />
        <div className="w-full">
          <Skeleton className="h-20 w-full mt-2" />
        </div>
      </div>

      <div className="flex flex-row flex-wrap gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-40" />
      </div>
    </div>
  );
}
