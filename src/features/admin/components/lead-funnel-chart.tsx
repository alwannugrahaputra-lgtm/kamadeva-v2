"use client";


// Penjelasan file: komponen admin untuk tampilan dan interaksi modul internal.
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function LeadFunnelChart({
  data,
}: {
  data: { status: string; total: number }[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(92,71,52,0.1)" />
          <XAxis dataKey="status" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="total" fill="#8f5a3c" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
