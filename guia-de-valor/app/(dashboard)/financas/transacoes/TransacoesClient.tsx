"use client";

import * as React from "react";
import { 
  Plus, Search, MoreVertical, AlertTriangle, ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight,
  CreditCard, Wallet, PiggyBank, TrendingUp, DollarSign, Banknote, Receipt, Landmark,
  ShoppingCart, ShoppingBag, Store, Gift, Tag, Shirt, Gem, Clock, Utensils, UtensilsCrossed,
  Coffee, Pizza, Beer, Car, Bus, Train, Fuel, Bike, Plane, Ship, Home, Zap, Droplet, Flame,
  Wifi, Lightbulb, Wrench, Key, Smartphone, Laptop, Tv, Headphones, Camera, Gamepad2, Heart,
  Pill, Dumbbell, Scissors, GraduationCap, Book, Newspaper, Music, Film, Palette, Globe,
  Star, Briefcase, Users, Award, Trophy, Target, Baby, PawPrint, User, Folder, FileText,
  Calendar, Bell, Mail, Phone, Shield
} from "lucide-react";

const IconMap: Record<string, React.ElementType> = {
  CreditCard, Wallet, PiggyBank, TrendingUp, DollarSign, Banknote, Receipt, Landmark,
  ShoppingCart, ShoppingBag, Store, Gift, Tag, Shirt, Gem, Clock, Utensils, UtensilsCrossed,
  Coffee, Pizza, Beer, Car, Bus, Train, Fuel, Bike, Plane, Ship, Home, Zap, Droplet, Flame,
  Wifi, Lightbulb, Wrench, Key, Smartphone, Laptop, Tv, Headphones, Camera, Gamepad2, Heart,
  Pill, Dumbbell, Scissors, GraduationCap, Book, Newspaper, Music, Film, Palette, Globe,
  Star, Briefcase, Users, Award, Trophy, Target, Baby, PawPrint, User, Folder, FileText,
  Calendar, Bell, Mail, Phone, Shield
};

type Transaction = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string;
  date: string;
  categoryId: string | null;
  categoryName: string;
  categoryIcon: string | null;
  categoryIconType: string | null;
  userName: string;
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDateBR(dateString: string) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

