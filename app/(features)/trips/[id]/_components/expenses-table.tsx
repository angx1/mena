"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTripExpenses } from "@/app/actions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ExpensesTable() {
  const params = useParams();
  const tripId = params.id as string;
  const [tripExpenses, setTripExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const expenses = await getTripExpenses(tripId);
        setTripExpenses(expenses || []);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError("Failed to load expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [tripId]);

  if (loading) {
    return <div className="text-center py-4">Loading expenses...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (!tripExpenses || tripExpenses.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No expenses found for this trip
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>A list of your trip expenses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Business</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tripExpenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell className="font-medium">
              {expense.comercios?.nombre || "Unknown business"}
            </TableCell>
            <TableCell>{expense.categoria || "Uncategorized"}</TableCell>
            <TableCell className="text-right">
              {expense.monto_total} {expense.moneda}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
