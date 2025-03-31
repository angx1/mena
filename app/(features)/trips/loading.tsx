import { Skeleton } from "@/components/ui/skeleton";

export default function TripsLoading() {
  return (
    <div className="mx-auto flex flex-col w-full gap-8">
      <div className="flex-1 w-full flex flex-row justify-start gap-12">
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[250px] w-full rounded-xl" />
          ))}
      </div>
    </div>
  );
}
