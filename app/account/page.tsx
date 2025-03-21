import { fetchUserAction } from "@/app/actions";

export default async function Account() {
  const user = await fetchUserAction();
  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h1 className="text-2xl font-medium">Account</h1>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-foreground">
            Email: {user?.email || "No email"}
          </p>
          <p className="text-sm text-foreground">
            User ID: {user?.id || "No user ID"}
          </p>
          <p className="text-sm text-foreground">
            Name: {user?.nombre || "No name"}
          </p>
        </div>
      </main>
    </>
  );
}
