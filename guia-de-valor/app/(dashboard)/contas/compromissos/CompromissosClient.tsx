"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, CreditCard } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterType = "Esta Semana" | "Próxima Semana" | "Este Mês" | "Próximos 7 dias" | "Próximos 15 dias" | "Próximos 30 dias";

export default function CompromissosClient({ transacoes = [], cartoes = [] }: { transacoes: any[], cartoes: any[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("Este Mês");
  const [baseDate, setBaseDate] = useState<Date>(new Date());
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());

  const filters: FilterType[] = ["Esta Semana", "Próxima Semana", "Este Mês", "Próximos 7 dias", "Próximos 15 dias", "Próximos 30 dias"];
  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const getPeriodLabel = () => {
    const monthName = baseDate.toLocaleString('pt-BR', { month: 'long' });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    if (activeFilter.includes("Semana") || activeFilter.includes("dias")) {
      return `01 De ${capitalizedMonth.substring(0, 3)} - 07 De ${capitalizedMonth.substring(0, 3)}`;
    }
    return `${capitalizedMonth} De ${baseDate.getFullYear()}`;
  };

  const getNavigationLabels = () => {
    if (activeFilter === "Este Mês") return { prev: "Mês Anterior", next: "Próximo Mês" };
    return { prev: "Anterior", next: "Próxima" };
  };

  const navLabels = getNavigationLabels();

  const handlePrev = () => {
    const newDate = new Date(baseDate);
    if (activeFilter === "Este Mês") newDate.setMonth(newDate.getMonth() - 1);
    else newDate.setDate(newDate.getDate() - 7);
    setBaseDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(baseDate);
    if (activeFilter === "Este Mês") newDate.setMonth(newDate.getMonth() + 1);
    else newDate.setDate(newDate.getDate() + 7);
    setBaseDate(newDate);
  };

  // 🚀 MOTOR DE INTELIGÊNCIA DE DATAS (FILTRAGEM REAL DO BANCO)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dynamicFilteredTransactions = transacoes.filter((tx: any) => {
    const txDate = new Date(tx.date);

    // Regra 1: Se o compromisso estiver PENDENTE e ATRASADO, ele sempre deve aparecer para cobrar o usuário
    if (txDate < today) return true;

    // Janelas de cálculo de datas
    const startOfBaseMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    const endOfBaseMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0, 23, 59, 59);

    const diffTime = txDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (activeFilter === "Este Mês") {
      return txDate >= startOfBaseMonth && txDate <= endOfBaseMonth;
    }
    if (activeFilter === "Próximos 7 dias") return diffDays >= 0 && diffDays <= 7;
    if (activeFilter === "Próximos 15 dias") return diffDays >= 0 && diffDays <= 15;
    if (activeFilter === "Próximos 30 dias") return diffDays >= 0 && diffDays <= 30;
    if (activeFilter === "Esta Semana") return diffDays >= 0 && diffDays <= 7;
    if (activeFilter === "Próxima Semana") return diffDays > 7 && diffDays <= 14;

    return false;
  });

  // 🚀 AGRUPAMENTO DINÂMICO POR DIA DO CALENDÁRIO
  const groupsMap: { [key: string]: { dateLabel: string; isLate: boolean; items: any[]; rawDate: Date } } = {};

  dynamicFilteredTransactions.forEach((tx: any) => {
    const txDate = new Date(tx.date);
    const dateKey = `${txDate.getFullYear()}-${txDate.getMonth()}-${txDate.getDate()}`;

    if (!groupsMap[dateKey]) {
      const dayName = txDate.toLocaleString('pt-BR', { weekday: 'long' });
      const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      const monthName = txDate.toLocaleString('pt-BR', { month: 'long' });
      const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

      groupsMap[dateKey] = {
        dateLabel: `${capitalizedDay}, ${txDate.getDate()} De ${capitalizedMonth}`,
        isLate: txDate < today,
        items: [],
        rawDate: txDate
      };
    }

    groupsMap[dateKey].items.push({
      id: tx.id,
      title: tx.description.replace("\n[Recorrente]", ""),
      amount: formatBRL(tx.amount),
      type: tx.creditCardId ? "Fatura Cartão" : (tx.category?.name || "Conta / Despesa")
    });
  });

  // Ordena os grupos por data (as mais antigas/atrasadas aparecem no topo)
  const sortedGroups = Object.values(groupsMap).sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());

  return (
    <div className="flex-1 overflow-auto bg-background p-6 lg:p-8 flex justify-center">
      <div className="max-w-4xl w-full">

        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center mb-10 mt-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#1C1C21] border border-border rounded-lg shadow-sm">
              <CalendarIcon className="w-6 h-6 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Compromissos</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Visualize todos os seus compromissos financeiros em um só lugar
          </p>
        </div>

        {/* Filtro Dropdown dinâmico com a quantidade real de itens */}
        <div className="mb-6 w-full max-w-[240px]">
          <Select value={activeFilter} onValueChange={(val: FilterType) => setActiveFilter(val)}>
            <SelectTrigger className="w-full bg-[#1C1C21] border-border text-foreground h-11">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Selecione..." />
                <Badge variant="secondary" className="ml-1 bg-muted/50 text-muted-foreground rounded-full px-2 py-0.5 text-[10px]">
                  {dynamicFilteredTransactions.length}
                </Badge>
              </div>
            </SelectTrigger>
            <SelectContent>
              {filters.map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Navegador de Data */}
        <div className="flex items-center justify-between bg-[#1C1C21] border border-border rounded-xl p-4 mb-6">
          <button onClick={handlePrev} className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            {navLabels.prev}
          </button>

          <div className="flex items-center gap-2 font-bold text-foreground">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            {getPeriodLabel()}
          </div>

          <button onClick={handleNext} className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {navLabels.next}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Área de Listagem 100% Dinâmica */}
        {sortedGroups.length === 0 ? (
          <div className="bg-[#1C1C21] border border-border rounded-xl p-16 flex flex-col items-center justify-center mb-6">
            <CalendarIcon className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-1">Nenhum compromisso encontrado</h3>
            <p className="text-sm text-muted-foreground">Você não tem compromissos pendentes para o período selecionado.</p>
          </div>
        ) : (
          <div className="mb-6 space-y-6">
            {sortedGroups.map((group, idx) => (
              <div
                key={idx}
                className={`rounded-xl border ${group.isLate ? 'border-red-500/20 bg-red-950/5' : 'border-transparent'}`}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    {group.dateLabel}
                  </div>
                  {group.isLate && (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white border-none px-3 py-0.5">
                      Atrasado
                    </Badge>
                  )}
                </div>

                <div className="px-4 pb-4 space-y-3">
                  {group.items.map((item, i) => (
                    <div key={i} className="bg-[#1C1C21] border border-border rounded-xl p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                          <CreditCard className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">{item.title}</h4>
                          <p className="text-sm font-semibold text-foreground mt-0.5">{item.amount}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="bg-background text-muted-foreground border-border rounded-md font-normal text-xs py-1 px-3">
                          {item.type}
                        </Badge>
                        <button className="flex items-center gap-2 bg-background hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500/30 text-foreground border border-border rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                          <CheckCircle2 className="w-4 h-4" />
                          Pagar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Calendário Inferior */}
        <div className="bg-[#1C1C21] border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 text-foreground font-bold mb-1">
            <CalendarIcon className="w-5 h-5 text-orange-500" />
            Calendário de Compromissos
          </div>
          <p className="text-sm text-muted-foreground mb-6">Clique em um dia para navegar até seus compromissos</p>

          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <span className="text-xs text-muted-foreground font-medium">Atrasado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <span className="text-xs text-muted-foreground font-medium">Vence hoje</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500/80"></div>
              <span className="text-xs text-muted-foreground font-medium">A vencer</span>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-background border border-border rounded-xl p-3 inline-block">
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={setCalendarDate}
                className="rounded-md"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}