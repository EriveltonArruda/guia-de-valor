"use client";

import { useState } from "react";
import { Plus, Wallet, CreditCard, Pencil, Trash2, Cpu, Wifi, Receipt, ChevronLeft, ChevronRight, CalendarDays, ShoppingCart, ReceiptText, RefreshCw, BarChart3 } from "lucide-react";
import { CreditCardModal } from "./CreditCardModal";
import { CreditCardTransactionModal } from "./CreditCardTransactionModal";
import { deleteCreditCardAction } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function CartoesClient({ cartoes, categories }: { cartoes: any[], categories: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<any | null>(null);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionCardId, setTransactionCardId] = useState<string>("");

  const [activeTab, setActiveTab] = useState("Meus Cartões");
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());

  const [categoryPeriod, setCategoryPeriod] = useState("6m");

  const { toast } = useToast();

  async function handleDelete(id: string) {
    const res = await deleteCreditCardAction(id);
    if (res.ok) {
      toast({
        title: "Cartão excluído",
        description: "O cartão foi removido com sucesso.",
        variant: "default",
      });
    } else {
      toast({
        title: "Erro",
        description: res.error || "Houve uma falha na exclusão.",
        variant: "destructive",
      });
    }
  }

  const tabs = ["Meus Cartões", "Faturas", "Recorrentes", "Gastos/Categorias"];

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  let limiteTotalGeral = 0;
  let utilizadoTotalGeral = 0;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Processamento de dados e identificação de compras recorrentes
  const allRecurringTransactions: any[] = [];
  const allTransactions: any[] = [];

  const processedCards = cartoes.map(card => {
    const transactions = card.transactions || [];

    const utilizado = transactions
      .filter((t: any) => t.status === "PENDING" && t.type === "EXPENSE")
      .reduce((acc: number, t: any) => acc + t.amount, 0);

    const closingDay = card.closingDay || 1;
    const startPeriod = new Date(currentYear, currentMonth - 1, closingDay + 1);
    const endPeriod = new Date(currentYear, currentMonth, closingDay, 23, 59, 59, 999);

    const faturaMes = transactions
      .filter((t: any) => {
        if (t.status !== "PENDING" || t.type !== "EXPENSE") return false;
        const d = new Date(t.date);
        return d >= startPeriod && d <= endPeriod;
      })
      .reduce((acc: number, t: any) => acc + t.amount, 0);

    // Coleta as compras para processamento
    transactions.forEach((t: any) => {
      allTransactions.push(t);
      if (t.description.includes("[Recorrente]")) {
        const baseDesc = t.description.replace("\n[Recorrente]", "").trim();
        if (!allRecurringTransactions.some(rt => rt.description === baseDesc && rt.cardId === card.id)) {
          allRecurringTransactions.push({
            ...t,
            description: baseDesc,
            cardName: card.name,
            cardId: card.id,
            cardColor: card.color
          });
        }
      }
    });

    limiteTotalGeral += card.limit;
    utilizadoTotalGeral += utilizado;

    const percentUsed = card.limit > 0 ? Math.min((utilizado / card.limit) * 100, 100) : 0;
    const disponivel = Math.max(card.limit - utilizado, 0);

    return { ...card, utilizado, faturaMes, percentUsed, disponivel };
  });

  const disponivelTotalGeral = Math.max(limiteTotalGeral - utilizadoTotalGeral, 0);

  // 🚀 LÓGICA DO GRÁFICO MENSAL (Últimos 6 meses)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return { month: d.getMonth(), year: d.getFullYear(), label: d.toLocaleString('pt-BR', { month: 'short' }).toUpperCase() };
  }).reverse();

  const monthlyChartData = last6Months.map(m => {
    const total = allTransactions.reduce((acc, t) => {
      const d = new Date(t.date);
      if (d.getMonth() === m.month && d.getFullYear() === m.year && t.type === 'EXPENSE') {
        return acc + t.amount;
      }
      return acc;
    }, 0);
    return { name: m.label, total };
  });

  // 🚀 LÓGICA DO GRÁFICO DE CATEGORIAS
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - parseInt(categoryPeriod.replace('m', '')));

  const categoryDataMap = new Map();
  allTransactions.forEach(t => {
    const d = new Date(t.date);
    if (d >= cutoffDate && t.type === 'EXPENSE') {
      const catName = t.category?.name || "Outros";
      categoryDataMap.set(catName, (categoryDataMap.get(catName) || 0) + t.amount);
    }
  });

  const categoryChartData = Array.from(categoryDataMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  function renderFaturasTab() {
    const invoiceMonth = invoiceDate.getMonth();
    const invoiceYear = invoiceDate.getFullYear();
    const selectedCard = processedCards.find(c => c.id === selectedCardId) || processedCards[0];

    if (!selectedCard) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <ReceiptText className="w-12 h-12 mb-4 opacity-20" />
          <p>Nenhum cartão cadastrado para visualizar faturas.</p>
        </div>
      );
    }

    const closingDay = selectedCard.closingDay || 1;
    const dueDay = selectedCard.dueDay || 1;

    const startPeriod = new Date(invoiceYear, invoiceMonth - 1, closingDay + 1);
    const endPeriod = new Date(invoiceYear, invoiceMonth, closingDay, 23, 59, 59, 999);

    const dueDate = new Date(invoiceYear, invoiceMonth, dueDay);
    if (dueDay < closingDay) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }

    const cardTransactions = selectedCard.transactions || [];
    const invoiceTransactions = cardTransactions.filter((t: any) => {
      if (t.type !== "EXPENSE") return false;
      const d = new Date(t.date);
      return d >= startPeriod && d <= endPeriod;
    }).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalInvoice = invoiceTransactions.reduce((acc: number, t: any) => acc + t.amount, 0);
    const totalPaid = invoiceTransactions.filter((t: any) => t.status === "PAID").reduce((acc: number, t: any) => acc + t.amount, 0);

    const monthName = invoiceDate.toLocaleString('pt-BR', { month: 'long' });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    const cardColor = selectedCard.color || "#8B5CF6";

    const today = new Date();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    let isFechada = false;
    if (invoiceYear < todayYear || (invoiceYear === todayYear && invoiceMonth < todayMonth)) {
      isFechada = true;
    } else if (invoiceYear === todayYear && invoiceMonth === todayMonth) {
      isFechada = today.getDate() >= closingDay;
    } else {
      isFechada = false;
    }

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 max-w-sm">
          <label className="text-sm font-medium text-foreground">Selecione o cartão para ver a fatura:</label>
          <Select value={selectedCard.id} onValueChange={setSelectedCardId}>
            <SelectTrigger className="w-full bg-[#1C1C21] border-border text-foreground">
              <SelectValue placeholder="Escolha o cartão" />
            </SelectTrigger>
            <SelectContent>
              {processedCards.map((c: any) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} (final {c.lastFourDigits || "****"})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col items-center justify-center py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setInvoiceDate(new Date(invoiceDate.setMonth(invoiceDate.getMonth() - 1)))}
              className="p-2 bg-[#1C1C21] hover:bg-[#25252B] rounded-full transition-colors border border-border"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="text-center w-48">
              <h3 className="text-lg font-bold text-foreground">Fatura {capitalizedMonth} {invoiceYear}</h3>
            </div>
            <button
              onClick={() => setInvoiceDate(new Date(invoiceDate.setMonth(invoiceDate.getMonth() + 1)))}
              className="p-2 bg-[#1C1C21] hover:bg-[#25252B] rounded-full transition-colors border border-border"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Vence dia {dueDate.toLocaleDateString('pt-BR')}
          </div>
        </div>

        <div className="bg-[#1C1C21] rounded-2xl border border-border overflow-hidden shadow-lg relative">
          <div className="h-2 w-full absolute top-0 left-0" style={{ backgroundColor: cardColor }}></div>
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-background/50 border border-white/5 shadow-inner" style={{ color: cardColor }}>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                    {selectedCard.name}
                    <span className="text-muted-foreground font-normal text-base">— Fatura {capitalizedMonth}</span>
                  </h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 line-clamp-1 truncate">
                      <ShoppingCart className="w-4 h-4" />
                      Ciclo: {startPeriod.toLocaleDateString('pt-BR')} -&gt; {endPeriod.toLocaleDateString('pt-BR')} (fecha dia {closingDay})
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4" />
                      Pagar até: <span className="font-medium text-foreground">{dueDate.toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Badge variant={isFechada ? "destructive" : "default"} className={`pointer-events-none ${!isFechada ? "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20" : ""}`}>
                  {isFechada ? "Fechada" : "Aberta"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background rounded-xl p-4 border border-border/50">
                <span className="text-sm font-medium text-muted-foreground block mb-1">Total da Fatura</span>
                <span className={`text-2xl font-bold ${totalInvoice > 0 ? "text-red-500" : "text-foreground"}`}>{formatBRL(totalInvoice)}</span>
              </div>
              <div className="bg-background rounded-xl p-4 border border-border/50">
                <span className="text-sm font-medium text-muted-foreground block mb-1">Já Pago</span>
                <span className="text-2xl font-bold text-orange-500">{formatBRL(totalPaid)}</span>
              </div>
              <div className="bg-background rounded-xl p-4 border border-border/50">
                <span className="text-sm font-medium text-muted-foreground block mb-1">Limite Disponível</span>
                <span className="text-2xl font-bold text-blue-500">{formatBRL(Math.max(selectedCard.limit - totalInvoice, 0))}</span>
              </div>
              <div className="bg-background rounded-xl p-4 border border-border/50">
                <span className="text-sm font-medium text-muted-foreground block mb-1">Melhor Dia</span>
                <span className="text-2xl font-bold text-purple-400">{(closingDay + 1).toString().padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Compras desta fatura ({invoiceTransactions.length})</h3>
          {invoiceTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-[#1C1C21] border border-border rounded-xl">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
                <ReceiptText className="w-8 h-8 text-muted-foreground opacity-50" />
              </div>
              <p className="text-muted-foreground font-medium">Nenhuma compra nesta fatura.</p>
            </div>
          ) : (
            <div className="bg-[#1C1C21] rounded-xl border border-border overflow-hidden">
              {invoiceTransactions.map((tx: any, index: number) => {
                const cleanDesc = tx.description.replace("\n[Recorrente]", "").trim();
                return (
                  <div key={tx.id} className={`flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors ${index !== invoiceTransactions.length - 1 ? 'border-b border-border/50' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border">
                        <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground flex items-center gap-2">
                          {cleanDesc}
                          {tx.description.includes("[Recorrente]") && (
                            <Badge variant="outline" className="text-[10px] py-0 h-4 border-purple-500/30 text-purple-400">Recorrente</Badge>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString('pt-BR')} {tx.totalInstallments > 1 ? `• ${tx.installmentIndex} de ${tx.totalInstallments}` : ''}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-foreground">-{formatBRL(tx.amount)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-background p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cartões de Crédito</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Gerencie seus cartões e controle suas faturas
          </p>
        </div>
        <button
          onClick={() => {
            setCardToEdit(null);
            setIsModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm shadow-orange-500/20 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Novo Cartão
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1C1C21] border border-border rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Limite Total</span>
          </div>
          <span className="text-2xl font-bold text-foreground">{formatBRL(limiteTotalGeral)}</span>
        </div>

        <div className="bg-[#1C1C21] border border-border rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Total Utilizado</span>
          </div>
          <span className="text-2xl font-bold text-red-500">{formatBRL(utilizadoTotalGeral)}</span>
        </div>

        <div className="bg-[#1C1C21] border border-border rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Disponível Total</span>
          </div>
          <span className="text-2xl font-bold text-orange-500">{formatBRL(disponivelTotalGeral)}</span>
        </div>
      </div>

      {/* 🚀 Gráfico de Gastos Mensais */}
      <div className="mb-8 bg-[#1C1C21] border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Gastos Mensais com Cartão</h2>
        {monthlyChartData.every(d => d.total === 0) ? (
          <div className="flex items-center justify-center h-48 border border-border border-dashed rounded-lg bg-black/20">
            <span className="text-muted-foreground text-sm">Nenhum gasto registrado ainda</span>
          </div>
        ) : (
          <ChartContainer config={{ total: { label: "Gastos", color: "#8b5cf6" } }} className="h-56 w-full">
            <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} fontSize={12} stroke="#888" />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatBRL(value as number)} />} />
              <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </div>

      {/* Navegação de Tabs */}
      <div className="flex items-center gap-6 border-b border-border mb-8 overflow-x-auto custom-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-medium transition-colors whitespace-nowrap relative ${activeTab === tab ? "text-orange-500" : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-orange-500 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Area de Conteúdo */}
      {activeTab === "Meus Cartões" && (
        <>
          {processedCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-[var(--background-secondary)] border border-border border-dashed rounded-xl px-4">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <CreditCard className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 text-center">Nenhum cartão cadastrado</h3>
              <p className="text-muted-foreground text-center max-w-sm mb-6">
                Comece adicionando seus cartões de crédito para ter um controle detalhado sobre seus limites e faturas.
              </p>
              <button
                onClick={() => {
                  setCardToEdit(null);
                  setIsModalOpen(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm shadow-orange-500/20"
              >
                <Plus className="w-5 h-5" />
                Cadastrar Cartão
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {processedCards.map((card) => {
                const bgStyle = card.color ? { backgroundColor: card.color } : { backgroundColor: "#1e1e1e" };
                return (
                  <div key={card.id} className="flex flex-col gap-3">
                    {/* Cartão Físico */}
                    <div className="relative rounded-2xl p-6 overflow-hidden flex flex-col justify-between h-52 shadow-xl transition-all border border-white/10" style={bgStyle}>
                      <div className="flex items-center justify-between">
                        <Cpu className="w-10 h-10 text-yellow-500/90" />
                        <Wifi className="w-7 h-7 rotate-90 text-white/50" />
                      </div>

                      <div className="flex flex-col drop-shadow-md z-10 w-full mt-auto">
                        <span className="text-white/90 font-mono text-xl md:text-2xl tracking-[0.2em] mb-4">
                          **** **** **** {card.lastFourDigits || "0000"}
                        </span>
                        <div className="flex justify-between items-end">
                          <span className="text-white font-semibold text-sm xl:text-base uppercase tracking-wide truncate max-w-[170px]">{card.name}</span>
                          <span className="text-white/80 font-bold italic text-sm xl:text-base">{card.brand}</span>
                        </div>
                      </div>

                      {/* Efeitos de luz */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full blur-2xl transform -translate-x-8 translate-y-8" />
                    </div>

                    {/* Progress Bar e Limites */}
                    <div className="bg-[#1C1C21] border border-border rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Limite utilizado</span>
                        <span className="text-foreground font-medium">{card.percentUsed.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mb-4 overflow-hidden shadow-inner">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${card.percentUsed}%` }}></div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-background border border-border rounded p-2">
                          <span className="block text-muted-foreground mb-1">Total</span>
                          <span className="font-semibold text-foreground truncate block" title={formatBRL(card.limit)}>{formatBRL(card.limit)}</span>
                        </div>
                        <div className="bg-background border border-border rounded p-2">
                          <span className="block text-muted-foreground mb-1">Fatura</span>
                          <span className="font-semibold text-red-500 truncate block" title={formatBRL(card.faturaMes)}>{formatBRL(card.faturaMes)}</span>
                        </div>
                        <div className="bg-background border border-border rounded p-2">
                          <span className="block text-muted-foreground mb-1">Disponível</span>
                          <span className="font-semibold text-orange-500 truncate block" title={formatBRL(card.disponivel)}>{formatBRL(card.disponivel)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedCardId(card.id);
                          setInvoiceDate(new Date());
                          setActiveTab("Faturas");
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#1C1C21] hover:bg-[#25252B] rounded-xl text-sm font-medium transition-colors border border-border text-foreground"
                      >
                        <Receipt className="w-4 h-4 text-muted-foreground" />
                        Ver Fatura
                      </button>
                      <button
                        className="flex items-center justify-center w-[44px] h-[44px] shrink-0 bg-purple-600 hover:bg-purple-700 rounded-xl text-white transition-colors shadow-sm"
                        onClick={() => { setTransactionCardId(card.id); setIsTransactionModalOpen(true); }}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                      <button
                        className="flex items-center justify-center w-[44px] h-[44px] shrink-0 bg-[#1C1C21] hover:bg-[#25252B] border border-border rounded-xl text-foreground transition-colors"
                        onClick={() => { setCardToEdit(card); setIsModalOpen(true); }}
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="flex items-center justify-center w-[44px] h-[44px] shrink-0 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-background border border-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Cartão?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. O cartão e todas as faturas vinculadas serão removidos permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-muted text-foreground hover:bg-muted/80">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(card.id)} className="bg-red-500 hover:bg-red-600 text-white">
                              Confirmar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === "Faturas" && (
        <div className="animate-in fade-in duration-300">
          {renderFaturasTab()}
        </div>
      )}

      {activeTab === "Recorrentes" && (
        <div className="animate-in fade-in duration-300">
          {allRecurringTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-[#1C1C21] border border-border border-dashed rounded-xl px-4">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <RefreshCw className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 text-center">Nenhuma compra recorrente</h3>
              <p className="text-muted-foreground text-center max-w-xl mb-6">
                Compras recorrentes são lançadas automaticamente todo mês na fatura do cartão. Ao criar uma compra, marque como 'Recorrente' para ela aparecer aqui.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Suas Assinaturas</h2>
                <p className="text-sm text-muted-foreground">Gerencie os gastos que se repetem todos os meses no seu cartão de crédito.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allRecurringTransactions.map((tx, idx) => (
                  <div key={idx} className="bg-[#1C1C21] border border-border rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: tx.cardColor }}></div>
                    <div className="flex justify-between items-start pl-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-lg border border-border">
                          <RefreshCw className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">{tx.description}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <CreditCard className="w-3 h-3" /> {tx.cardName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end justify-between mt-2 pl-2">
                      <span className="text-sm text-muted-foreground">Valor mensal</span>
                      <span className="text-xl font-bold text-foreground">{formatBRL(tx.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🚀 Aba Gastos/Categorias com Gráfico Dinâmico */}
      {activeTab === "Gastos/Categorias" && (
        <div className="bg-[#1C1C21] rounded-2xl border border-border overflow-hidden shadow-lg animate-in fade-in duration-300">
          <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border/50">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-bold text-foreground">Gastos por Categoria</h3>
              </div>
              <p className="text-sm text-muted-foreground">Distribuição de gastos de todos os cartões</p>
            </div>
            <div className="w-full md:w-48">
              <Select value={categoryPeriod} onValueChange={setCategoryPeriod}>
                <SelectTrigger className="w-full bg-background border-border text-foreground">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Último mês</SelectItem>
                  <SelectItem value="3m">Últimos 3 meses</SelectItem>
                  <SelectItem value="6m">Últimos 6 meses</SelectItem>
                  <SelectItem value="12m">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-6">
            {categoryChartData.length === 0 ? (
              <div className="min-h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground font-medium">Nenhum gasto categorizado encontrado no período.</p>
              </div>
            ) : (
              <ChartContainer config={{ value: { label: "Total", color: "#10b981" } }} className="h-80 w-full">
                <BarChart data={categoryChartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={120} stroke="#888" />
                  <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatBRL(value as number)} />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ChartContainer>
            )}
          </div>
        </div>
      )}

      <CreditCardModal
        key={cardToEdit ? cardToEdit.id : "new-card"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setCardToEdit(null), 300);
        }}
        initialData={cardToEdit}
      />

      <CreditCardTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        cardId={transactionCardId}
        categories={categories}
      />
    </div>
  );
}