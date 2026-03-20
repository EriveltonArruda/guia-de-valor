"use client";

import * as React from "react";
import { Calendar, Plus, Search, MoreVertical, Pencil, Trash2, ArrowDownLeft, AlertTriangle } from "lucide-react";
import NovaDespesaModal from "./NovaDespesaModal";
import type { CreateDespesaState } from "./actions";

type ExpenseTx = {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryName: string | null;
  categoryId: string | null;
  userName: string;
  status: string;
};

type ActiveTab = "SIMPLES" | "RECORRENTES" | "AVANCADA";

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);
}

function isRecurringTx(tx: ExpenseTx) {
  return tx.description.includes("Recorrente:");
}

function daysDiff(a: Date, b: Date) {
  const ms = Math.abs(b.getTime() - a.getTime());
  return ms / (1000 * 60 * 60 * 24);
}

export default function DespesasClient({
  workspaceId,
  transactions,
  categories,
  createDespesaAction,
  deleteDespesaAction,
}: {
  workspaceId: string | null;
  transactions: ExpenseTx[];
  categories: { id: string; name: string }[];
  createDespesaAction: (
    prevState: CreateDespesaState,
    formData: FormData,
  ) => Promise<CreateDespesaState>;
  deleteDespesaAction: (id: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [tab, setTab] = React.useState<ActiveTab>("SIMPLES");
  const [openNova, setOpenNova] = React.useState(false);
  const [txToEdit, setTxToEdit] = React.useState<ExpenseTx | null>(null);

  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
  const [txToDelete, setTxToDelete] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [query, setQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("Todas as categorias");
  const [memberFilter, setMemberFilter] = React.useState("Todos os membros");
  const [statusFilter, setStatusFilter] = React.useState("Todas");

  const [startDate, setStartDate] = React.useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .slice(0, 10),
  );
  const [endDate, setEndDate] = React.useState(new Date().toISOString().slice(0, 10));

  const uniqueCategories = React.useMemo(() => {
    return Array.from(new Set(transactions.map((t) => t.categoryName).filter(Boolean))) as string[];
  }, [transactions]);

  const uniqueMembers = React.useMemo(() => {
    return Array.from(new Set(transactions.map((t) => t.userName).filter(Boolean))) as string[];
  }, [transactions]);

  const baseFilteredTxs = React.useMemo(() => {
    let result = transactions;

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          (t.categoryName && t.categoryName.toLowerCase().includes(q))
      );
    }

    if (categoryFilter !== "Todas as categorias") {
      result = result.filter((t) => t.categoryName === categoryFilter);
    }

    if (memberFilter !== "Todos os membros") {
      result = result.filter((t) => t.userName === memberFilter);
    }

    if (statusFilter !== "Todas") {
      const statusToMatch = statusFilter === "Pagas" ? "PAID" : "PENDING";
      result = result.filter((t) => t.status === statusToMatch);
    }

    return result;
  }, [transactions, query, categoryFilter, memberFilter, statusFilter]);

  const simpleTxs = React.useMemo(
    () => baseFilteredTxs.filter((t) => !isRecurringTx(t)),
    [baseFilteredTxs],
  );

  const recurringTxs = React.useMemo(
    () => baseFilteredTxs.filter(isRecurringTx),
    [baseFilteredTxs],
  );

  const rangeFiltered = React.useMemo(() => {
    const start = startDate ? new Date(startDate + "T00:00:00") : null;
    const end = endDate ? new Date(endDate + "T23:59:59") : null;
    return baseFilteredTxs.filter((t) => {
      const dt = new Date(t.date + "T00:00:00");
      if (start && dt < start) return false;
      if (end && dt > end) return false;
      return true;
    });
  }, [baseFilteredTxs, startDate, endDate]);

  const advancedTotals = React.useMemo(() => {
    const total = rangeFiltered.reduce((acc, t) => acc + t.amount, 0);
    const highest = rangeFiltered.reduce((acc, t) => Math.max(acc, t.amount), 0);
    const count = rangeFiltered.length;

    const start = startDate ? new Date(startDate + "T00:00:00") : null;
    const end = endDate ? new Date(endDate + "T23:59:59") : null;
    const months = start && end ? Math.max(1, daysDiff(start, end) / 30) : 1;
    const avgMonthly = total / months;

    return { total, highest, count, avgMonthly };
  }, [rangeFiltered, startDate, endDate]);

  const byCategory = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const t of rangeFiltered) {
      const key = t.categoryName ?? "Sem categoria";
      map.set(key, (map.get(key) ?? 0) + t.amount);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount]) => ({ name, amount }));
  }, [rangeFiltered]);

  const currentTotal = React.useMemo(() => {
    if (tab === "SIMPLES") return simpleTxs.reduce((acc, t) => acc + t.amount, 0);
    if (tab === "RECORRENTES") return recurringTxs.reduce((acc, t) => acc + t.amount, 0);
    if (tab === "AVANCADA") return advancedTotals.total;
    return 0;
  }, [tab, simpleTxs, recurringTxs, advancedTotals]);

  const handleConfirmDelete = async () => {
    if (!txToDelete) return;
    setIsDeleting(true);
    await deleteDespesaAction(txToDelete);
    setIsDeleting(false);
    setTxToDelete(null);
  };

  const handleEdit = (t: ExpenseTx) => {
    setTxToEdit(t);
    setOpenMenuId(null);
    setOpenNova(true);
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 space-y-5 mt-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Despesas</h1>
          <p className="text-white/70 mt-1 text-sm">
            Total: {formatBRL(currentTotal)}
          </p>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab("SIMPLES")}
              className={[
                "h-8 px-3 rounded-lg border transition text-xs font-semibold",
                tab === "SIMPLES"
                  ? "bg-[#ED6936] border-[#ED6936] text-black"
                  : "bg-[#292B49]/40 border-white/10 text-white/80 hover:border-[#ED6936]/40",
              ].join(" ")}
            >
              Simples
            </button>
            <button
              type="button"
              onClick={() => setTab("RECORRENTES")}
              className={[
                "h-8 px-3 rounded-lg border transition text-xs font-semibold",
                tab === "RECORRENTES"
                  ? "bg-[#ED6936] border-[#ED6936] text-black"
                  : "bg-[#292B49]/40 border-white/10 text-white/80 hover:border-[#ED6936]/40",
              ].join(" ")}
            >
              Recorrentes
            </button>
            <button
              type="button"
              onClick={() => setTab("AVANCADA")}
              className={[
                "h-8 px-3 rounded-lg border transition text-xs font-semibold",
                tab === "AVANCADA"
                  ? "bg-[#ED6936] border-[#ED6936] text-black"
                  : "bg-[#292B49]/40 border-white/10 text-white/80 hover:border-[#ED6936]/40",
              ].join(" ")}
            >
              Avançada
            </button>
          </div>

          <button
            type="button"
            disabled={!workspaceId}
            onClick={() => {
              setTxToEdit(null);
              setOpenNova(true);
            }}
            className={[
              "inline-flex items-center gap-2 h-8 rounded-lg px-4 font-bold transition",
              !workspaceId
                ? "bg-[#ED6936]/30 text-[#ED6936]/70 cursor-not-allowed"
                : "bg-[#ED6936] text-black hover:bg-[#ED6936]/90",
            ].join(" ")}
          >
            <Plus className="h-4 w-4" />
            Nova
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#292B49] p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-[360px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar Despesas..."
              className="w-full h-11 rounded-xl border border-white/10 bg-[#0b1220] text-white pl-10 pr-3 outline-none focus:ring-2 focus:ring-[#ED6936]/70 focus:border-[#ED6936]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:flex md:items-center md:gap-3">
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 rounded-xl border border-white/10 bg-[#0b1220] text-white px-3 outline-none focus:ring-2 focus:ring-[#ED6936]/70 focus:border-[#ED6936]"
            >
              <option value="Todas">Todas</option>
              <option value="Pagas">Pagas</option>
              <option value="Pendentes">Pendentes</option>
            </select>
          </div>
        </div>
      </div>

      {tab === "SIMPLES" && (
        <div className="space-y-4">
          {simpleTxs.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#292B49]/20 p-8 text-center">
              <div className="text-white font-semibold">
                Nenhuma despesa simples encontrada com esses filtros.
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#292B49]/20 p-4">
              <div className="text-xs text-white/60 mb-3">
                {simpleTxs.length} despesa(s)
              </div>
              <div className="space-y-3">
                {simpleTxs.map((t) => (
                  <div
                    key={t.id}
                    className={[
                      "flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0b1220] p-4 relative",
                      openMenuId === t.id ? "z-50" : "z-10"
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                        <ArrowDownLeft className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-semibold truncate">
                          {t.description}
                        </div>
                        <div className="text-xs text-white/60 mt-0.5">
                          {t.categoryName ?? "Sem categoria"} • {t.date} • {t.userName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-red-500 font-bold whitespace-nowrap">
                        - {formatBRL(t.amount)}
                      </div>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === t.id ? null : t.id);
                          }}
                          className="p-2 text-white/50 hover:text-white transition rounded-md hover:bg-white/5 relative z-10"
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
                              className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-white/10 bg-[#292B49] p-1 shadow-xl z-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(t);
                                }}
                                className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-sm text-white/80 hover:bg-white/10 transition"
                              >
                                <Pencil className="h-4 w-4" />
                                Editar
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                  setTxToDelete(t.id);
                                }}
                                className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-sm text-red-400 hover:bg-red-400/10 transition mt-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                Excluir
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "RECORRENTES" && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#292B49]/20 p-5 md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="text-white font-bold">
                  Despesas Recorrentes
                </div>
                <div className="text-white/70 text-sm">
                  {recurringTxs.length} itens
                </div>
              </div>
              <div className="text-white/60 text-xs mt-2">
                Recorrências filtradas com base nas suas seleções acima.
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#292B49]/20 p-5">
              <div className="text-xs text-white/60">Total mensal estimado</div>
              <div className="text-red-500 font-bold mt-1">
                - {formatBRL(recurringTxs.reduce((acc, t) => acc + t.amount, 0))}
              </div>
            </div>
          </div>

          {recurringTxs.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#292B49]/20 p-8 text-center">
              <div className="text-white font-semibold">
                Nenhuma despesa recorrente cadastrada
              </div>
              <div className="text-white/60 text-sm mt-1">
                Ao criar uma despesa, marque como "Recorrente" para que ela apareça aqui.
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#292B49]/20 p-4">
              <div className="text-xs text-white/60 mb-3">
                {recurringTxs.length} despesa(s) recorrente(s)
              </div>
              <div className="space-y-3">
                {recurringTxs.map((t) => (
                  <div
                    key={t.id}
                    className={[
                      "flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0b1220] p-4 relative",
                      openMenuId === t.id ? "z-50" : "z-10"
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                        <ArrowDownLeft className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-semibold truncate">
                          {t.description}
                        </div>
                        <div className="text-xs text-white/60 mt-0.5">
                          {t.categoryName ?? "Sem categoria"} • {t.date} • {t.userName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-red-500 font-bold whitespace-nowrap">
                        - {formatBRL(t.amount)}
                      </div>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === t.id ? null : t.id);
                          }}
                          className="p-2 text-white/50 hover:text-white transition rounded-md hover:bg-white/5 relative z-10"
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
                              className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-white/10 bg-[#292B49] p-1 shadow-xl z-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(t);
                                }}
                                className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-sm text-white/80 hover:bg-white/10 transition"
                              >
                                <Pencil className="h-4 w-4" />
                                Editar
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                  setTxToDelete(t.id);
                                }}
                                className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-sm text-red-400 hover:bg-red-400/10 transition mt-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                Excluir
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "AVANCADA" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#292B49]/20 p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="grid gap-3 md:grid-cols-2 md:w-[560px]">
                <div className="space-y-2">
                  <div className="text-xs text-white/60">Período</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-white/60" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-10 w-full rounded-xl border border-white/10 bg-[#0b1220] text-white px-3 outline-none focus:ring-2 focus:ring-[#ED6936]/70 focus:border-[#ED6936]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-white/60">Fim</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-white/60" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-10 w-full rounded-xl border border-white/10 bg-[#0b1220] text-white px-3 outline-none focus:ring-2 focus:ring-[#ED6936]/70 focus:border-[#ED6936]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#292B49]/20 p-5">
              <div className="text-xs text-white/60">Total que você gastou</div>
              <div className="text-red-500 font-bold mt-2">
                {formatBRL(advancedTotals.total)}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#292B49]/20 p-5">
              <div className="text-xs text-white/60">Média mensal</div>
              <div className="text-red-500 font-bold mt-2">
                {formatBRL(advancedTotals.avgMonthly)}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#292B49]/20 p-5">
              <div className="text-xs text-white/60">Maior despesa</div>
              <div className="text-red-500 font-bold mt-2">
                {formatBRL(advancedTotals.highest)}
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#292B49]/20 p-5">
              <div className="text-sm font-bold text-white">
                Despesas por Categoria
              </div>
              {byCategory.length === 0 ? (
                <div className="mt-4 text-xs text-white/70">
                  Nenhuma despesa categorizada no período.
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  {byCategory.slice(0, 6).map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0b1220] p-3"
                    >
                      <div className="text-xs text-white/80 truncate">
                        {c.name}
                      </div>
                      <div className="text-xs font-bold text-red-500">
                        {formatBRL(c.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#292B49]/20 p-5">
              <div className="text-sm font-bold text-white">
                Despesas Gerais
              </div>
              {rangeFiltered.length === 0 ? (
                <div className="mt-4 text-xs text-white/70">
                  Nenhuma despesa no período selecionado.
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  {rangeFiltered.slice(0, 5).map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0b1220] p-3"
                    >
                      <div className="text-xs text-white/80 truncate">
                        {t.description}
                      </div>
                      <div className="text-xs font-bold text-red-500">
                        {formatBRL(t.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {openNova && (
        <NovaDespesaModal
          open={openNova}
          onOpenChange={(open) => {
            setOpenNova(open);
            if (!open) setTxToEdit(null);
          }}
          workspaceId={workspaceId ?? ""}
          categories={categories}
          createDespesaAction={createDespesaAction}
          initialData={txToEdit}
        />
      )}

      {txToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => !isDeleting && setTxToDelete(null)}
          />
          <div className="relative w-full max-w-sm mx-4 rounded-2xl border border-white/10 bg-[#1a1c33] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-white">Excluir Despesa?</h2>
              <p className="text-sm text-white/70">
                Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setTxToDelete(null)}
                className="flex-1 rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/5 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Sim, Excluir"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
