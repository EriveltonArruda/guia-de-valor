"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, CreditCard, Repeat, Info } from "lucide-react";

interface DividaModalProps {
  isOpen: boolean;
  onClose: () => void;
  categorias: any[];
}

export function DialogDividaModal({ isOpen, onClose, categorias }: DividaModalProps) {
  // Estados para as condicionais do formulário
  const [tipoDivida, setTipoDivida] = useState<"parcelada" | "recorrente">("parcelada");
  const [calcMode, setCalcMode] = useState<"total" | "parcela">("total");
  const [jaIniciou, setJaIniciou] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTipoDivida("parcelada");
      setCalcMode("total");
      setJaIniciou(false);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-[#121214] border-border text-foreground p-0 overflow-hidden rounded-xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            Nova Dívida
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">Preencha os dados para cadastrar uma nova dívida</p>
        </DialogHeader>

        <div className="px-6 pb-6 pt-2 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">

          {/* Base: Nome e Categoria (Sempre Visíveis) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Nome do Credor</label>
            <input
              type="text"
              placeholder="Ex: Banco XYZ, Loja ABC"
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Categoria (opcional)</label>
            <Select>
              <SelectTrigger className="bg-[#1C1C21] border-border text-foreground">
                <SelectValue placeholder="Sem categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem categoria</SelectItem>
                {categorias.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* === FLUXO PARCELADA === */}
          {tipoDivida === "parcelada" && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">

              {/* Segmented Control de Cálculo */}
              <div className="flex bg-[#1C1C21] border border-border rounded-lg p-1">
                <button
                  onClick={() => setCalcMode("total")}
                  className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${calcMode === "total" ? "bg-orange-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Valor Total
                </button>
                <button
                  onClick={() => setCalcMode("parcela")}
                  className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${calcMode === "parcela" ? "bg-orange-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Valor da Parcela
                </button>
              </div>

              {/* Dica de Tooltip Variável */}
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="text-orange-500 text-sm">💡</span>
                {calcMode === "total"
                  ? "Informe quanto deve no total — dividiremos pelas parcelas."
                  : "Informe o valor mensal — calcularemos o total automaticamente."}
              </p>

              {/* Inputs de Valor e Parcela */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    {calcMode === "total" ? "Valor Total" : "Valor da Parcela"}
                  </label>
                  <input
                    type="text"
                    placeholder="0,00"
                    className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Parcelas</label>
                  <input
                    type="number"
                    placeholder="Ex: 12"
                    className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Toggle: Já Iniciei Pagamento */}
              <div className="flex items-center justify-between bg-[#1C1C21] border border-border p-3 rounded-lg">
                <span className="text-sm font-medium text-foreground">Já iniciei pagamento</span>
                <Switch checked={jaIniciou} onCheckedChange={setJaIniciou} />
              </div>

              {jaIniciou && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="text-sm font-medium text-foreground">Parcelas já pagas</label>
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
              )}

              {/* Vencimento */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Data de Vencimento</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="date"
                    className="w-full bg-[#1C1C21] border border-border rounded-md pl-10 pr-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all color-scheme-dark"
                  />
                </div>
              </div>

            </div>
          )}

          {/* === FLUXO RECORRENTE === */}
          {tipoDivida === "recorrente" && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Valor Mensal</label>
                <input
                  type="text"
                  placeholder="0,00"
                  className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* SELETOR MESTRE: Tipo de Dívida (Aparece no meio do form em ambas) */}
          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Info className="w-4 h-4 text-muted-foreground" />
              Tipo de Dívida
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setTipoDivida("parcelada")}
                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${tipoDivida === "parcelada" ? "border-orange-500 bg-orange-500/10" : "border-border bg-[#1C1C21] hover:bg-white/5"}`}
              >
                <CreditCard className={`w-6 h-6 mb-2 ${tipoDivida === "parcelada" ? "text-orange-500" : "text-muted-foreground"}`} />
                <span className={`text-sm font-bold ${tipoDivida === "parcelada" ? "text-orange-500" : "text-foreground"}`}>Parcelada/Fixa</span>
                <span className="text-[10px] text-muted-foreground mt-1">Financiamento, empréstimo</span>
              </div>

              <div
                onClick={() => setTipoDivida("recorrente")}
                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${tipoDivida === "recorrente" ? "border-orange-500 bg-orange-500/10" : "border-border bg-[#1C1C21] hover:bg-white/5"}`}
              >
                <Repeat className={`w-6 h-6 mb-2 ${tipoDivida === "recorrente" ? "text-orange-500" : "text-muted-foreground"}`} />
                <span className={`text-sm font-bold ${tipoDivida === "recorrente" ? "text-orange-500" : "text-foreground"}`}>Recorrente</span>
                <span className="text-[10px] text-muted-foreground mt-1">Assinatura, mensalidade</span>
              </div>
            </div>
          </div>

          {/* Continuação do FLUXO RECORRENTE (Abaixo do seletor) */}
          {tipoDivida === "recorrente" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-blue-950/30 border border-blue-900/50 p-3 rounded-lg flex gap-3">
                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-400/90 leading-relaxed">
                  <strong className="text-blue-400">Recorrente:</strong> Valor fixo que se repete indefinidamente (ex: Netflix, academia). Ao pagar, uma nova cobrança será gerada automaticamente.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Frequência</label>
                  <Select defaultValue="mensal">
                    <SelectTrigger className="bg-[#1C1C21] border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Próximo Venc.</label>
                  <div className="relative">
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="date"
                      className="w-full bg-[#1C1C21] border border-border rounded-md pl-3 pr-10 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all color-scheme-dark"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Observações e Botão Final (Sempre Visíveis) */}
          <div className="space-y-1.5 pt-2">
            <label className="text-sm font-medium text-foreground">Observações</label>
            <textarea
              placeholder="Notas adicionais..."
              rows={3}
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all resize-none"
            />
          </div>

          <div className="pt-2">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm shadow-orange-500/20">
              {tipoDivida === "parcelada" ? "Salvar Dívida" : "Salvar Recorrente"}
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

export { DialogDividaModal as DividaModal };