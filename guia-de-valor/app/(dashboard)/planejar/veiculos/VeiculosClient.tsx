"use client";

import { useState } from "react";
import { Plus, Car, CalendarClock, Wrench, Filter, Download, BarChart2, PieChart as PieChartIcon } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VeiculoModal } from "./VeiculoModal";

export default function VeiculosClient({ veiculos, agendadas, historico }: { veiculos: any[], agendadas: any[], historico: any[] }) {
  const [activeTab, setActiveTab] = useState<"veiculos" | "agendadas" | "historico">("veiculos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="flex-1 overflow-auto bg-background p-6 lg:p-8 flex justify-center">
      <div className="max-w-6xl w-full">

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Manutenções de Veículo
          </h1>
          {activeTab === "veiculos" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-sm shadow-orange-500/20"
            >
              <Plus className="w-5 h-5" />
              Novo Veículo
            </button>
          )}
        </div>

        {/* Navegação de Abas */}
        <div className="flex flex-col sm:flex-row bg-[#1C1C21] border border-border rounded-xl p-1 mb-8 gap-1">
          <button
            onClick={() => setActiveTab("veiculos")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === "veiculos" ? "bg-orange-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Car className="w-4 h-4" /> Veículos
          </button>
          <button
            onClick={() => setActiveTab("agendadas")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === "agendadas" ? "bg-orange-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <CalendarClock className="w-4 h-4" /> Manutenções Agendadas
          </button>
          <button
            onClick={() => setActiveTab("historico")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === "historico" ? "bg-orange-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Wrench className="w-4 h-4" /> Histórico de Manutenção
          </button>
        </div>

        {/* ================= ABA 1: VEÍCULOS ================= */}
        {activeTab === "veiculos" && (
          <div>
            {veiculos.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[40vh] border border-border/50 rounded-xl p-8 bg-[#1C1C21]/20 shadow-sm">
                <Car className="w-14 h-14 text-muted-foreground opacity-50 mb-4" />
                <h2 className="text-lg font-bold text-foreground mb-1">Nenhum veículo cadastrado</h2>
                <p className="text-muted-foreground text-sm font-medium mb-6 text-center">
                  Adicione seu primeiro veículo para começar a controlar as manutenções.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm shadow-orange-500/20"
                >
                  <Plus className="w-5 h-5" /> Adicionar Veículo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Renderização futura dos cards de veículos */}
              </div>
            )}
          </div>
        )}

        {/* ================= ABA 2: AGENDADAS ================= */}
        {activeTab === "agendadas" && (
          <div>
            {agendadas.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[40vh] border border-border/50 rounded-xl p-8 bg-[#1C1C21]/20 shadow-sm">
                <CalendarClock className="w-14 h-14 text-muted-foreground opacity-50 mb-4" />
                <h2 className="text-lg font-bold text-foreground mb-1">Nenhuma manutenção agendada</h2>
                <p className="text-muted-foreground text-sm font-medium text-center">
                  Você está com as manutenções em dia.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Renderização futura da lista de agendamentos */}
              </div>
            )}
          </div>
        )}

        {/* ================= ABA 3: HISTÓRICO ================= */}
        {activeTab === "historico" && (
          <div className="animate-in fade-in duration-300">
            {/* Filtros */}
            <div className="bg-[#1C1C21] border border-border rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <Filter className="w-4 h-4 text-orange-500" /> Filtros
                </div>
                <button className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-orange-500 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-lg transition-colors">
                  <Download className="w-4 h-4" /> Exportar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Veículo</label>
                  <Select defaultValue="todos"><SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todos">Todos os veículos</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Tipo de Veículo</label>
                  <Select defaultValue="todos"><SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todos">Todos os tipos</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">De</label>
                  <input type="date" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm color-scheme-dark outline-none focus:ring-1 focus:ring-orange-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Até</label>
                  <input type="date" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm color-scheme-dark outline-none focus:ring-1 focus:ring-orange-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">0 de 0 manutenção(ões)</p>
            </div>

            {/* Gráficos (Empty State estruturado) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-[#1C1C21] border border-border rounded-xl p-6 h-[300px] flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold text-foreground">Gastos por mês</h3>
                </div>
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                  Sem dados para exibir
                </div>
              </div>
              <div className="bg-[#1C1C21] border border-border rounded-xl p-6 h-[300px] flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <PieChartIcon className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold text-foreground">Gastos por veículo</h3>
                </div>
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                  Sem dados para exibir
                </div>
              </div>
            </div>

            {/* Lista de Histórico */}
            <div className="bg-[#1C1C21] border border-border rounded-xl p-8 flex flex-col items-center justify-center shadow-sm">
              <Wrench className="w-10 h-10 text-muted-foreground opacity-50 mb-3" />
              <p className="text-sm font-medium text-foreground">Nenhum histórico encontrado.</p>
            </div>
          </div>
        )}

      </div>

      <VeiculoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}