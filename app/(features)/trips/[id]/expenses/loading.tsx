import { Skeleton } from "@/components/ui/skeleton";

export default function ExpensesLoading() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12 justify-start">
      <div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div>
        <div className="w-full">
          <Skeleton className="h-10 w-full mb-2" />
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-16 w-full mb-2" />
            ))}
        </div>
      </div>
    </div>
  );
}
