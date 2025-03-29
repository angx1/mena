import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import NewExpenseButton from "../_components/new-expense-creator";

export default async function ProtectedPage() {
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
      <div className="flex flex-row gap-8">
        <div className="flex-auto justify-start border rounded-lg p-8">
          this will be the TOTAL spendings
        </div>
        <div className="flex-auto justify-start border rounded-lg p-8">
          this will be spendings/CATEGORY
        </div>
      </div>
      <div>
        list of spendings in a table with a pagination <br />
        ---- <br />
        spending 1 <br />
        ---- <br />
        spending 2 <br />
        ---- <br />
        ....
      </div>
    </div>
  );
}
