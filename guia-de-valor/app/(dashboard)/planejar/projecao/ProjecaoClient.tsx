"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon, BarChart2, Table, Download,
  ChevronLeft, ChevronRight, TrendingUp, TrendingDown,
  Scale, CreditCard, Receipt, Landmark, ChevronDown
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function ProjecaoClient({ resumo }: { resumo: any }) {
  const [viewMode, setViewMode] = useState<"mensal" | "anual">("mensal");
  const [dataMode, setDataMode] = useState<"grafico" | "tabela">("tabela");
  const [baseDate, setBaseDate] = useState<Date>(new Date());

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const getMonthLabel = () => {
    const monthName = baseDate.toLocaleString('pt-BR', { month: 'long' });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return `${capitalizedMonth} de ${baseDate.getFullYear()}`;
  };

  const handlePrev = () => {
    const newDate = new Date(baseDate);
    if (viewMode === "mensal") newDate.setMonth(newDate.getMonth() - 1);
    else newDate.setFullYear(newDate.getFullYear() - 1);
    setBaseDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(baseDate);
    if (viewMode === "mensal") newDate.setMonth(newDate.getMonth() + 1);
    else newDate.setFullYear(newDate.getFullYear() + 1);
    setBaseDate(newDate);
  };

  // MOCK DATA PARA O GRÁFICO ANUAL
  const dataAnual = [
    { name: 'Jan', receitas: 0, despesas: 0 },
    { name: 'Fev', receitas: 0, despesas: 34.95 },
    { name: 'Mar', receitas: 0, despesas: 34.95 },
    { name: 'Abr', receitas: 0, despesas: 0 },
    { name: 'Mai', receitas: 0, despesas: 0 },
    { name: 'Jun', receitas: 0, despesas: 0 },
    { name: 'Jul', receitas: 0, despesas: 0 },
    { name: 'Ago', receitas: 0, despesas: 0 },
    { name: 'Set', receitas: 0, despesas: 0 },
    { name: 'Out', receitas: 0, despesas: 0 },
    { name: 'Nov', receitas: 0, despesas: 0 },
    { name: 'Dez', receitas: 0, despesas: 0 },
  ];

  return (
    <div className="flex-1 overflow-auto bg-background p-6 lg:p-8 flex justify-center">
      <div className="max-w-4xl w-full">

        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center mb-8 mt-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#1C1C21] border border-border rounded-lg shadow-sm">
              <CalendarIcon className="w-6 h-6 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Projeção Financeira</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Visualize suas finanças em qualquer período
          </p>
        </div>

        {/* Controles de Topo */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex bg-[#1C1C21] border border-border rounded-lg p-1">
            <button
              onClick={() => setDataMode("grafico")}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${dataMode === "grafico" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <BarChart2 className="w-4 h-4" /> Gráfico
            </button>
            <button
              onClick={() => setDataMode("tabela")}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${dataMode === "tabela" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Table className="w-4 h-4" /> Tabela
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-[#1C1C21] border border-border rounded-lg hover:bg-white/5 transition-colors">
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>

        {/* Toggle Mensal / Anual */}
        <div className="flex bg-[#1C1C21] border border-border rounded-xl p-1 mb-6">
          <button
            onClick={() => setViewMode("mensal")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${viewMode === "mensal" ? "bg-orange-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <CalendarIcon className="w-4 h-4" /> Mensal
          </button>
          <button
            onClick={() => setViewMode("anual")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${viewMode === "anual" ? "bg-orange-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <BarChart2 className="w-4 h-4" /> Anual
          </button>
        </div>

        {/* Navegador de Datas */}
        <div className="flex items-center justify-between bg-[#1C1C21] border border-border rounded-xl p-4 mb-6">
          <button onClick={handlePrev} className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          <div className="font-bold text-foreground">
            {viewMode === "mensal" ? getMonthLabel() : baseDate.getFullYear()}
          </div>
          <button onClick={handleNext} className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Próximo <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Placares Superiores (Dinâmico Mensal vs Anual) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#1C1C21] border border-emerald-500/20 rounded-xl p-5 hover:border-emerald-500/40 transition-colors">
            <span className="flex items-center gap-2 text-sm font-medium text-emerald-500/80 mb-2">
              <TrendingUp className="w-4 h-4" /> Total Receitas {viewMode === "anual" && baseDate.getFullYear()}
            </span>
            <span className="text-2xl font-bold text-emerald-500">{formatBRL(0)}</span>
          </div>
          <div className="bg-[#1C1C21] border border-red-500/20 rounded-xl p-5 hover:border-red-500/40 transition-colors">
            <span className="flex items-center gap-2 text-sm font-medium text-red-500/80 mb-2">
              <TrendingDown className="w-4 h-4" /> Total Despesas {viewMode === "anual" && baseDate.getFullYear()}
            </span>
            <span className="text-2xl font-bold text-red-500">{viewMode === "anual" ? formatBRL(69.90) : formatBRL(0)}</span>
          </div>
          <div className="bg-[#1C1C21] border border-orange-500/20 rounded-xl p-5 hover:border-orange-500/40 transition-colors">
            <span className="flex items-center gap-2 text-sm font-medium text-orange-500/80 mb-2">
              <Scale className="w-4 h-4" /> Saldo Projetado {viewMode === "anual" && baseDate.getFullYear()}
            </span>
            <span className="text-2xl font-bold text-orange-500">{viewMode === "anual" ? "-R$ 69,90" : formatBRL(0)}</span>
          </div>
        </div>

        {/* RENDERIZAÇÃO CONDICIONAL: MENSAL VS ANUAL */}
        {viewMode === "mensal" ? (
          <>
            {/* Lista de Saídas (Mensal) */}
            <div className="bg-[#1C1C21] border border-border rounded-xl mb-4 overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-border/50 bg-black/20">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <TrendingDown className="w-4 h-4 text-red-500" /> Saídas Previstas ⓘ
                </div>
                <span className="text-sm font-bold text-red-500">{formatBRL(resumo.saidas)}</span>
              </div>
              <div className="divide-y divide-border/50">
                <div className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-foreground">Faturas de Cartão</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{formatBRL(resumo.detalhes.faturasCartao)}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <Receipt className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-medium text-foreground">Contas a Pagar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{formatBRL(resumo.detalhes.contasPagar)}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <Landmark className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-foreground">Parcelas de Dívidas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{formatBRL(resumo.detalhes.parcelasDividas)}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Entradas (Mensal) */}
            <div className="bg-[#1C1C21] border border-border rounded-xl mb-6 overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-border/50 bg-black/20">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> Entradas Previstas ⓘ
                </div>
                <span className="text-sm font-bold text-emerald-500">{formatBRL(resumo.entradas)}</span>
              </div>
              <div className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-foreground">Contas a Receber</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{formatBRL(resumo.detalhes.contasReceber)}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Empty State de Projeção Mensal */}
            <div className="bg-[#1C1C21] border border-border rounded-xl p-8 flex flex-col items-center justify-center">
              <CalendarIcon className="w-10 h-10 text-muted-foreground opacity-50 mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">Nenhuma projeção disponível para {getMonthLabel()}</p>
              <p className="text-xs text-muted-foreground">Cadastre contas, dívidas ou cartões para visualizar a projeção</p>
            </div>
          </>
        ) : (
          <>
            {/* GRÁFICO ANUAL */}
            <div className="bg-[#1C1C21] border border-border rounded-xl p-6 mb-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2 mb-6">
                <BarChart2 className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold text-foreground">Projeção Anual - {baseDate.getFullYear()}</h2>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataAnual} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2c2c35" vertical={false} />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip
                      cursor={{ fill: '#2c2c35', opacity: 0.4 }}
                      contentStyle={{ backgroundColor: '#121214', borderColor: '#2c2c35', borderRadius: '8px', color: '#fff' }}
                      formatter={(value: any) => formatBRL(Number(value))}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="receitas" name="Receitas" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* GRID DE DETALHAMENTO MENSAL */}
            <div className="bg-[#1C1C21] border border-border rounded-xl p-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2 mb-6">
                <CalendarIcon className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold text-foreground">Detalhamento Mensal - {baseDate.getFullYear()}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dataAnual.map((mes, idx) => {
                  const saldo = mes.receitas - mes.despesas;
                  return (
                    <div key={idx} className="bg-background border border-border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-foreground">{mes.name}</span>
                        <span className={`text-sm font-bold ${saldo >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>
                          {saldo > 0 ? '+' : ''}{formatBRL(saldo)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Receitas
                          </span>
                          <span className="font-medium text-emerald-500">{formatBRL(mes.receitas)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div> Despesas
                          </span>
                          <span className="font-medium text-red-500">{formatBRL(mes.despesas)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}