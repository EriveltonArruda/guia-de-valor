"use client";

import * as React from "react";
import { useActionState } from "react";
import { X, icons, Folder } from "lucide-react";
import type { CategoriaState } from "./actions";

type CategoryData = {
  id: string;
  name: string;
  type: string;
  icon: string;
  iconType: string;
};

const LUCIDE_ICONS_MOCK = [
  "Building2", "Home", "GraduationCap", "Briefcase", "Dices", "Wallet",
  "Car", "Monitor", "Users", "Gamepad2", "Megaphone", "ShoppingCart",
  "Wrench", "HeartPulse", "Wifi", "Package", "Scissors", "Coffee",
  "Shirt", "PiggyBank", "Plane", "Train", "Stethoscope", "Flame"
];

const EMOJIS_MOCK = [
  "🏢", "🏠", "📚", "🏭", "🎰", "💵",
  "⛽", "💻", "👥", "🎮", "📢", "🛒",
  "🔧", "💊", "🌐", "📦", "✂️", "☕",
  "👕", "🍔", "🍿", "🎉", "✈️", "🔥"
];

export default function NovaCategoriaModal({
  open,
  onOpenChange,
  workspaceId,
  createCategoriaAction,
  initialData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  createCategoriaAction: (
    prevState: CategoriaState,
    formData: FormData
  ) => Promise<CategoriaState>;
  initialData?: CategoryData | null;
}) {
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState("EXPENSE");
  const [icon, setIcon] = React.useState("Building2");
  const [iconType, setIconType] = React.useState("UI_ICON");

  const [activeTab, setActiveTab] = React.useState<"Ícones" | "Emojis">("Ícones");

  const initialState: CategoriaState = { ok: false };
  const [state, formAction] = useActionState(createCategoriaAction, initialState);

  React.useEffect(() => {
    if (!open) return;
    if (initialData) {
      setName(initialData.name);
      setType(initialData.type);
      setIcon(initialData.icon);
      setIconType(initialData.iconType);
      setActiveTab(initialData.iconType === "EMOJI" ? "Emojis" : "Ícones");
    } else {
      setName("");
      setType("EXPENSE");
      setIcon("Building2");
      setIconType("UI_ICON");
      setActiveTab("Ícones");
    }
  }, [open, initialData]);

  React.useEffect(() => {
    if (!open) return;
    if (state.ok) onOpenChange(false);
  }, [state.ok, open, onOpenChange]);

  if (!open) return null;

  const submitDisabled = !name.trim() || !icon.trim();

  // Selected icon preview
  let SelectedIconPreview;
  if (iconType === "EMOJI") {
    SelectedIconPreview = <span className="text-xl leading-none">{icon}</span>;
  } else {
    const LucideIcon = icons[icon as keyof typeof icons] as React.ElementType || Folder;
    SelectedIconPreview = <LucideIcon className="h-6 w-6 text-white" />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      <div className="relative w-full max-w-[500px] mx-4 rounded-3xl border border-[#292B49] bg-[#292B49] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-bold text-white">
            {initialData ? "Editar Categoria" : "Nova Categoria"}
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-2 text-white/50 hover:text-white hover:bg-white/5 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form action={formAction} className="mt-4 space-y-4">
          <input type="hidden" name="workspaceId" value={workspaceId} />
          {initialData && <input type="hidden" name="id" value={initialData.id} />}
          <input type="hidden" name="icon" value={icon} />
          <input type="hidden" name="iconType" value={iconType} />

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Nome</label>
            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Alimentação"
              className="w-full h-12 rounded-xl border border-white/10 bg-[#0b1220] px-4 text-white outline-none focus:border-[#ED6936] focus:ring-1 focus:ring-[#ED6936] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Tipo</label>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full h-12 rounded-xl border border-white/10 bg-[#0b1220] px-4 text-white outline-none focus:border-[#ED6936] focus:ring-1 focus:ring-[#ED6936] transition-all"
            >
              <option value="EXPENSE">Despesa</option>
              <option value="INCOME">Receita</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Ícone</label>
            
            <div className="h-12 w-full flex items-center gap-3 px-4 rounded-xl border border-white/10 bg-[#0b1220] text-white/80 cursor-default">
               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 shrink-0">
                 {SelectedIconPreview}
               </div>
               <span className="text-sm">Clique abaixo para alterar</span>
            </div>

            <div className="mt-2 rounded-2xl border border-[#0b1220]/50 bg-[#1a1c33] p-3 shadow-inner">
              <div className="flex gap-1 rounded-lg bg-[#0b1220] p-1 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("Ícones")}
                  className={[
                    "flex-1 py-1.5 text-sm font-semibold rounded-md transition",
                    activeTab === "Ícones" ? "bg-[#ED6936] text-black" : "text-white/60 hover:text-white"
                  ].join(" ")}
                >
                  Ícones
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("Emojis")}
                  className={[
                    "flex-1 py-1.5 text-sm font-semibold rounded-md transition",
                    activeTab === "Emojis" ? "bg-[#ED6936] text-black" : "text-white/60 hover:text-white"
                  ].join(" ")}
                >
                  Emojis
                </button>
              </div>

              <div className="h-44 overflow-y-auto pr-1 customize-scrollbar">
                {activeTab === "Ícones" && (
                  <div className="grid grid-cols-6 sm:grid-cols-6 gap-2">
                    {LUCIDE_ICONS_MOCK.map((iconName) => {
                      const IconComp = icons[iconName as keyof typeof icons] as React.ElementType;
                      const isSelected = iconType === "UI_ICON" && icon === iconName;
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => {
                            setIcon(iconName);
                            setIconType("UI_ICON");
                          }}
                          className={[
                            "flex aspect-square items-center justify-center rounded-xl border transition",
                            isSelected
                              ? "border-[#ED6936] bg-[#ED6936]/10 text-[#ED6936]"
                              : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                          ].join(" ")}
                        >
                          {IconComp && <IconComp className="h-5 w-5" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {activeTab === "Emojis" && (
                  <div className="grid grid-cols-6 sm:grid-cols-6 gap-2">
                    {EMOJIS_MOCK.map((emoji) => {
                      const isSelected = iconType === "EMOJI" && icon === emoji;
                      return (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setIcon(emoji);
                            setIconType("EMOJI");
                          }}
                          className={[
                            "flex aspect-square items-center justify-center rounded-xl border text-xl transition",
                            isSelected
                              ? "border-[#ED6936] bg-[#ED6936]/10"
                              : "border-transparent hover:bg-white/5"
                          ].join(" ")}
                        >
                          {emoji}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {!state.ok && state.error && (
            <div className="text-sm font-medium text-red-400 bg-red-400/10 py-2.5 px-3 rounded-lg border border-red-400/20">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitDisabled}
            className={[
              "w-full h-12 rounded-xl font-bold transition flex items-center justify-center mt-2",
              submitDisabled
                ? "bg-[#ED6936]/40 text-black/70 cursor-not-allowed"
                : "bg-[#ED6936] hover:bg-[#ED6936]/90 text-black",
            ].join(" ")}
          >
            {initialData ? "Salvar Alterações" : "Salvar Categoria"}
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .customize-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .customize-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .customize-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .customize-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}
