"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, Coins } from "lucide-react";

interface InvestimentoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InvestimentoModal({ isOpen, onClose }: InvestimentoModalProps) {
  const [hasIOF, setHasIOF] = useState(false);
  const [hasIR, setHasIR] = useState(false);
  const [origemDinheiro, setOrigemDinheiro] = useState<"caixa" | "externa">("caixa");

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setHasIOF(false);
      setHasIR(false);
      setOrigemDinheiro("caixa");
    }
    onClose();
  };

  const bancos = ["Ágora", "Ame Digital", "Banco BMG", "Banco do Brasil", "Banco Inter", "Banco Original", "Banco Pan", "Banrisul", "Binance", "Caixa", "Nubank", "Itaú"];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-[#121214] border-border text-foreground p-0 overflow-hidden rounded-xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold">Novo Investimento</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 pt-2 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Nome do Investimento *</label>
              <input type="text" placeholder="Ex: CDB Banco Inter" className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Tipo *</label>
              <Select defaultValue="renda_fixa">
                <SelectTrigger className="bg-[#1C1C21] border-border text-foreground focus:ring-orange-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="renda_fixa">Renda Fixa</SelectItem>
                  <SelectItem value="renda_variavel">Renda Variável</SelectItem>
                  <SelectItem value="cripto">Criptomoedas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Instituição *</label>
              <Select>
                <SelectTrigger className="bg-[#1C1C21] border-border text-foreground focus:ring-orange-500">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {bancos.map(b => <SelectItem key={b} value={b.toLowerCase()}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Valor Inicial (R$) *</label>
              <input type="text" placeholder="0,00" className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Valor Atual (R$) *</label>
              <input type="text" placeholder="0,00" className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Meta (R$)</label>
              <input type="text" placeholder="Opcional" className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500" />
            </div>
          </div>

          <div className="space-y-1.5 w-1/2 pr-2">
            <label className="text-sm font-medium text-foreground">Quantidade (Cotas/Ações/Crip) *</label>
            <input type="number" defaultValue="1" className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500" />
          </div>

          {/* BOX DE TAXAS (IOF e IR) */}
          <div className="bg-[#1C1C21] border border-border rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-foreground">Taxas (opcionais para cálculo de rendimento líquido)</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-32">
                <Switch checked={hasIOF} onCheckedChange={setHasIOF} className="data-[state=checked]:bg-orange-500" />
                <span className="text-sm font-bold">IOF</span>
              </div>
              <div className="flex-1 flex items-center gap-2 opacity-50 transition-opacity" style={{ opacity: hasIOF ? 1 : 0.5 }}>
                <input disabled={!hasIOF} type="text" placeholder="0 = auto" className="w-24 bg-background border border-border rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-orange-500 disabled:cursor-not-allowed" />
                <span className="text-xs text-muted-foreground">% Deixe 0 para calcular automaticamente (96%→0% nos primeiros 30 dias)</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-32">
                <Switch checked={hasIR} onCheckedChange={setHasIR} className="data-[state=checked]:bg-orange-500" />
                <span className="text-sm font-bold">Imposto de Renda</span>
              </div>
              <div className="flex-1 flex items-center gap-2 opacity-50 transition-opacity" style={{ opacity: hasIR ? 1 : 0.5 }}>
                <input disabled={!hasIR} type="text" placeholder="0 = auto" className="w-24 bg-background border border-border rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-orange-500 disabled:cursor-not-allowed" />
                <span className="text-xs text-muted-foreground">% Deixe 0 para usar tabela automática (22,5%→15% conforme prazo)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Data de Início *</label>
              <div className="relative"><CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="date" className="w-full bg-[#1C1C21] border border-border rounded-md pl-10 pr-3 py-2 text-sm color-scheme-dark outline-none focus:ring-1 focus:ring-orange-500" /></div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Data de Vencimento (Opcional)</label>
              <div className="relative"><CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="date" className="w-full bg-[#1C1C21] border border-border rounded-md pl-10 pr-3 py-2 text-sm color-scheme-dark outline-none focus:ring-1 focus:ring-orange-500" /></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Taxa Esperada (%)</label>
              <input type="text" className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Tipo de Taxa</label>
              <Select defaultValue="anual"><SelectTrigger className="bg-[#1C1C21] border-border focus:ring-orange-500"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="anual">Anual</SelectItem><SelectItem value="mensal">Mensal</SelectItem></SelectContent></Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Observações</label>
            <textarea rows={2} className="w-full bg-[#1C1C21] border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500 resize-none" />
          </div>

          {/* BOX ORIGEM DO DINHEIRO */}
          <div className="bg-blue-950/20 border border-blue-900/40 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Coins className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold text-foreground">Origem do Dinheiro (obrigatório)</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Escolha se o valor será debitado do seu caixa ou é de fonte externa</p>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-all ${origemDinheiro === "caixa" ? "border-orange-500" : "border-muted-foreground group-hover:border-foreground"}`}>
                  {origemDinheiro === "caixa" && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                </div>
                <input type="radio" className="hidden" checked={origemDinheiro === "caixa"} onChange={() => setOrigemDinheiro("caixa")} />
                <div>
                  <p className={`text-sm font-bold ${origemDinheiro === "caixa" ? "text-foreground" : "text-muted-foreground"}`}>Sim, usar dinheiro do meu caixa</p>
                  <p className="text-xs text-muted-foreground">Debita R$ 0,00 do patrimônio total (cria despesa)</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-all ${origemDinheiro === "externa" ? "border-orange-500" : "border-muted-foreground group-hover:border-foreground"}`}>
                  {origemDinheiro === "externa" && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                </div>
                <input type="radio" className="hidden" checked={origemDinheiro === "externa"} onChange={() => setOrigemDinheiro("externa")} />
                <div>
                  <p className={`text-sm font-bold ${origemDinheiro === "externa" ? "text-foreground" : "text-muted-foreground"}`}>Não, é de fonte externa</p>
                  <p className="text-xs text-muted-foreground">Apenas registra o investimento (não afeta o patrimônio total)</p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg font-bold transition-colors shadow-sm shadow-orange-500/20">Salvar</button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}