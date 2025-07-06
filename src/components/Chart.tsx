"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

const COLORS = [
  "#4F46E5", "#10B981", "#F59E0B", "#EF4444",
  "#6366F1", "#14B8A6", "#8B5CF6", "#F43F5E",
];

type Transaction = {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
};

export default function Chart({ transactions }: { transactions: Transaction[] }) {
  const categoryData = useMemo(() => {
    if (!Array.isArray(transactions)) return { data: [], total: 0 };

    const totals: Record<string, number> = {};
    let grandTotal = 0;

    transactions.forEach((tx) => {
      const category = tx.category;
      if (!totals[category]) totals[category] = 0;
      totals[category] += Number(tx.amount || 0);
      grandTotal += Number(tx.amount || 0);
    });

    const data = Object.entries(totals).map(([name, value]) => ({
      name,
      value,
    }));

    return { data, total: grandTotal };
  }, [transactions]);

  if (categoryData.data.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-6">
        No transaction data to show.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">📊 Category Breakdown</h2>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={categoryData.data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            labelLine={false}
            label={({ name, percent }: { name: string; percent?: number }) =>
              percent !== undefined ? `${name} (${(percent * 100).toFixed(0)}%)` : name
            }
          >
            {categoryData.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 text-center text-sm text-gray-700">
        Total Spent: <span className="font-semibold text-lg">₹{categoryData.total}</span>
      </div>
    </div>
  );
}
