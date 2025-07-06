"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { categories } from "@/lib/categories";

type Transaction = {
  _id?: string;
  amount: number;
  date: string;
  description: string;
  category: string;
};

export default function TransactionForm({
  onAdd,
  transactions,
  editingTx,
  onEditCancel,
}: {
  onAdd: () => void;
  transactions: Transaction[];
  editingTx?: Transaction | null;
  onEditCancel?: () => void;
}) {
  const [form, setForm] = useState({
    amount: "",
    date: "",
    description: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTx) {
      setForm({
        amount: editingTx.amount.toString(),
        date: editingTx.date,
        description: editingTx.description,
        category: editingTx.category,
      });
    }
  }, [editingTx]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setForm({ ...form, category: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const email = localStorage.getItem("email");

    try {
      let res;

      if (editingTx?._id) {
        res = await fetch(`/api/transactions/${editingTx._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, email }),
        });
      } else {
        res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, email }),
        });
      }

      if (res.ok) {
        setForm({ amount: "", date: "", description: "", category: "" });
        toast.success(editingTx ? "Transaction updated!" : "Transaction added!");
        onAdd();
        onEditCancel?.();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-4 p-4 border rounded bg-white shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <Input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          max={today}
        />

        <Input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <Select
          onValueChange={handleCategoryChange}
          value={form.category}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="submit" disabled={loading} className="w-full">
          {loading
            ? editingTx
              ? "Updating..."
              : "Adding..."
            : editingTx
            ? "Update Transaction"
            : "Add Transaction"}
        </Button>

        {editingTx && onEditCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onEditCancel}
            className="w-full"
          >
            Cancel
          </Button>
        )}
      </form>

      {transactions.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded shadow text-sm text-gray-700">
          <h3 className="font-semibold mb-2">📈 Transaction Summary</h3>
          <ul className="space-y-1">
            <li>Total Transactions: {transactions.length}</li>
            <li>
              Total Spent: ₹
              {transactions.reduce((acc, tx) => acc + Number(tx.amount || 0), 0)}
            </li>
            <li>
              Top Category:{" "}
              {(() => {
                const totals: Record<string, number> = {};
                transactions.forEach((tx) => {
                  if (!totals[tx.category]) totals[tx.category] = 0;
                  totals[tx.category] += Number(tx.amount || 0);
                });
                const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
                return sorted[0]?.[0] || "N/A";
              })()}
            </li>
          </ul>
        </div>
      )}

      <div className="mt-4 p-4 bg-purple-50 border-l-4 border-purple-400 rounded shadow text-sm text-gray-800 italic">
        💡 {"A budget is telling your money where to go instead of wondering where it went."}
      </div>
    </div>
  );
}