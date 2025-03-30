import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import NewExpenseButton from "../_components/new-expense-creator";
import ExpensesTable from "../_components/expenses-table";

export default async function ProtectedPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 justify-start">
      <div>
        <NewExpenseButton />
      </div>

      <div>
        <ExpensesTable />
      </div>
    </div>
  );
}
