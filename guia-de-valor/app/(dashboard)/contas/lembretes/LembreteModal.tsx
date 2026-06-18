"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, Clock, DollarSign } from "lucide-react";

interface LembreteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LembreteModal({ isOpen, onClose }: LembreteModalProps) {
  const [isRecorrente, setIsRecorrente] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsRecorrente(false);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-[#121214] border-border text-foreground p-0 overflow-hidden rounded-xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold">
            Novo Lembrete
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">Crie um novo lembrete para não esquecer de compromissos financeiros</p>
        </DialogHeader>

        <div className="px-6 pb-6 pt-2 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">

          {/* Título do Lembrete */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Título do Lembrete</label>
            <input
              type="text"
              placeholder="Ex: Pagar conta de luz"
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          {/* Data e Horário (Grid 2 colunas) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Data</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="date"
                  className="w-full bg-[#1C1C21] border border-border rounded-md pl-10 pr-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all color-scheme-dark"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Horário (Opcional)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="time"
                  className="w-full bg-[#1C1C21] border border-border rounded-md pl-10 pr-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all color-scheme-dark"
                />
              </div>
            </div>
          </div>

          {/* Valor Opcional */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Valor (R$) - Opcional</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">0,00</span>
              <input
                type="text"
                className="w-full bg-[#1C1C21] border border-border rounded-md pl-12 pr-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Descrição (Opcional)</label>
            <textarea
              placeholder="Detalhes..."
              rows={3}
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all resize-none"
            />
          </div>

          {/* Bloco de Opção Recorrente */}
          <div className="bg-[#1C1C21] border border-border rounded-lg p-1">
            <div className="flex items-center justify-between p-3">
              <span className="text-sm font-medium text-foreground">Recorrente</span>
              <Switch checked={isRecorrente} onCheckedChange={setIsRecorrente} />
            </div>

            {/* Expansão Condicional Animada para a Frequência */}
            {isRecorrente && (
              <div className="p-3 bg-black/20 border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="text-sm font-medium text-foreground block mb-2">Frequência</label>
                <Select defaultValue="mensal">
                  <SelectTrigger className="bg-[#1C1C21] border-border text-foreground focus:ring-orange-500">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diario">Diário</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Botão Submeter */}
          <div className="pt-2">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm shadow-orange-500/20">
              Salvar Lembrete
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}