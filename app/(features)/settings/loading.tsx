import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="w-full max-w-screen flex flex-col gap-10">
      <section id="profile">
        <div className="border rounded-lg p-8">
          <div className="space-y-4">
            <div className="flex flex-row gap-2 w-full">
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-8 mt-4">
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-end">
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </div>
      </section>

      <section id="appearance">
        <div className="border rounded-lg p-8">
          <div className="flex flex-row justify-between gap-5">
            <div className="flex flex-col justify-between">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-32 mt-4" />
            </div>
            <div className="flex flex-row justify-start gap-5">
              <Skeleton className="h-28 w-28 rounded-md" />
              <Skeleton className="h-28 w-28 rounded-md" />
              <Skeleton className="h-28 w-28 rounded-md" />
            </div>
          </div>
        </div>
      </section>

      <section id="account">
        <div className="border border-red-300 rounded-lg p-8">
          <div className="flex flex-col gap-10">
            <div className="flex flex-row items-center gap-10">
              <Skeleton className="h-10 w-32" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
            <Skeleton className="h-px w-full" /> {/* Separator */}
            <div className="flex flex-row items-center gap-10">
              <Skeleton className="h-10 w-32" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
