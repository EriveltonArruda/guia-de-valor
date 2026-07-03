"use client";

import { useState } from "react";
import { Plus, ShoppingCart } from "lucide-react";
import { ItemModal } from "./ItemModal";

export default function SupermercadoClient({ itens = [] }: { itens: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 overflow-auto bg-background p-6 lg:p-8 flex justify-center">
      <div className="max-w-4xl w-full">

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Lista de Supermercado
            </h1>
            <p className="text-muted-foreground text-sm">
              Organize suas compras
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-sm shadow-orange-500/20"
          >
            <Plus className="w-5 h-5" />
            Adicionar Item
          </button>
        </div>

        {/* Área Central / Empty State */}
        {itens.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] border border-border/50 rounded-xl p-8 bg-[#1C1C21]/20 mt-12 shadow-sm">
            <ShoppingCart className="w-14 h-14 text-muted-foreground opacity-50 mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-1">
              Sua lista está vazia
            </h2>
            <p className="text-muted-foreground text-sm font-medium mb-6 text-center">
              Adicione itens para começar a organizar suas compras
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm shadow-orange-500/20"
            >
              <Plus className="w-5 h-5" />
              Adicionar Primeiro Item
            </button>
          </div>
        )}

      </div>

      {/* Chamada do Modal */}
      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}