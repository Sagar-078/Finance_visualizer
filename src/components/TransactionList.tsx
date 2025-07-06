"use client";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

type Transaction = {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
};

export default function TransactionList({
  transactions,
  onUpdate,
  onEdit,
}: {
  transactions: Transaction[];
  onUpdate: () => void;
  onEdit: (tx: Transaction) => void;
}) {
  const deleteTransaction = async (id: string) => {
    const res = await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Transaction deleted!");
      onUpdate();
    } else {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">🧾 Recent Transactions</h2>

      <ul className="space-y-3">
        <AnimatePresence>
          {transactions.map((tx) => (
            <motion.li
              key={tx._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="border p-3 rounded bg-gray-50 flex justify-between items-center"
            >
              <div>
                <strong>₹{tx.amount}</strong> — {tx.description} on{" "}
                {new Date(tx.date).toLocaleDateString()} ({tx.category})
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => onEdit(tx)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTransaction(tx._id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}