"use client";

import * as React from "react";
import { Plus, Search, Pencil, Trash2, AlertTriangle, icons } from "lucide-react";
import NovaCategoriaModal from "./NovaCategoriaModal";
import type { CategoriaState } from "./actions";

type CategoryData = {
  id: string;
  name: string;
  type: string; // "INCOME" | "EXPENSE"
  icon: string;
  iconType: string; // "UI_ICON" | "EMOJI"
};

type ActiveFilter = "Todos" | "Receitas" | "Despesas";

export default function CategoriasClient({
  workspaceId,
  categorias,
  createCategoriaAction,
  deleteCategoriaAction,
}: {
  workspaceId: string | null;
  categorias: CategoryData[];
  createCategoriaAction: (
    prevState: CategoriaState,
    formData: FormData
  ) => Promise<CategoriaState>;
  deleteCategoriaAction: (id: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [filter, setFilter] = React.useState<ActiveFilter>("Todos");
  const [query, setQuery] = React.useState("");
  const [openNova, setOpenNova] = React.useState(false);
  const [catToEdit, setCatToEdit] = React.useState<CategoryData | null>(null);

  const [catToDelete, setCatToDelete] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const filtered = React.useMemo(() => {
    let result = categorias;
    if (filter === "Receitas") result = result.filter((c) => c.type === "INCOME");
    if (filter === "Despesas") result = result.filter((c) => c.type === "EXPENSE");
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }
    return result;
  }, [categorias, filter, query]);

  const handleConfirmDelete = async () => {
    if (!catToDelete) return;
    setIsDeleting(true);
    await deleteCategoriaAction(catToDelete);
    setIsDeleting(false);
    setCatToDelete(null);
  };

  const handleEdit = (c: CategoryData) => {
    setCatToEdit(c);
    setOpenNova(true);
  };

  const renderIcon = (c: CategoryData) => {
    if (c.iconType === "EMOJI") {
      return <span className="text-xl">{c.icon}</span>;
    }
    const LucideIcon = icons[c.icon as keyof typeof icons] as React.ElementType;
    if (LucideIcon) {
      return <LucideIcon className="w-5 h-5 text-white" />;
    }
    const DefaultIcon = icons["Folder"] as React.ElementType;
    return <DefaultIcon className="w-5 h-5 text-white" />;
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 space-y-6 mt-4 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-white">Categorias</h1>
        <button
          type="button"
          disabled={!workspaceId}
          onClick={() => {
            setCatToEdit(null);
            setOpenNova(true);
          }}
          className={[
            "inline-flex items-center justify-center gap-2 h-11 sm:h-10 rounded-xl px-5 font-bold transition",
            !workspaceId
              ? "bg-[#ED6936]/30 text-[#ED6936]/70 cursor-not-allowed"
              : "bg-[#ED6936] text-black hover:bg-[#ED6936]/90",
          ].join(" ")}
        >
          <Plus className="h-5 w-5" />
          Nova Categoria
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar categoria..."
            className="w-full h-12 rounded-xl border border-[#292B49] bg-[#0b1220] pl-12 pr-4 text-white outline-none focus:border-[#ED6936] focus:ring-1 focus:ring-[#ED6936] transition-all"
          />
        </div>

        <div className="flex w-full rounded-xl bg-[#0b1220] p-1 border border-white/10">
          {(["Todos", "Receitas", "Despesas"] as ActiveFilter[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={[
                "flex-1 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap",
                filter === tab
                  ? "bg-[#ED6936] text-black shadow-md"
                  : "bg-transparent text-white/60 hover:text-white hover:bg-white/5",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="group flex flex-col justify-between rounded-2xl border border-[#292B49] bg-[#1a1c33] p-4 transition-all hover:border-[#ED6936]/50 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#292B49] border border-white/5 shadow-inner">
                  {renderIcon(c)}
                </div>
                <div className="truncate font-bold text-white text-base">
                  {c.name}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
              <div
                className={[
                  "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full",
                  c.type === "INCOME"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500",
                ].join(" ")}
              >
                {c.type === "INCOME" ? "Receita" : "Despesa"}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition"
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCatToDelete(c.id)}
                  className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-md transition"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <div className="inline-flex h-16 w-16 mb-4 items-center justify-center rounded-full bg-[#292B49]/50">
              <Search className="h-8 w-8 text-white/30" />
            </div>
            <h3 className="text-lg font-medium text-white/80">Nenhuma categoria encontrada</h3>
            <p className="text-white/50 text-sm mt-1">Tente ajustar seus filtros de busca.</p>
          </div>
        )}
      </div>

      {openNova && (
        <NovaCategoriaModal
          open={openNova}
          onOpenChange={(open) => {
            setOpenNova(open);
            if (!open) setCatToEdit(null);
          }}
          workspaceId={workspaceId ?? ""}
          createCategoriaAction={createCategoriaAction}
          initialData={catToEdit}
        />
      )}

      {catToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => !isDeleting && setCatToDelete(null)}
          />
          <div className="relative w-full max-w-sm mx-4 rounded-3xl border border-white/10 bg-[#1a1c33] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Excluir Categoria?</h2>
              <p className="text-sm text-white/70">
                Esta ação não pode ser desfeita. Todos os lançamentos ligados a esta categoria podem ser afetados.
              </p>
            </div>
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setCatToDelete(null)}
                className="flex-[0.8] rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/5 transition disabled:opacity-50"
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
