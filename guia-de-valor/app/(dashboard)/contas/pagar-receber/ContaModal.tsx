"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Receipt, Calendar as CalendarIcon, Smartphone } from "lucide-react";

interface ContaModalProps {
  isOpen: boolean;
  onClose: () => void;
  categorias: any[];
}

export function ContaModal({ isOpen, onClose, categorias }: ContaModalProps) {
  const [isRecorrente, setIsRecorrente] = useState(false);
  const [isParcelado, setIsParcelado] = useState(false);

  // Função para resetar os estados ao fechar
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsRecorrente(false);
      setIsParcelado(false);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#121214] border-border text-foreground p-0 overflow-hidden rounded-xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            Nova Conta
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 pt-2 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">

          {/* Linha 1: Tipo e Vencimento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Tipo</label>
              <Select defaultValue="pagar">
                <SelectTrigger className="bg-[#1C1C21] border-border text-foreground">
                  <div className="flex items-center gap-2 text-red-500">
                    <Receipt className="w-4 h-4" />
                    <SelectValue placeholder="Selecione" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pagar" className="text-red-500">💸 A Pagar</SelectItem>
                  <SelectItem value="receber" className="text-orange-500">💰 A Receber</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Vencimento</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="date"
                  className="w-full bg-[#1C1C21] border border-border rounded-md pl-10 pr-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all color-scheme-dark"
                />
              </div>
            </div>
          </div>

          {/* Linha 2: Descrição */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Descrição</label>
            <input
              type="text"
              placeholder="Ex: Aluguel, Salário, Luz..."
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          {/* Linha 3: Valor e Categoria */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Valor (R$)</label>
              <input
                type="text"
                placeholder="0,00"
                className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Categoria</label>
              <Select>
                <SelectTrigger className="bg-[#1C1C21] border-border text-foreground">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Box de Opções (Recorrente / Parcelado) */}
          <div className="bg-[#1C1C21] border border-border rounded-lg p-1 mt-2">
            {/* Toggle Recorrente */}
            <div className="flex items-center justify-between p-3 border-b border-border/50">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="text-orange-500">↻</span> Recorrente
              </div>
              <Switch checked={isRecorrente} onCheckedChange={setIsRecorrente} />
            </div>

            {/* Expansão Condicional: Frequência */}
            {isRecorrente && (
              <div className="p-3 bg-black/20 border-b border-border/50 animate-in fade-in zoom-in-95 duration-200">
                <label className="text-sm font-medium text-foreground block mb-2">Frequência</label>
                <Select defaultValue="mensal">
                  <SelectTrigger className="bg-[#1C1C21] border-orange-500/50 text-foreground ring-1 ring-orange-500/20">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Toggle Parcelado */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="text-muted-foreground">💳</span> Parcelado
              </div>
              <Switch checked={isParcelado} onCheckedChange={setIsParcelado} />
            </div>

            {/* Expansão Condicional: Parcelas */}
            {isParcelado && (
              <div className="p-3 bg-black/20 border-t border-border/50 animate-in fade-in zoom-in-95 duration-200">
                <label className="text-sm font-medium text-foreground block mb-2">Quantidade de Parcelas</label>
                <input
                  type="number"
                  min="2"
                  placeholder="Ex: 12"
                  className="w-full bg-[#1C1C21] border border-orange-500/50 rounded-md px-3 py-2 text-sm text-foreground outline-none ring-1 ring-orange-500/20 transition-all"
                />
              </div>
            )}
          </div>

          {/* Contato Credor */}
          <div className="space-y-1.5 mt-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-orange-500" />
              WhatsApp do Credor
            </label>
            <input
              type="text"
              placeholder="Ex: 11999998888"
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
            <p className="text-[11px] text-muted-foreground">Apenas números com DDD. Contato rápido via WhatsApp.</p>
          </div>

          {/* Observações */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Observações</label>
            <textarea
              placeholder="Informações adicionais..."
              rows={3}
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all resize-none"
            />
          </div>

          {/* Botão de Submit */}
          <div className="pt-2">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm shadow-orange-500/20">
              Criar Conta
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}