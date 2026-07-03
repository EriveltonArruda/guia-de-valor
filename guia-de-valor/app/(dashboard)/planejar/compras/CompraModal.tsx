"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";

interface CompraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompraModal({ isOpen, onClose }: CompraModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#121214] border-border text-foreground p-0 overflow-hidden rounded-xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold">
            Nova Compra Planejada
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 pt-2 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">

          {/* Nome da Compra */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Nome da Compra</label>
            <input
              type="text"
              placeholder="Ex: iPhone 15 Pro"
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Descrição</label>
            <textarea
              placeholder="Detalhes sobre a compra..."
              rows={2}
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all resize-none"
            />
          </div>

          {/* Valores (Grid) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Valor Total (R$)</label>
              <input
                type="text"
                placeholder="0,00"
                className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Já Economizado (R$)</label>
              <input
                type="text"
                placeholder="0,00"
                className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Prazo e Prioridade (Grid) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Prazo para Alcançar</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="date"
                  className="w-full bg-[#1C1C21] border border-border rounded-md pl-10 pr-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all color-scheme-dark"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">Até quando quer ter o dinheiro?</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Prioridade</label>
              <Select defaultValue="media">
                <SelectTrigger className="bg-[#1C1C21] border-border text-foreground focus:ring-orange-500">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Categoria */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Categoria</label>
            <input
              type="text"
              placeholder="Ex: Eletrônicos, Veículo"
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          {/* Prazo para Economia */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Prazo para Economia (meses)</label>
            <input
              type="text"
              placeholder="Ex: 12 meses"
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
            <p className="text-[11px] text-muted-foreground">Em quantos meses quer economizar?</p>
          </div>

          {/* Vincular a Meta */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Vincular a Meta (Opcional)</label>
            <Select defaultValue="nenhuma">
              <SelectTrigger className="bg-[#1C1C21] border-border text-foreground focus:ring-orange-500">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nenhuma">Nenhuma meta</SelectItem>
                {/* Aqui futuramente virão as metas do banco de dados */}
              </SelectContent>
            </Select>
          </div>

          {/* Observações */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Observações</label>
            <textarea
              placeholder="Notas adicionais..."
              rows={2}
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all resize-none"
            />
          </div>

          {/* Botão Submeter */}
          <div className="pt-2">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm shadow-orange-500/20">
              Salvar Planejamento
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}