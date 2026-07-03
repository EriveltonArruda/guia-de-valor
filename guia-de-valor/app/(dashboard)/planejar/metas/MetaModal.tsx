"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";

interface MetaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MetaModal({ isOpen, onClose }: MetaModalProps) {
  const [tipoMeta, setTipoMeta] = useState<string>("acumulacao");

  // Resetar estados ao fechar
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTipoMeta("acumulacao");
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-[#121214] border-border text-foreground p-0 overflow-hidden rounded-xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold">
            Criar Primeira Meta
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">Defina uma meta financeira e acompanhe seu progresso de economia</p>
        </DialogHeader>

        <div className="px-6 pb-6 pt-2 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">

          {/* Nome da Meta */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Nome da Meta</label>
            <input
              type="text"
              placeholder="Ex: Viagem de férias, Limite mensal"
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
            <p className="text-[11px] text-muted-foreground">Dê um nome para sua meta financeira</p>
          </div>

          {/* Tipo de Meta */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Tipo de Meta</label>
            <Select value={tipoMeta} onValueChange={setTipoMeta}>
              <SelectTrigger className="w-full bg-[#1C1C21] border-border text-foreground focus:ring-orange-500 h-10">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="acumulacao">💰 Acumulação (manual)</SelectItem>
                <SelectItem value="limite_despesas">📉 Limite de Despesas (automático)</SelectItem>
                <SelectItem value="meta_receitas">📈 Meta de Receitas (automático)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground transition-all">
              {tipoMeta === "acumulacao" && "Você adiciona valores manualmente conforme economiza"}
              {tipoMeta === "limite_despesas" && "O sistema calcula automaticamente baseado nas suas despesas"}
              {tipoMeta === "meta_receitas" && "O sistema calcula automaticamente baseado nas suas receitas"}
            </p>
          </div>

          {/* Valores (Dinâmico: Se for automático, não faz sentido perguntar "Já economizado") */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {tipoMeta === "limite_despesas" ? "Limite Máximo (R$)" : "Meta Total (R$)"}
              </label>
              <input
                type="text"
                placeholder="0,00"
                className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
              />
              <p className="text-[11px] text-muted-foreground">
                {tipoMeta === "limite_despesas" ? "Qual o teto de gastos?" : "Quanto você quer juntar?"}
              </p>
            </div>

            {tipoMeta === "acumulacao" && (
              <div className="space-y-1.5 animate-in fade-in zoom-in-95 duration-200">
                <label className="text-sm font-medium text-foreground">Já Economizado (R$)</label>
                <input
                  type="text"
                  defaultValue="0"
                  className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                />
                <p className="text-[11px] text-muted-foreground">Quanto já tem economizado?</p>
              </div>
            )}
          </div>

          {/* Data Limite */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Data Limite (Opcional)</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="date"
                className="w-full bg-[#1C1C21] border border-border rounded-md pl-10 pr-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all color-scheme-dark"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">Até quando quer alcançar esta meta?</p>
          </div>

          {/* Botão Submeter */}
          <div className="pt-2">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm shadow-orange-500/20">
              Salvar Meta
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}