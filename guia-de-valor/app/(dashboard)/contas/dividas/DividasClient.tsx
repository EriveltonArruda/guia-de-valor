"use client";

import { useState } from "react";
import { Plus, Play, ChevronDown } from "lucide-react";
import { DividaModal } from "./DividaModal";

export default function DividasClient({ categorias = [], dividas = [] }: { categorias: any[], dividas: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="flex-1 overflow-auto bg-background p-6 lg:p-8 flex justify-center">
      <div className="max-w-5xl w-full">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Dívidas/Financiamentos
            </h1>
            <p className="text-muted-foreground text-sm">
              Gerencie suas dívidas e financiamentos (modelo carnê)
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-sm shadow-orange-500/20"
          >
            <Plus className="w-5 h-5" />
            Nova Dívida
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-[#1C1C21] border border-border rounded-xl p-5">
            <span className="text-sm font-medium text-muted-foreground block mb-2">Total de Dívidas ⓘ</span>
            <span className="text-2xl font-bold text-foreground">{formatBRL(0)}</span>
          </div>
          <div className="bg-[#1C1C21] border border-border rounded-xl p-5">
            <span className="text-sm font-medium text-muted-foreground block mb-2">Total Pago ⓘ</span>
            <span className="text-2xl font-bold text-orange-500">{formatBRL(0)}</span>
          </div>
          <div className="bg-[#1C1C21] border border-border rounded-xl p-5">
            <span className="text-sm font-medium text-muted-foreground block mb-2">Em Atraso ⓘ</span>
            <span className="text-2xl font-bold text-red-500">{formatBRL(0)}</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mb-10 mt-16">
          <p className="text-muted-foreground text-sm font-medium mb-4">Nenhuma dívida cadastrada</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm shadow-orange-500/20"
          >
            <Plus className="w-5 h-5" />
            Adicionar Primeira Dívida
          </button>
        </div>

        <div className="bg-[#1C1C21] border border-border rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors mt-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">7 - Como gerenciar suas dívidas</h3>
              <p className="text-sm text-muted-foreground">Clique para expandir o vídeo</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-background">
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

      </div>

      <DividaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categorias={categorias}
      />
    </div>
  );
}