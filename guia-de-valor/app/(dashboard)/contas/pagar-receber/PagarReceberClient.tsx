"use client";

import { useState } from "react";
import { Plus, Search, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Tags } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ContaModal } from "./ContaModal";

type MainTab = "A Pagar" | "A Receber" | "Histórico";

export default function PagarReceberClient({ transacoes = [], categorias = [] }: { transacoes: any[], categorias: any[] }) {
  const [activeTab, setActiveTab] = useState<MainTab>("A Pagar");
  const [baseDate, setBaseDate] = useState<Date>(new Date());

  // 🚀 Controle do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalAPagar = 0;
  const totalAReceber = 0;

  const getMonthLabel = () => {
    const monthName = baseDate.toLocaleString('pt-BR', { month: 'long' });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    const isCurrentMonth = baseDate.getMonth() === new Date().getMonth() && baseDate.getFullYear() === new Date().getFullYear();

    return (
      <>
        {capitalizedMonth} {baseDate.getFullYear()}
        {isCurrentMonth && <span className="text-muted-foreground font-normal ml-2 text-sm">(Mês Atual)</span>}
      </>
    );
  };

  const handlePrevMonth = () => {
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setBaseDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setBaseDate(newDate);
  };

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="flex-1 overflow-auto bg-background p-6 lg:p-8 flex justify-center">
      <div className="max-w-5xl w-full">

        {/* Header e Botão */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-muted-foreground font-mono text-xl">📄</span> Contas a Pagar/Receber
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Gerencie suas contas mensais e fluxo de caixa
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm shadow-orange-500/20 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Nova Conta
          </button>
        </div>

        {/* Placares Superiores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#1C1C21] border border-red-500/20 rounded-xl p-5 hover:border-red-500/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Total a Pagar (junho 2026)</span>
            </div>
            <span className="text-2xl font-bold text-red-500">{formatBRL(totalAPagar)}</span>
          </div>
          <div className="bg-[#1C1C21] border border-orange-500/20 rounded-xl p-5 hover:border-orange-500/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Total a Receber (junho 2026)</span>
            </div>
            <span className="text-2xl font-bold text-orange-500">{formatBRL(totalAReceber)}</span>
          </div>
        </div>

        {/* Barra de Busca e Categorias */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por descrição ou observações..."
              className="w-full bg-[#1C1C21] border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-orange-500 outline-none transition-all"
            />
          </div>
          <div className="w-full md:w-56">
            <Select defaultValue="all">
              <SelectTrigger className="w-full bg-[#1C1C21] border-border text-foreground h-10">
                <div className="flex items-center gap-2">
                  <Tags className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Todas categorias" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {categorias.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros Secundários */}
        <div className="flex items-center gap-3 mb-6">
          <Badge className="bg-orange-500 text-white hover:bg-orange-600 px-3 py-1 text-xs cursor-pointer flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" /> Mês
          </Badge>
          <Badge variant="outline" className="bg-[#1C1C21] text-muted-foreground border-border hover:bg-white/5 px-3 py-1 text-xs cursor-pointer flex items-center gap-1">
            <span className="text-[10px]">☰</span> Todas
          </Badge>
        </div>

        {/* Navegador de Meses */}
        <div className="flex items-center justify-between bg-[#1C1C21] border border-border rounded-xl p-4 mb-6">
          <button onClick={handlePrevMonth} className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          <div className="flex items-center gap-2 font-bold text-foreground">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            {getMonthLabel()}
          </div>

          <button onClick={handleNextMonth} className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Próximo
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filtros de Status */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge className="bg-orange-500 text-white hover:bg-orange-600 px-4 py-1.5 cursor-pointer">Todas</Badge>
          <Badge variant="outline" className="bg-[#1C1C21] text-muted-foreground border-border hover:text-foreground px-4 py-1.5 cursor-pointer flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div> Vencidas
          </Badge>
          <Badge variant="outline" className="bg-[#1C1C21] text-muted-foreground border-border hover:text-foreground px-4 py-1.5 cursor-pointer flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div> Hoje
          </Badge>
          <Badge variant="outline" className="bg-[#1C1C21] text-muted-foreground border-border hover:text-foreground px-4 py-1.5 cursor-pointer flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div> A Vencer
          </Badge>
          <Badge variant="outline" className="bg-[#1C1C21] text-muted-foreground border-border hover:text-foreground px-4 py-1.5 cursor-pointer flex items-center gap-2">
            <span className="text-blue-400">↻</span> Recorrentes
          </Badge>
        </div>

        {/* Abas Principais */}
        <div className="flex items-center gap-2 p-1 bg-[#1C1C21] border border-border rounded-xl mb-6">
          {(["A Pagar", "A Receber", "Histórico"] as MainTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === tab
                ? "bg-orange-500 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Área de Listagem */}
        <div className="bg-[#1C1C21] border border-border rounded-xl min-h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm font-medium">Nenhuma conta {activeTab.toLowerCase()} cadastrada</p>
        </div>

      </div>

      {/* Renderiza o Modal oculto, esperando o clique */}
      <ContaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categorias={categorias}
      />

    </div>
  );
}