"use client";

import { useState } from "react";
import { Plus, Bell } from "lucide-react";
import { LembreteModal } from "./LembreteModal";

export default function LembretesClient({ lembretes = [] }: { lembretes: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 overflow-auto bg-background p-6 lg:p-8 flex justify-center">
      <div className="max-w-4xl w-full">

        {/* Cabeçalho da Página */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Bell className="w-6 h-6 text-orange-500" /> Lembretes
            </h1>
            <p className="text-muted-foreground text-sm">
              Gerencie seus lembretes financeiros
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-sm shadow-orange-500/20"
          >
            <Plus className="w-5 h-5" />
            Novo Lembrete
          </button>
        </div>

        {/* Área Central / Empty State */}
        {lembretes.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] border border-dashed border-border rounded-xl p-8 bg-[#1C1C21]/20 mt-12">
            <Bell className="w-12 h-12 text-muted-foreground opacity-30 mb-4" />
            <p className="text-muted-foreground text-sm font-medium mb-5">Nenhum lembrete cadastrado</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm shadow-orange-500/20"
            >
              <Plus className="w-5 h-5" />
              Adicionar Primeiro Lembrete
            </button>
          </div>
        )}

      </div>

      {/* Chamada do Modal */}
      <LembreteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}