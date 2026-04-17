"use client";

import { useState, useRef } from "react";
import { X, Receipt, Loader2 } from "lucide-react";
import { createCreditCardTransactionAction } from "./actions";
import { useToast } from "@/hooks/use-toast";

export function CreditCardTransactionModal({ 
  isOpen, 
  onClose, 
  cardId,
  categories = []
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  cardId: string;
  categories: any[];
}) {
  const [loading, setLoading] = useState(false);
  const [amountInput, setAmountInput] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const { toast } = useToast();

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("creditCardId", cardId);
    
    const result = await createCreditCardTransactionAction(formData);
    
    setLoading(false);
    
    if (result.ok) {
      toast({
        title: "Compra registrada!",
        description: "A transação foi adicionada à fatura do seu cartão com sucesso.",
        variant: "default"
      });
      setAmountInput("");
      formRef.current?.reset();
      onClose();
    } else {
      toast({
        title: "Erro ao registrar a compra",
        description: result.error || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (!value) {
      setAmountInput("");
      return;
    }
    const numberValue = Number(value) / 100;
    setAmountInput(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numberValue));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form ref={formRef} onSubmit={handleSubmit} className="bg-background w-full max-w-2xl rounded-xl shadow-lg flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 text-purple-500 rounded-lg">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Nova Compra</h2>
              <p className="text-sm text-muted-foreground">Lance uma nova despesa neste cartão</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="text-sm font-medium text-foreground mb-1 block">Descrição da Compra <span className="text-red-500">*</span></label>
              <input name="description" required type="text" placeholder="Ex: Assinatura Netflix, Farmácia..." className="w-full bg-muted border-none rounded-lg p-3 text-foreground focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Valor Total <span className="text-red-500">*</span></label>
              <input name="amount" required type="text" value={amountInput} onChange={handleAmountChange} placeholder="R$ 0,00" className="w-full bg-muted border-none rounded-lg p-3 text-foreground focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Data da Compra <span className="text-red-500">*</span></label>
              <input name="date" required type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-muted border-none rounded-lg p-3 text-foreground focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Categoria da Compra <span className="text-red-500">*</span></label>
              <select name="categoryId" className="w-full bg-muted border-none rounded-lg p-3 text-foreground focus:ring-2 focus:ring-purple-500 outline-none appearance-none">
                {categories.map(c => (
                   <option key={c.id} value={c.id}>{c.name}</option>
                ))}
                {categories.length === 0 && <option value="">Sem categoria disponível</option>}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Parcelas</label>
              <select name="installments" className="w-full bg-muted border-none rounded-lg p-3 text-foreground focus:ring-2 focus:ring-purple-500 outline-none appearance-none">
                {Array.from({length: 12}, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n}x</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-1 md:col-span-2 flex items-center gap-3 bg-muted/50 p-4 rounded-lg border border-border">
              <input type="checkbox" name="isRecurring" id="isRecurring" className="w-5 h-5 accent-purple-500 rounded" />
              <div className="flex flex-col">
                <label htmlFor="isRecurring" className="text-sm font-medium text-foreground cursor-pointer">Compra Recorrente (Assinatura)</label>
                <span className="text-xs text-muted-foreground">A fatura receberá este valor todos os meses indefinidamente.</span>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="text-sm font-medium text-foreground mb-1 block">Observações</label>
              <textarea name="notes" placeholder="Detalhes adicionais..." rows={3} className="w-full bg-muted border-none rounded-lg p-3 text-foreground focus:ring-2 focus:ring-purple-500 outline-none resize-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-sm shadow-purple-500/20 disabled:opacity-50 flex items-center justify-center min-w-[170px]">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Registrar Compra"}
          </button>
        </div>
      </form>
    </div>
  );
}
