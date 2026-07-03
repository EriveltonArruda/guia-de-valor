"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ItemModal({ isOpen, onClose }: ItemModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-[#121214] border-border text-foreground p-0 overflow-hidden rounded-xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold">
            Adicionar Item
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 pt-2 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">

          {/* Nome do Produto */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Nome do Produto *</label>
            <input
              type="text"
              placeholder="Ex: Arroz, Feijão, Leite..."
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          {/* Quantidade e Unidade (Grid) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Quantidade *</label>
              <input
                type="number"
                defaultValue="1"
                className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Unidade</label>
              <Select defaultValue="unidade">
                <SelectTrigger className="bg-[#1C1C21] border-border text-foreground focus:ring-orange-500">
                  <SelectValue placeholder="Unidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unidade">Unidade</SelectItem>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="gramas">Gramas</SelectItem>
                  <SelectItem value="litro">Litro</SelectItem>
                  <SelectItem value="ml">ML</SelectItem>
                  <SelectItem value="pacote">Pacote</SelectItem>
                  <SelectItem value="caixa">Caixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preço Estimado */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Preço Estimado R$ (opcional)</label>
            <input
              type="text"
              placeholder="0,00"
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          {/* Observações */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Observações</label>
            <textarea
              placeholder="Ex: Marca preferida, ofertas..."
              rows={3}
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all resize-none"
            />
          </div>

          {/* Botões do Rodapé */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold transition-colors shadow-sm shadow-orange-500/20">
              Adicionar
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}