"use client";

import * as React from "react";
import { useActionState } from "react";
import { Calendar, Info, X, icons, Folder, ChevronDown } from "lucide-react";
import type { CreateReceitaState } from "./actions";

// Tipo para receber os dados na edição
type IncomeTx = {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryName: string | null;
  categoryId: string | null;
};

export default function NovaReceitaModal({
  open,
  onOpenChange,
  workspaceId,
  categories,
  createReceitaAction,
  initialData, // NOVO: Dados iniciais para edição
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  categories: { id: string; name: string; icon: string | null; iconType: string | null }[];
  createReceitaAction: (
    prevState: CreateReceitaState,
    formData: FormData,
  ) => Promise<CreateReceitaState>;
  initialData?: IncomeTx | null;
}) {
  const [descricao, setDescricao] = React.useState("");
  const [valor, setValor] = React.useState("");
  const [data, setData] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [observacoes, setObservacoes] = React.useState("");
  const [recorrente, setRecorrente] = React.useState(false);
  const [frequencia, setFrequencia] = React.useState("Mensal");
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const initialState: CreateReceitaState = { ok: false };
  const [state, formAction] = useActionState(
    createReceitaAction,
    initialState,
  );

  React.useEffect(() => {
    if (!open) return;

    // Se recebeu initialData, estamos no MODO EDIÇÃO
    if (initialData) {
      // Limpa as strings extras se houver (para não duplicar "Recorrente:" etc)
      const cleanDesc = initialData.description.split("\n")[0];
      setDescricao(cleanDesc);
      setValor(initialData.amount.toFixed(2).replace(".", ","));
      setData(initialData.date);
      setCategoryId(initialData.categoryId ?? categories[0]?.id ?? "");
      setRecorrente(initialData.description.includes("Recorrente:"));
      setObservacoes(""); // Zera para simplificar
    } else {
      // Se não, MODO CRIAÇÃO (Reseta tudo)
      setDescricao("");
      setValor("");
      setData(new Date().toISOString().slice(0, 10));
      setCategoryId(categories[0]?.id ?? "");
      setObservacoes("");
      setRecorrente(false);
      setFrequencia("Mensal");
    }
  }, [open, initialData]);

  const submitDisabled = !descricao.trim() || !valor.trim() || !data || !categoryId;

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!open) return null;

  React.useEffect(() => {
    if (!open) return;
    if (state.ok) onOpenChange(false);
  }, [state.ok, open, onOpenChange]);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      <div className="relative w-full max-w-2xl mx-4 rounded-2xl border border-white/10 bg-[#292B49] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {initialData ? "Editar Receita" : "Nova Receita"}
            </h2>
            <p className="text-xs text-white/70 mt-1">
              {initialData
                ? "Atualize os dados desta receita."
                : "Preencha os dados para adicionar sua receita ao workspace."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/5"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form action={formAction} className="mt-5 space-y-4">
          <input type="hidden" name="workspaceId" value={workspaceId} />

          {/* Se estiver editando, envia o ID da transação escondido */}
          {initialData && (
            <input type="hidden" name="transactionId" value={initialData.id} />
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Descrição</label>
            <input
              name="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Salário"
              className="w-full h-11 rounded-lg border border-white/15 bg-[#0b1220] text-white px-3 outline-none focus:ring-2 focus:ring-[#ED6936]/70 focus:border-[#ED6936]"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Valor</label>
              <input
                name="valor"
                inputMode="decimal"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                className="w-full h-11 rounded-lg border border-white/15 bg-[#0b1220] text-white px-3 outline-none focus:ring-2 focus:ring-[#ED6936]/70 focus:border-[#ED6936]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Data</label>
              <div className="relative">
                <input
                  name="data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full h-11 rounded-lg border border-white/15 bg-[#0b1220] text-white px-3 outline-none focus:ring-2 focus:ring-[#ED6936]/70 focus:border-[#ED6936]"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2" ref={dropdownRef}>
            <label className="text-sm font-semibold text-white">Categoria</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full h-11 flex items-center justify-between rounded-lg border border-white/15 bg-[#0b1220] text-white px-3 outline-none focus:ring-2 focus:ring-[#ED6936]/70 focus:border-[#ED6936] transition-all"
              >
                <div className="flex items-center gap-2 truncate">
                  {categoryId ? (
                    (() => {
                      const selected = categories.find((c) => c.id === categoryId);
                      if (!selected) return <span className="text-white/50">Selecione uma categoria</span>;
                      
                      let IconPreview = null;
                      if (selected.iconType === "EMOJI" && selected.icon) {
                        IconPreview = <span className="text-lg leading-none">{selected.icon}</span>;
                      } else if (selected.iconType === "UI_ICON" && selected.icon) {
                        const LucideIcon = icons[selected.icon as keyof typeof icons] as React.ElementType || Folder;
                        IconPreview = <LucideIcon className="h-4 w-4 text-[#ED6936]" />;
                      }
                      
                      return (
                        <>
                          {IconPreview}
                          <span>{selected.name}</span>
                        </>
                      );
                    })()
                  ) : (
                    <span className="text-white/50">Selecione uma categoria</span>
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 text-white/50 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-white/10 bg-[#0b1220] py-1 z-60 shadow-xl customize-scrollbar">
                  {categories.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-white/50">Sem categoria cadastrada</div>
                  ) : (
                    categories.map((c) => {
                      let IconPreview = null;
                      if (c.iconType === "EMOJI" && c.icon) {
                        IconPreview = <span className="text-lg leading-none w-5 text-center">{c.icon}</span>;
                      } else if (c.iconType === "UI_ICON" && c.icon) {
                        const LucideIcon = icons[c.icon as keyof typeof icons] as React.ElementType || Folder;
                        IconPreview = <LucideIcon className="h-4 w-4 text-white/70" />;
                      }

                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setCategoryId(c.id);
                            setIsCategoryOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-white/5 ${
                            categoryId === c.id ? "bg-white/5 text-[#ED6936]" : "text-white"
                          }`}
                        >
                          <div className="w-5 flex justify-center items-center text-[#ED6936]">
                            {IconPreview}
                          </div>
                          <span className="truncate">{c.name}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
            <input type="hidden" name="categoryId" value={categoryId} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Observações</label>
            <textarea
              name="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Adicione observações..."
              rows={3}
              className="w-full rounded-lg border border-white/15 bg-[#0b1220] text-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#ED6936]/70 focus:border-[#ED6936]"
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0b1220] p-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white">Recorrente</div>
                <div className="text-xs text-white/60 mt-1">
                  Ative para adicionar frequência.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRecorrente((v) => !v)}
                className={[
                  "relative w-12 h-7 rounded-full transition",
                  recorrente ? "bg-[#ED6936]" : "bg-white/10",
                ].join(" ")}
              >
                <span
                  className={[
                    "absolute top-1/2 -translate-y-1/2 left-1 w-5 h-5 rounded-full bg-black/80 transition",
                    recorrente ? "translate-x-5" : "translate-x-0",
                  ].join(" ")}
                />
              </button>
            </div>

            <input
              type="hidden"
              name="recorrente"
              value={recorrente ? "true" : "false"}
            />
            <input type="hidden" name="frequencia" value={frequencia} />

            {recorrente && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-start gap-2 rounded-lg border border-[#ED6936]/25 bg-[#292B49]/50 p-3">
                  <Info className="h-4 w-4 text-[#ED6936]" />
                  <div className="text-xs text-white/80">
                    Atenção: Esta receita será adicionada automaticamente no
                    seu saldo.
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white">
                    Frequência
                  </label>
                  <select
                    value={frequencia}
                    onChange={(e) => setFrequencia(e.target.value)}
                    className="w-full h-10 rounded-lg border border-white/15 bg-[#0b1220] text-white px-3 outline-none focus:ring-2 focus:ring-[#ED6936]/70 focus:border-[#ED6936]"
                  >
                    <option value="Mensal">Mensal</option>
                    <option value="Semanal">Semanal</option>
                    <option value="Diário">Diário</option>
                    <option value="Anual">Anual</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {!state.ok && state.error && (
            <div className="text-sm text-red-300 border border-red-500/30 bg-red-500/10 rounded-lg p-3">
              {state.error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitDisabled}
              className={[
                "w-full h-12 rounded-xl font-bold transition flex items-center justify-center",
                submitDisabled
                  ? "bg-[#ED6936]/40 text-black/70 cursor-not-allowed"
                  : "bg-[#ED6936] hover:bg-[#ED6936]/90 text-black",
              ].join(" ")}
            >
              {initialData ? "Salvar Alterações" : "Salvar Receita"}
            </button>
          </div>
        </form>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .customize-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .customize-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .customize-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .customize-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}