"use client";

import { useState } from "react";
import { X, CreditCard, Loader2 } from "lucide-react";
import { createCreditCardAction, updateCreditCardAction } from "./actions";
import { useToast } from "@/hooks/use-toast";

export function CreditCardModal({ isOpen, onClose, initialData }: { isOpen: boolean; onClose: () => void; initialData?: any }) {
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState(initialData?.color || "#8B5CF6");
  const [limitInput, setLimitInput] = useState(
    initialData?.limit
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(initialData.limit)
      : ""
  );

  const { toast } = useToast();

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("color", color);

    const result = initialData?.id
      ? await updateCreditCardAction(initialData.id, formData)
      : await createCreditCardAction(formData);

    setLoading(false);

    if (result.ok) {
      toast({
        title: initialData?.id ? "Cartão atualizado" : "Cartão cadastrado",
        description: initialData?.id ? "As informações do cartão foram salvas." : "Seu novo cartão foi criado com sucesso.",
        variant: "default",
      });
      onClose();
    } else {
      toast({
        title: "Atenção",
        description: result.error || "Ocorreu um erro.",
        variant: "destructive",
      });
    }
  }

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (!value) {
      setLimitInput("");
      return;
    }
    const numberValue = Number(value) / 100;
    setLimitInput(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numberValue));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="bg-background w-full max-w-2xl rounded-xl shadow-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 text-orange-500 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{initialData ? "Editar Cartão" : "Novo Cartão"}</h2>
              <p className="text-sm text-muted-foreground">{initialData ? "Atualize as configurações deste cartão" : "Cadastre um novo cartão de crédito"}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Nome do Cartão <span className="text-red-500">*</span></label>
              <input name="name" defaultValue={initialData?.name} required type="text" placeholder="Ex: Nubank Principal" className="w-full bg-muted border-none rounded-lg p-3 text-foreground focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Bandeira <span className="text-red-500">*</span></label>
              <select name="brand" defaultValue={initialData?.brand || "Visa"} required className="w-full bg-muted border-none rounded-lg p-3 text-foreground focus:ring-2 focus:ring-orange-500 outline-none appearance-none">
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="Elo">Elo</option>
                <option value="American Express">American Express</option>
                <option value="Hipercard">Hipercard</option>
                <option value="Diners Club">Diners Club</option>
                <option value="MASTERCARD">Mastercard</option>
                <option value="VISA">Visa</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Últimos 4 dígitos</label>
              <input name="lastFourDigits" defaultValue={initialData?.lastFourDigits} type="text" maxLength={4} placeholder="Ex: 4321" className="w-full bg-muted border-none rounded-lg p-3 text-foreground focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Nome no Cartão</label>
              <input name="nameOnCard" defaultValue={initialData?.nameOnCard} type="text" placeholder="Ex: JOÃO DA SILVA" className="w-full bg-muted border-none rounded-lg p-3 text-foreground focus:ring-2 focus:ring-orange-500 outline-none uppercase" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Limite do Cartão <span className="text-red-500">*</span></label>
              <input name="limit" required type="text" value={limitInput} onChange={handleLimitChange} placeholder="R$ 0,00" className="w-full bg-muted border-none rounded-lg p-3 text-foreground focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Dia Fechamento <span className="text-red-500">*</span></label>
              <select name="closingDay" defaultValue={initialData?.closingDay || 1} required className="w-full bg-muted border-none rounded-lg p-3 text-foreground focus:ring-2 focus:ring-orange-500 outline-none appearance-none">
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Dia Vencimento <span className="text-red-500">*</span></label>
              <select name="dueDay" defaultValue={initialData?.dueDay || 1} required className="w-full bg-muted border-none rounded-lg p-3 text-foreground focus:ring-2 focus:ring-orange-500 outline-none appearance-none">
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Taxa de Juros Rotativo (% a.m.)</label>
              <input name="interestRate" defaultValue={initialData?.interestRate} type="number" step="0.01" placeholder="Ex: 14.5" className="w-full bg-muted border-none rounded-lg p-3 text-foreground focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="text-sm font-medium text-foreground mb-2 block">Cor do Cartão <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-3">
                {["#8B5CF6", "#10B981", "#F97316", "#EAB308", "#EF4444", "#3B82F6", "#EC4899", "#1E293B", "#64748B"].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c ? 'scale-110 border-white' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors shadow-sm shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center min-w-[150px]">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (initialData ? "Salvar Alterações" : "Cadastrar")}
          </button>
        </div>
      </form>
    </div>
  );
}
