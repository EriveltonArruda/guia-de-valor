"use client";

import { useState } from "react";
import { Plus, ListChecks } from "lucide-react";
import { CompraModal } from "./CompraModal";

export default function ComprasClient({ compras = [] }: { compras: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 overflow-auto bg-background p-6 lg:p-8 flex justify-center">
      <div className="max-w-4xl w-full">

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Planejamento de Compras
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-sm shadow-orange-500/20"
          >
            <Plus className="w-5 h-5" />
            Nova Compra
          </button>
        </div>

        {/* Área Central / Empty State */}
        {compras.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] border border-dashed border-border rounded-xl p-8 bg-[#1C1C21]/20 mt-12">
            <ListChecks className="w-16 h-16 text-muted-foreground opacity-40 mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-1">
              Nenhum planejamento ainda
            </h2>
            <p className="text-muted-foreground text-sm font-medium mb-6 text-center max-w-sm">
              Comece a planejar suas grandes compras e alcance seus objetivos financeiros.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm shadow-orange-500/20"
            >
              <Plus className="w-5 h-5" />
              Criar Primeiro Planejamento
            </button>
          </div>
        )}

      </div>

      {/* Chamada do Modal */}
      <CompraModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}