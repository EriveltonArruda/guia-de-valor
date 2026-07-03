"use client";

import { useState } from "react";
import { Plus, TrendingUp, Target, BarChart3, Edit, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { InvestimentoModal } from "./InvestimentoModal";

// Cores para o gráfico de pizza dinâmico
const PIE_COLORS = ["#10b981", "#f97316", "#3b82f6", "#a855f7", "#eab308"];

export default function InvestimentosClient({ investimentos }: { investimentos: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ativos" | "encerrados">("ativos");

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // ==========================================
  // CÁLCULOS DINÂMICOS (Baseados no Array)
  // ==========================================

  // 1. Cálculos de Totais
  const totalInvestido = investimentos.reduce((acc, curr) => acc + Number(curr.valorInicial || 0), 0);
  const valorMercado = investimentos.reduce((acc, curr) => acc + Number(curr.valorAtual || 0), 0);
  const lucroPrejuizo = valorMercado - totalInvestido;
  const percentualRetorno = totalInvestido > 0 ? (lucroPrejuizo / totalInvestido) * 100 : 0;
  const metaTotal = investimentos.reduce((acc, curr) => acc + Number(curr.meta || 0), 0);

  // 2. Agrupamento para o Gráfico de Pizza (Por Tipo)
  const composicaoMap = investimentos.reduce((acc: any, curr) => {
    const tipo = curr.tipo || 'Outros';
    if (!acc[tipo]) acc[tipo] = 0;
    acc[tipo] += Number(curr.valorAtual || 0);
    return acc;
  }, {});

  let dataPie = Object.keys(composicaoMap).map(key => ({
    name: key,
    value: composicaoMap[key]
  }));

  // Fallback visual se não houver investimentos
  if (dataPie.length === 0) {
    dataPie = [{ name: "Sem investimentos", value: 1 }];
  }

  // 3. Gráfico de Linha (Normalmente vem de uma tabela de histórico do banco. Aqui deixaremos vazio por enquanto)
  const dataLine: any[] = [];

  return (
    <div className="flex-1 overflow-auto bg-background p-6 lg:p-8 flex justify-center">
      <div className="max-w-6xl w-full">

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1C1C21] border border-border rounded-lg shadow-sm">
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Investimentos</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-sm shadow-orange-500/20"
          >
            <Plus className="w-5 h-5" />
            Novo Investimento
          </button>
        </div>

        {/* Placares Superiores Dinâmicos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1C1C21] border border-border rounded-xl p-5">
            <span className="text-sm font-medium text-muted-foreground block mb-1">Valor Investido ⓘ</span>
            <span className="text-2xl font-bold text-foreground">{formatBRL(totalInvestido)}</span>
            <span className="text-xs text-muted-foreground block mt-1">Total aplicado</span>
          </div>
          <div className="bg-[#1C1C21] border border-border rounded-xl p-5">
            <span className="text-sm font-medium text-muted-foreground block mb-1">Valor de Mercado ⓘ</span>
            <span className="text-2xl font-bold text-orange-500">{formatBRL(valorMercado)}</span>
            <span className="text-xs text-muted-foreground block mt-1">Valor atual</span>
          </div>
          <div className="bg-[#1C1C21] border border-border rounded-xl p-5">
            <span className="text-sm font-medium text-muted-foreground block mb-1">Lucro/Prejuízo ⓘ</span>
            <span className={`text-2xl font-bold ${lucroPrejuizo >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {lucroPrejuizo >= 0 ? '+' : ''}{formatBRL(lucroPrejuizo)}
            </span>
            <span className={`text-xs block mt-1 ${lucroPrejuizo >= 0 ? 'text-emerald-500/80' : 'text-red-500/80'}`}>
              {percentualRetorno.toFixed(2)}% de retorno
            </span>
          </div>
          <div className="bg-[#1C1C21] border border-border rounded-xl p-5">
            <span className="text-sm font-medium text-muted-foreground block mb-1">Meta Total ⓘ</span>
            <span className="text-2xl font-bold text-foreground">{formatBRL(metaTotal)}</span>
          </div>
        </div>

        {/* Gráficos Dinâmicos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1C1C21] border border-border rounded-xl p-6 h-[350px] flex flex-col">
            <h3 className="text-sm font-bold text-foreground mb-4">Composição da Carteira por Tipo</h3>
            <div className="flex-1 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dataPie} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                    {dataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={investimentos.length === 0 ? "#2c2c35" : PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="text-sm font-bold text-orange-500">{formatBRL(valorMercado)}</span>
              </div>
            </div>

            {investimentos.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
                {dataPie.map((entry, idx) => (
                  <span key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></div>
                    {entry.name} <span className="text-muted-foreground ml-1">({((entry.value / valorMercado) * 100).toFixed(1)}%)</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#1C1C21] border border-border rounded-xl p-6 h-[350px] flex flex-col">
            <h3 className="text-sm font-bold text-foreground mb-4">Evolução do Patrimônio</h3>
            {dataLine.length > 0 ? (
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataLine} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2c2c35" vertical={false} />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#121214', borderColor: '#2c2c35', color: '#fff', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="value" stroke="#orange-500" strokeWidth={3} dot={{ r: 4, fill: '#orange-500', strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                <BarChart3 className="w-8 h-8 opacity-20 mb-2" />
                <span className="text-sm">Sem histórico suficiente</span>
              </div>
            )}
          </div>
        </div>

        {/* Abas Ativos / Encerrados */}
        <div className="flex bg-[#1C1C21] border border-border rounded-xl p-1 mb-6">
          <button onClick={() => setActiveTab("ativos")} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === "ativos" ? "bg-orange-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Ativos</button>
          <button onClick={() => setActiveTab("encerrados")} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === "encerrados" ? "bg-[#2c2c35] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Encerrados</button>
        </div>

        {/* Renderização Condicional da Lista de Investimentos */}
        {investimentos.length === 0 ? (
          <div className="bg-[#1C1C21]/50 border border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center">
            <Target className="w-12 h-12 text-muted-foreground opacity-30 mb-4" />
            <p className="text-foreground font-medium mb-1">Nenhum investimento encontrado</p>
            <p className="text-sm text-muted-foreground mb-6">Você ainda não possui investimentos {activeTab === "ativos" ? "ativos" : "encerrados"}.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500/10 hover:bg-orange-500 border border-orange-500/30 hover:border-orange-500 text-orange-500 hover:text-white px-5 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Adicionar Primeiro Investimento
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investimentos.map((inv, idx) => {
              const lucro = (inv.valorAtual || 0) - (inv.valorInicial || 0);
              const perc = inv.valorInicial > 0 ? (lucro / inv.valorInicial) * 100 : 0;

              return (
                <div key={idx} className="bg-[#1C1C21] border-2 border-transparent hover:border-orange-500/50 transition-all rounded-xl overflow-hidden flex flex-col">
                  {/* Header do Card */}
                  <div className="p-4 border-b border-border/50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-background flex items-center justify-center border border-border">
                          <BarChart3 className="w-4 h-4 text-orange-500" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground block">{inv.tipo || "Geral"}</span>
                          <span className="text-sm font-bold text-foreground">{inv.nome}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-muted-foreground hover:text-foreground"><Edit className="w-4 h-4" /></button>
                        <button className="text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between text-muted-foreground"><span>Valor Investido</span> <span className="text-foreground">{formatBRL(inv.valorInicial || 0)}</span></div>
                      <div className="flex justify-between text-muted-foreground"><span>Valor de Mercado</span> <span className="font-bold text-orange-500">{formatBRL(inv.valorAtual || 0)}</span></div>
                      <div className="flex justify-between text-muted-foreground mt-2 pt-2 border-t border-border/50">
                        <span>Lucro</span>
                        <span className={`font-bold ${lucro >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {lucro >= 0 ? '+' : ''}{formatBRL(lucro)} ({perc.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Botões do Card */}
                  <div className="p-4 bg-black/20 grid grid-cols-2 gap-2 mt-auto">
                    <button className="py-2 bg-[#2c2c35] hover:bg-[#3f3f4a] text-xs font-bold text-white rounded transition-colors">+ Aporte</button>
                    <button className="py-2 bg-[#2c2c35] hover:bg-[#3f3f4a] text-xs font-bold text-white rounded transition-colors">- Resgate</button>
                    <button className="py-2 bg-[#2c2c35] hover:bg-[#3f3f4a] text-xs font-bold text-white rounded transition-colors">📈 Rendimento</button>
                    <button className="py-2 bg-[#2c2c35] hover:bg-[#3f3f4a] text-xs font-bold text-white rounded transition-colors">🕒 Histórico</button>
                    <button className="col-span-2 mt-2 py-2.5 bg-orange-500/10 hover:bg-orange-500 border border-orange-500/30 hover:border-orange-500 text-orange-500 hover:text-white text-xs font-bold rounded transition-all">
                      Resgatar Tudo
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <InvestimentoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}