"use client";

import { useState } from "react";
import {
  Download, Filter, TrendingUp, TrendingDown, Wallet, Target,
  Lightbulb, CreditCard, LayoutDashboard, Trophy, PieChart, BarChart3, Plus
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function RelatoriosClient({ dados }: { dados: any[] }) {
  const [activeTab, setActiveTab] = useState<"geral" | "despesas" | "receitas">("geral");
  const [visaoCategoria, setVisaoCategoria] = useState("completa");

  // Datas fixadas para o mês de Julho de 2026 (conforme o print)
  const [dataInicio, setDataInicio] = useState("2026-07-01");
  const [dataFim, setDataFim] = useState("2026-07-31");

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Dados zerados para forçar a renderização dos grids do Recharts
  const emptyChartData = [{ name: 'jul/26', receitas: 0, despesas: 0, saldo: 0 }];

  return (
    <div className="flex-1 overflow-auto bg-background p-6 lg:p-8 flex justify-center">
      <div className="max-w-6xl w-full">

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-[#1C1C21] border border-border rounded-lg hover:bg-white/5 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Exportar Relatório
          </button>
        </div>

        {/* Filtro de Período */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
            <Filter className="w-4 h-4" /> Período
          </div>
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 flex items-center gap-2 bg-[#1C1C21] border border-border rounded-lg p-1.5">
              <span className="text-xs text-muted-foreground pl-2 w-12">Início</span>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="flex-1 bg-transparent border-none text-sm color-scheme-dark outline-none p-2"
              />
            </div>
            <div className="flex-1 flex items-center gap-2 bg-[#1C1C21] border border-border rounded-lg p-1.5">
              <span className="text-xs text-muted-foreground pl-2 w-12">Fim</span>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="flex-1 bg-transparent border-none text-sm color-scheme-dark outline-none p-2"
              />
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-sm h-[52px]">
              Filtrar
            </button>
          </div>
        </div>

        {/* Abas Principais */}
        <div className="flex bg-[#1C1C21] border border-border rounded-xl p-1 mb-8 w-fit gap-1">
          <button
            onClick={() => setActiveTab("geral")}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === "geral" ? "bg-orange-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Geral
          </button>
          <button
            onClick={() => setActiveTab("despesas")}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === "despesas" ? "bg-[#2c2c35] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <TrendingDown className="w-4 h-4 text-red-400" /> Despesas
          </button>
          <button
            onClick={() => setActiveTab("receitas")}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === "receitas" ? "bg-[#2c2c35] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Receitas
          </button>
        </div>

        {/* ================= ABA 1: GERAL ================= */}
        {activeTab === "geral" && (
          <div className="animate-in fade-in duration-300 space-y-6">

            {/* KPIs Geral */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#1C1C21] border border-emerald-500/20 rounded-xl p-5 border-l-4 border-l-emerald-500">
                <span className="flex items-center gap-2 text-xs font-bold text-emerald-500/80 mb-2 uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4" /> Receitas Totais ⓘ
                </span>
                <span className="text-2xl font-bold text-emerald-500">{formatBRL(0)}</span>
              </div>
              <div className="bg-[#1C1C21] border border-red-500/20 rounded-xl p-5 border-l-4 border-l-red-500">
                <span className="flex items-center gap-2 text-xs font-bold text-red-500/80 mb-2 uppercase tracking-wider">
                  <TrendingDown className="w-4 h-4" /> Despesas Totais ⓘ
                </span>
                <span className="text-2xl font-bold text-red-500">{formatBRL(0)}</span>
                <span className="text-[10px] text-muted-foreground block mt-1">Saídas da conta, incluindo fatura cartões paga</span>
              </div>
              <div className="bg-[#1C1C21] border border-blue-500/20 rounded-xl p-5 border-l-4 border-l-blue-500">
                <span className="flex items-center gap-2 text-xs font-bold text-blue-500/80 mb-2 uppercase tracking-wider">
                  <Wallet className="w-4 h-4" /> Saldo do Período ⓘ
                </span>
                <span className="text-2xl font-bold text-blue-500">{formatBRL(0)}</span>
              </div>
              <div className="bg-[#1C1C21] border border-orange-500/20 rounded-xl p-5 border-l-4 border-l-orange-500">
                <span className="flex items-center gap-2 text-xs font-bold text-orange-500/80 mb-2 uppercase tracking-wider">
                  <Target className="w-4 h-4" /> Taxa de Economia ⓘ
                </span>
                <span className="text-2xl font-bold text-orange-500">0.0%</span>
              </div>
            </div>

            {/* Gráfico Receitas vs Despesas */}
            <div className="bg-[#1C1C21] border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-5 h-5 text-orange-500" />
                <h3 className="text-base font-bold text-foreground">Receitas vs Despesas</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-6">Período selecionado</p>

              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emptyChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2c2c35" vertical={false} />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={() => ''} domain={[0, 4]} />
                    <Tooltip cursor={{ fill: '#2c2c35', opacity: 0.4 }} contentStyle={{ backgroundColor: '#121214', borderColor: '#2c2c35' }} />
                    <Bar dataKey="receitas" name="Receitas" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 text-xs text-muted-foreground mt-2">
                <span className="flex items-center gap-2"><div className="w-3 h-2 bg-emerald-500"></div> Receitas</span>
                <span className="flex items-center gap-2"><div className="w-3 h-2 bg-red-500"></div> Despesas</span>
              </div>
            </div>

            {/* Categorias (Despesas & Receitas) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#1C1C21] border border-border rounded-xl p-6 flex flex-col h-[280px]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <PieChart className="w-5 h-5 text-red-500" />
                      <h3 className="text-base font-bold text-foreground">Despesas por Categoria</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">01/07 - 31/07 • Total: R$ 0,00</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Conta + cartão juntos, sem duplicar fatura 📊</p>
                  </div>
                  <Select value={visaoCategoria} onValueChange={setVisaoCategoria}>
                    <SelectTrigger className="w-[160px] h-8 text-xs bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completa">Visão Completa 📊</SelectItem>
                      <SelectItem value="conta">Só Conta 🏦</SelectItem>
                      <SelectItem value="cartoes">Só Cartões 💳</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                  Nenhuma categoria no período.
                </div>
              </div>

              <div className="bg-[#1C1C21] border border-border rounded-xl p-6 flex flex-col h-[280px]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <PieChart className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-base font-bold text-foreground">Receitas por Categoria</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">01/07 - 31/07 • Total: R$ 0,00</p>
                </div>
                <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                  Nenhuma categoria no período.
                </div>
              </div>
            </div>

            {/* Gráfico Evolução Mensal */}
            <div className="bg-[#1C1C21] border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-bold text-foreground">Evolução Mensal</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-6">Saldo mês a mês no período selecionado</p>

              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={emptyChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2c2c35" vertical={false} />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={() => ''} domain={[0, 4]} />
                    <Tooltip contentStyle={{ backgroundColor: '#121214', borderColor: '#2c2c35' }} />
                    <Line type="monotone" dataKey="receitas" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 text-xs text-muted-foreground mt-2">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full border border-emerald-500"></div> Receitas</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full border border-red-500"></div> Despesas</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full border border-blue-500"></div> Saldo</span>
              </div>
            </div>

            {/* Metas e Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#1C1C21] border border-border rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px]">
                <div className="w-full flex items-center gap-2 mb-6">
                  <Target className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-base font-bold text-foreground">Metas Financeiras</h3>
                </div>
                <Target className="w-10 h-10 text-muted-foreground opacity-30 mb-3" />
                <p className="text-sm text-muted-foreground mb-4">Nenhuma meta ativa</p>
                <button className="bg-background border border-border hover:bg-white/5 text-foreground px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Criar Meta
                </button>
              </div>

              <div className="bg-[#1C1C21] border border-border rounded-xl p-6 flex flex-col min-h-[200px]">
                <div className="flex items-center gap-2 mb-6">
                  <Lightbulb className="w-5 h-5 text-orange-400" />
                  <h3 className="text-base font-bold text-foreground">Insights Financeiros</h3>
                </div>
                <div className="flex items-start gap-3 bg-background border border-border rounded-lg p-4">
                  <Lightbulb className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-muted-foreground">Continue registrando suas transações para receber insights personalizados.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= ABA 2: DESPESAS ================= */}
        {activeTab === "despesas" && (
          <div className="animate-in fade-in duration-300 space-y-6">

            {/* KPIs Despesas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#2A1616] border border-red-900/50 rounded-xl p-5 hover:bg-[#331b1b] transition-colors cursor-pointer group">
                <span className="flex items-center gap-2 text-xs font-bold text-red-400/80 mb-2 uppercase tracking-wider">
                  <Wallet className="w-4 h-4" /> Despesas Gerais ⓘ
                </span>
                <span className="text-2xl font-bold text-red-500 mb-1">{formatBRL(0)}</span>
                <span className="text-[10px] text-muted-foreground block mb-3">Saídas da conta, incluindo fatura cartões paga</span>
                <span className="text-xs text-orange-500 font-medium group-hover:underline">👆 Clique para ver por categoria</span>
              </div>
              <div className="bg-[#1F1533] border border-purple-900/50 rounded-xl p-5 hover:bg-[#261a3e] transition-colors cursor-pointer group">
                <span className="flex items-center gap-2 text-xs font-bold text-purple-400/80 mb-2 uppercase tracking-wider">
                  <CreditCard className="w-4 h-4" /> Compras no Cartão ⓘ
                </span>
                <span className="text-2xl font-bold text-purple-400 mb-1">{formatBRL(0)}</span>
                <span className="text-[10px] text-muted-foreground block mb-3">Compras à vista e parcelas no crédito</span>
                <span className="text-xs text-orange-500 font-medium group-hover:underline">👆 Clique para ver por categoria</span>
              </div>
              <div className="bg-[#2A2411] border border-yellow-900/50 rounded-xl p-5 hover:bg-[#332b15] transition-colors cursor-pointer group">
                <span className="flex items-center gap-2 text-xs font-bold text-yellow-500/80 mb-2 uppercase tracking-wider">
                  <Target className="w-4 h-4" /> Total que você gastou ⓘ
                </span>
                <span className="text-2xl font-bold text-yellow-500 mb-1">{formatBRL(0)}</span>
                <span className="text-[10px] text-muted-foreground block mb-3">Conta + cartão juntos, fatura paga ou não</span>
                <span className="text-xs text-orange-500 font-medium group-hover:underline">👆 Clique para ver por categoria</span>
              </div>
            </div>

            {/* Despesas por Categoria */}
            <div className="bg-[#1C1C21] border border-border rounded-xl p-6 flex flex-col h-[300px]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <PieChart className="w-5 h-5 text-red-500" />
                    <h3 className="text-base font-bold text-foreground">Despesas por Categoria</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">01/07 - 31/07 • Total: R$ 0,00</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Conta + cartão juntos, sem duplicar fatura 📊</p>
                </div>
                <Select value={visaoCategoria} onValueChange={setVisaoCategoria}>
                  <SelectTrigger className="w-[160px] h-8 text-xs bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completa">Visão Completa 📊</SelectItem>
                    <SelectItem value="conta">Só Conta 🏦</SelectItem>
                    <SelectItem value="cartoes">Só Cartões 💳</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                Nenhuma categoria no período.
              </div>
            </div>

            {/* Ranking */}
            <div className="bg-[#1C1C21] border border-border rounded-xl p-6 flex flex-col h-[300px]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  <h3 className="text-base font-bold text-foreground">Ranking das Maiores Despesas ⓘ</h3>
                </div>
                <p className="text-xs text-muted-foreground">01/07 - 31/07 • 0 despesas</p>
              </div>
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                Nenhuma despesa no período.
              </div>
            </div>

          </div>
        )}

        {/* ================= ABA 3: RECEITAS ================= */}
        {activeTab === "receitas" && (
          <div className="animate-in fade-in duration-300 space-y-6">

            {/* KPIs Receitas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#132A1F] border border-emerald-900/50 rounded-xl p-5 hover:bg-[#183527] transition-colors">
                <span className="flex items-center gap-2 text-xs font-bold text-emerald-500/80 mb-2 uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4" /> Total de Receitas ⓘ
                </span>
                <span className="text-2xl font-bold text-emerald-500 mb-1">{formatBRL(0)}</span>
                <span className="text-[10px] text-muted-foreground block mb-1">Soma de todas as entradas no período</span>
              </div>
              <div className="bg-[#152033] border border-blue-900/50 rounded-xl p-5 hover:bg-[#1a2840] transition-colors">
                <span className="flex items-center gap-2 text-xs font-bold text-blue-400/80 mb-2 uppercase tracking-wider">
                  <LayoutDashboard className="w-4 h-4" /> Média Mensal ⓘ
                </span>
                <span className="text-2xl font-bold text-blue-400 mb-1">{formatBRL(0)}</span>
                <span className="text-[10px] text-muted-foreground block mb-1">Baseado em 1 mês</span>
              </div>
              <div className="bg-[#2A2111] border border-orange-900/50 rounded-xl p-5 hover:bg-[#332815] transition-colors">
                <span className="flex items-center gap-2 text-xs font-bold text-orange-500/80 mb-2 uppercase tracking-wider">
                  <Trophy className="w-4 h-4" /> Maior Receita ⓘ
                </span>
                <span className="text-2xl font-bold text-orange-500 mb-1">{formatBRL(0)}</span>
                <span className="text-[10px] text-muted-foreground block mb-1">Nenhuma receita no período</span>
              </div>
            </div>

            {/* Receitas por Categoria */}
            <div className="bg-[#1C1C21] border border-border rounded-xl p-6 flex flex-col h-[300px]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-base font-bold text-foreground">Receitas por Categoria</h3>
                </div>
                <p className="text-xs text-muted-foreground">01/07 - 31/07 • Total: R$ 0,00</p>
              </div>
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                Nenhuma receita categorizada no período.
              </div>
            </div>

            {/* Ranking */}
            <div className="bg-[#1C1C21] border border-border rounded-xl p-6 flex flex-col h-[300px]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  <h3 className="text-base font-bold text-foreground">Ranking das Maiores Receitas ⓘ</h3>
                </div>
                <p className="text-xs text-muted-foreground">01/07 - 31/07 • 0 receitas</p>
              </div>
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                Nenhuma receita no período.
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}