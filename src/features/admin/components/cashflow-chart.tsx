"use client";


// Penjelasan file: komponen admin untuk tampilan dan interaksi modul internal.
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/shared/lib/format";

export function CashflowChart({
  data,
}: {
  data: { name: string; cashIn: number; cashOut: number }[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="cashIn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8f5a3c" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#8f5a3c" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="cashOut" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d97757" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#d97757" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(92,71,52,0.1)" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickFormatter={(value) => `${Math.round(value / 1000000)} jt`} tickLine={false} axisLine={false} />
          <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
          <Area type="monotone" dataKey="cashIn" stroke="#8f5a3c" fillOpacity={1} fill="url(#cashIn)" />
          <Area type="monotone" dataKey="cashOut" stroke="#d97757" fillOpacity={1} fill="url(#cashOut)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
