"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type ChartData = {
  day: string;
  receita: number;
  despesa: number;
};

export function CashFlowChart({ data }: { data: ChartData[] }) {
  const formatBRL = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const rec = payload.find((p: any) => p.dataKey === "receita")?.value || 0;
      const des = payload.find((p: any) => p.dataKey === "despesa")?.value || 0;
      return (
        <div className="bg-[#0b1220] border border-white/10 rounded-xl p-3 shadow-2xl">
          <p className="text-white/60 text-xs mb-2">Dia {label}</p>
          <div className="space-y-1">
            <p className="text-emerald-500 font-bold text-sm">Receitas: {formatBRL(rec)}</p>
            <p className="text-red-500 font-bold text-sm">Despesas: {formatBRL(des)}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/50 text-sm">
        Nenhum fluxo registrado neste mês.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.03)" vertical={false} />
        <XAxis 
          dataKey="day" 
          stroke="rgba(255,255,255,0.4)" 
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis 
          stroke="rgba(255,255,255,0.4)" 
          fontSize={11}
          tickFormatter={(val) => `R$${(val / 1000).toFixed(0)}k`}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '3 3' }} />
        <Line 
          type="monotone" 
          dataKey="receita" 
          stroke="#10b981" 
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 5, fill: "#10b981", strokeWidth: 0 }}
        />
        <Line 
          type="monotone" 
          dataKey="despesa" 
          stroke="#ef4444" 
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 5, fill: "#ef4444", strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
