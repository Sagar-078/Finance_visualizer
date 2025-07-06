"use client";

import { useEffect, useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import Chart from "@/components/Chart";
import { useRouter } from "next/navigation";

type Transaction = {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const router = useRouter();

  const fetchTransactions = async () => {
    const email = localStorage.getItem("email");
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/transactions?email=${email}`);
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    const email = localStorage.getItem("email");
    if (!email) {
      router.push("/login");
    }

  }, []);

  return (
    <main className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-4xl font-bold mb-10 text-center">💸 Finance Visualizer</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TransactionForm
          onAdd={fetchTransactions}
          editingTx={editingTx}
          onEditCancel={() => setEditingTx(null)}
          transactions={transactions}
        />
        <Chart transactions={transactions} />
      </div>

      {loading ? (
        <div className="text-center mt-10 text-gray-600">Loading transactions...</div>
      ) : (
        <TransactionList
          transactions={transactions}
          onUpdate={fetchTransactions}
          onEdit={(tx) => setEditingTx(tx)}
        />
      )}
    </main>
  );
}