"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car } from "lucide-react";

interface VeiculoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VeiculoModal({ isOpen, onClose }: VeiculoModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-[#121214] border-border text-foreground p-0 overflow-hidden rounded-xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold">
            Novo Veículo
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 pt-2 space-y-4">

          {/* Tipo de Veículo */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Tipo de Veículo *</label>
            <Select defaultValue="carro">
              <SelectTrigger className="w-full bg-[#1C1C21] border-border text-foreground focus:ring-orange-500 h-10">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Selecione" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carro">Carro</SelectItem>
                <SelectItem value="moto">Moto</SelectItem>
                <SelectItem value="caminhao">Caminhão</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nome */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Nome *</label>
            <input
              type="text"
              placeholder="Ex: Meu Carro"
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          {/* Placa */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Placa</label>
            <input
              type="text"
              placeholder="Ex: ABC-1234"
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all uppercase"
            />
          </div>

          {/* Modelo */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Modelo</label>
            <input
              type="text"
              placeholder="Ex: Honda Civic"
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          {/* Ano */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Ano</label>
            <input
              type="text"
              placeholder="Ex: 2020"
              className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          {/* Cor do Ícone */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Cor do ícone</label>
            <div className="h-10 w-full bg-[#1C1C21] border border-border rounded-md p-1">
              <input
                type="color"
                defaultValue="#3b82f6"
                className="w-full h-full rounded cursor-pointer border-0 p-0 bg-transparent"
              />
            </div>
          </div>

          {/* Botão Submeter */}
          <div className="pt-4">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm shadow-orange-500/20">
              Adicionar
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}