export default function TransacoesClient({
  workspaceId,
  transactions,
  categories,
}: {
  workspaceId: string | null;
  transactions: Transaction[];
  categories: { id: string; name: string; type: string; icon: string | null; iconType: string | null }[];
}) {
  const [query, setQuery] = React.useState("");
  const [tipoFilter, setTipoFilter] = React.useState("Todos os tipos");
  const [categoryFilter, setCategoryFilter] = React.useState("Todas as categorias");
  const [memberFilter, setMemberFilter] = React.useState("Todos os membros");
  const [periodoFilter, setPeriodoFilter] = React.useState("Todos os períodos");

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [query, tipoFilter, categoryFilter, memberFilter, periodoFilter]);

  const uniqueCategories = React.useMemo(() => {
    return Array.from(new Set(transactions.map((t) => t.categoryName).filter(Boolean))) as string[];
  }, [transactions]);

  const uniqueMembers = React.useMemo(() => {
    const members = Array.from(new Set(transactions.map((t) => t.userName).filter(Boolean))) as string[];
    // Mock user if missed
    if (!members.includes("Erivelton")) members.push("Erivelton");
    return members;
  }, [transactions]);

  const filteredTxs = React.useMemo(() => {
    let result = transactions;

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          (t.categoryName && t.categoryName.toLowerCase().includes(q))
      );
    }

    if (tipoFilter !== "Todos os tipos") {
      const isIncome = tipoFilter === "Receitas";
      result = result.filter((t) => t.type === (isIncome ? "INCOME" : "EXPENSE"));
    }

    if (categoryFilter !== "Todas as categorias") {
      result = result.filter((t) => t.categoryName === categoryFilter);
    }

    if (memberFilter !== "Todos os membros") {
      result = result.filter((t) => t.userName === memberFilter || t.userName === "Membro Desconhecido");
    }

    if (periodoFilter !== "Todos os períodos") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      result = result.filter((t) => {
        const txDate = new Date(t.date + "T00:00:00");
        txDate.setHours(0, 0, 0, 0);

        if (periodoFilter === "Hoje") {
          return txDate.getTime() === today.getTime();
        }
        if (periodoFilter === "Esta semana") {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          return txDate >= startOfWeek && txDate <= today;
        }
        if (periodoFilter === "Este mês") {
          return txDate.getMonth() === today.getMonth() && txDate.getFullYear() === today.getFullYear();
        }
        if (periodoFilter === "Este ano") {
          return txDate.getFullYear() === today.getFullYear();
        }
        return true;
      });
    }

    return result;
  }, [transactions, query, tipoFilter, categoryFilter, memberFilter, periodoFilter]);

  const paginatedTxs = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTxs.slice(start, start + itemsPerPage);
  }, [filteredTxs, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredTxs.length / itemsPerPage));

  // Handle visible pages to avoid huge pagination array
  const visiblePages = React.useMemo(() => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
      }
    }
    return pages;
  }, [totalPages, currentPage]);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 space-y-5 mt-2 mb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Transações</h1>
          <p className="text-white/70 mt-1 text-sm">Visão unificada de Receitas e Despesas</p>
        </div>
      </div>

      {/* FILTROS */}
      <div className="rounded-2xl border border-white/10 bg-[#292B49] p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full h-11 rounded-xl border border-white/10 bg-[#0b1220] text-white pl-10 pr-3 outline-none focus:ring-2 focus:ring-[#ED6936]/70 focus:border-[#ED6936]"
            />
          </div>

          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-[#0b1220] text-white px-3 outline-none focus:ring-2 focus:ring-[#ED6936]/70 focus:border-[#ED6936]"
          >
            <option value="Todos os tipos">Todos os tipos</option>
            <option value="Receitas">Receitas</option>
            <option value="Despesas">Despesas</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-[#0b1220] text-white px-3 outline-none focus:ring-2 focus:ring-[#ED6936]/70 focus:border-[#ED6936]"
          >
            <option value="Todas as categorias">Todas as categorias</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-[#0b1220] text-white px-3 outline-none focus:ring-2 focus:ring-[#ED6936]/70 focus:border-[#ED6936]"
          >
            <option value="Todos os membros">Todos os membros</option>
            {uniqueMembers.map((member) => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>

          <select
            value={periodoFilter}
            onChange={(e) => setPeriodoFilter(e.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-[#0b1220] text-white px-3 outline-none focus:ring-2 focus:ring-[#ED6936]/70 focus:border-[#ED6936]"
          >
            <option value="Todos os períodos">Todos os períodos</option>
            <option value="Hoje">Hoje</option>
            <option value="Esta semana">Esta semana</option>
            <option value="Este mês">Este mês</option>
            <option value="Este ano">Este ano</option>
          </select>
        </div>
      </div>

      {/* LISTAGEM */}
      <div className="space-y-4">
        {filteredTxs.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#292B49]/20 p-8 text-center">
            <div className="text-white font-semibold">
              Nenhuma transação encontrada com esses filtros.
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#292B49]/20 p-4">
            <div className="text-xs text-white/60 mb-3 ml-1">
              {filteredTxs.length} transações
            </div>
            <div className="space-y-3">
              {paginatedTxs.map((t) => {
                const isIncome = t.type === "INCOME";
                
                return (
                <div
                  key={t.id}
                  className={[
                    "flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0b1220] p-4 relative",
                    openMenuId === t.id ? "z-50 shadow-xl" : "z-10 hover:border-white/20 transition-colors"
                  ].join(" ")}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${isIncome ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
                       {isIncome ? <ArrowUpRight className="h-5 w-5 text-emerald-500" /> : <ArrowDownRight className="h-5 w-5 text-red-500" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-semibold truncate text-[15px]">
                        {t.description}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md text-xs text-white/70">
                           {t.categoryIconType === "EMOJI" && t.categoryIcon ? (
                              <span>{t.categoryIcon}</span>
                            ) : t.categoryIconType === "UI_ICON" && t.categoryIcon && IconMap[t.categoryIcon] ? (
                              React.createElement(IconMap[t.categoryIcon], { className: "h-3 w-3" })
                            ) : null}
                           <span className="truncate max-w-[120px]">{t.categoryName ?? "Sem categoria"}</span>
                        </div>
                        <span className="text-white/30 text-xs">•</span>
                        <span className="text-xs text-white/60">{formatDateBR(t.date)}</span>
                        <span className="text-white/30 text-xs">•</span>
                        <div className="flex items-center gap-1">
                          <span className="h-5 w-5 rounded-full bg-[#292B49] border border-white/10 flex items-center justify-center text-[10px] text-white/80 font-medium shadow-sm">
                            {t.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`font-bold whitespace-nowrap text-right ${isIncome ? 'text-emerald-500' : 'text-red-500'}`}>
                      {isIncome ? "+" : "-"} {formatBRL(t.amount)}
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === t.id ? null : t.id);
                        }}
                        className="p-1.5 text-white/50 hover:text-white transition rounded-md hover:bg-white/10 relative z-10"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {openMenuId === t.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                            }}
                          />
                          <div
                            className="absolute right-0 top-full mt-1 w-32 rounded-lg border border-white/10 bg-[#292B49] p-1 shadow-2xl z-50 animate-in fade-in zoom-in duration-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(null);
                                alert("Funcionalidade em desenvolvimento");
                              }}
                              className="w-full text-left rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition"
                            >
                              Detalhes
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )})}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-2 border-t border-white/5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-white/10 bg-[#0b1220] text-sm text-white hover:bg-white/5 disabled:opacity-50 transition flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Anterior</span>
                </button>
                <div className="flex items-center gap-1">
                  {visiblePages.map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-8 w-8 rounded-lg text-sm transition ${currentPage === page ? 'bg-[#ED6936] text-black font-bold' : 'text-white/60 hover:bg-white/5 border border-transparent hover:border-white/10'}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-white/10 bg-[#0b1220] text-sm text-white hover:bg-white/5 disabled:opacity-50 transition flex items-center gap-1"
                >
                  <span className="hidden sm:inline">Próximo</span> <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
