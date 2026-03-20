"use client";

import * as React from "react";
import { Info, Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  PatrimonioInitialOperation,
  savePatrimonioInicialAction,
} from "./actions";

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function GerenciarPatrimonioInicial({
  currentInitialBalance,
}: {
  currentInitialBalance: number;
}) {
  const [activeTab, setActiveTab] = React.useState<PatrimonioInitialOperation>(
    "add",
  );
  const [value, setValue] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isAdd = activeTab === "add";

  async function handleSave() {
    if (isSubmitting) return;

    const trimmed = value.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    try {
      await savePatrimonioInicialAction({
        operation: activeTab,
        value: trimmed,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border border-white/5 bg-[#0f172a] p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Gerenciar Patrimônio Inicial
          </h2>
          <p className="text-xs text-muted-foreground">
            Defina adições ou remoções no patrimônio inicial do seu workspace.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 text-sky-300 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-sky-200">
              Como funciona?
            </div>
            <p className="mt-1 text-xs text-sky-200/80">
              O patrimônio inicial atual é o valor-base do perfil. Use os
              botões abaixo para adicionar ou remover fundos, e informe o
              valor no campo em seguida.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="text-xs text-muted-foreground">
          Patrimônio inicial atual
        </div>
        <div className="mt-2 rounded-lg border border-lime-400/15 bg-[#071b12] px-4 py-3">
          <div className="text-2xl font-bold text-[#cce833]">
            {formatBRL(currentInitialBalance)}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => setActiveTab("add")}
          disabled={isSubmitting}
          className={[
            "rounded-lg border px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition",
            "border-emerald-400/35 bg-emerald-400/10 text-emerald-200",
            activeTab === "add"
              ? "ring-1 ring-emerald-400/40"
              : "opacity-80",
            isSubmitting ? "opacity-50 cursor-not-allowed" : "",
          ].join(" ")}
        >
          <Plus className="h-4 w-4" />
          Adicionar Fundos
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("remove")}
          disabled={isSubmitting}
          className={[
            "rounded-lg border px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition",
            "border-red-400/35 bg-red-400/10 text-red-200",
            activeTab === "remove"
              ? "ring-1 ring-red-400/40"
              : "opacity-80",
            isSubmitting ? "opacity-50 cursor-not-allowed" : "",
          ].join(" ")}
        >
          <Minus className="h-4 w-4" />
          Remover Fundos
        </button>
      </div>

      <div className="mt-5 space-y-3">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Valor</div>
          <Input
            name="value"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isSubmitting}
            className="h-11 bg-[#0b1220] border-white/10 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting || !value.trim()}
            className={[
              "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition",
              isAdd
                ? "bg-emerald-500 hover:bg-emerald-500/90 text-black"
                : "bg-red-500 hover:bg-red-500/90 text-black",
              isSubmitting || !value.trim()
                ? "opacity-50 cursor-not-allowed"
                : "",
            ].join(" ")}
          >
            {isAdd ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
            Salvar Alterações
          </button>
        </div>
      </div>
    </section>
  );
}

