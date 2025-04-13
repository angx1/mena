import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex-1 w-full flex flex-col gap-5 max-w-4xl mx-auto p-4">
        <div className="w-full flex flex-col gap-5">
          <div className="p-4">
            <div className="flex flex-col gap-3">
              <Skeleton className="w-3/4 h-6" />
              <Skeleton className="w-full h-6" />
            </div>
          </div>

          <div className="flex flex-col gap-5 relative">
            <Skeleton className="w-full h-[80px] rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
