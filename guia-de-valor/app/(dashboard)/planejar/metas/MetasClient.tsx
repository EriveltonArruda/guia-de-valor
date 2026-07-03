"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { MetaModal } from "./MetaModal";

export default function MetasClient({ metas = [] }: { metas: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 overflow-auto bg-background p-6 lg:p-8 flex justify-center">
      <div className="max-w-4xl w-full">

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Metas Financeiras
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-sm shadow-orange-500/20"
          >
            <Plus className="w-5 h-5" />
            Nova Meta
          </button>
        </div>

        {/* Área Central / Empty State */}
        {metas.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] mt-12">
            <p className="text-muted-foreground text-sm font-medium mb-5">
              Você ainda não tem metas cadastradas
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm shadow-orange-500/20"
            >
              <Plus className="w-5 h-5" />
              Criar primeira meta
            </button>
          </div>
        )}

      </div>

      {/* Modal */}
      <MetaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}