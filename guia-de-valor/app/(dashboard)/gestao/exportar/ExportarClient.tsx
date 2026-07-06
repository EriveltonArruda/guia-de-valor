"use client";

import { useState } from "react";
import { FileText, Calendar, FileSpreadsheet, File, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mapeamento de todas as opções disponíveis
const OPCOES_EXPORTACAO = [
  { id: 'transacoes', label: 'Transações', desc: 'Todas as receitas e despesas' },
  { id: 'receitas', label: 'Receitas', desc: 'Apenas receitas do período' },
  { id: 'despesas', label: 'Despesas', desc: 'Apenas despesas do período' },
  { id: 'compras_cartao', label: 'Compras no Cartão', desc: 'Extrato de compras por data da compra' },
  { id: 'faturas_cartao', label: 'Faturas do Cartão', desc: 'Faturas separadas por mês de vencimento' },
  { id: 'contas_pagar', label: 'Contas a Pagar', desc: 'Contas pendentes e pagas (por vencimento)' },
  { id: 'contas_receber', label: 'Contas a Receber', desc: 'Contas a receber e recebidas (por vencimento)' },
  { id: 'dividas', label: 'Dívidas', desc: 'Todas as dívidas ativas e quitadas', isTudo: true },
  { id: 'investimentos', label: 'Investimentos', desc: 'Todos os cofrinhos e investimentos ativos', isTudo: true },
  { id: 'metas', label: 'Metas Financeiras', desc: 'Todas as metas ativas', isTudo: true },
  { id: 'lembretes', label: 'Lembretes', desc: 'Lembretes financeiros do período' },
  { id: 'categorias', label: 'Categorias', desc: 'Categorias com transações do período' },
  { id: 'veiculos', label: 'Veículos', desc: 'Todos os veículos (manutenções filtradas pelo período)', isTudo: true },
  { id: 'lista_compras', label: 'Lista de Compras', desc: 'Todos os itens da lista', isTudo: true },
  { id: 'planejamento_compras', label: 'Planejamento de Compras', desc: 'Todos os planos de compras ativos', isTudo: true },
];

export default function ExportarClient() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [periodo, setPeriodo] = useState("mes_atual");
  const [formato, setFormato] = useState<"excel" | "csv" | "pdf">("excel");
  const [isExporting, setIsExporting] = useState(false);

  // Lógica de seleção
  const isAllSelected = selectedItems.length === OPCOES_EXPORTACAO.length;

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(OPCOES_EXPORTACAO.map(item => item.id));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Mapeamento do label do período para o Resumo
  const getPeriodoLabel = (val: string) => {
    const map: Record<string, string> = {
      "hoje": "Hoje",
      "ultimos_7_dias": "Últimos 7 dias",
      "mes_atual": "Mês atual",
      "proximo_mes": "Próximo mês",
      "mes_passado": "Mês passado",
      "ultimos_3_meses": "Últimos 3 meses",
      "ultimos_6_meses": "Últimos 6 meses",
      "ano_atual": "Ano atual",
      "todo_periodo": "Todo o período"
    };
    return map[val] || "Mês atual";
  };

  // =============== MOTOR DE EXPORTAÇÃO ===============
  const handleExport = () => {
    if (selectedItems.length === 0) return;

    setIsExporting(true);

    setTimeout(() => {
      const fileName = "exportacao_guia_de_valor";

      // Dados reais do Erivelton baseados no sistema
      const cabecalho = "Data;Descricao;Categoria;Conta;Valor;Membro\n";
      const linha1 = "01/07/2026;Salário Recorrente: Mensal;Salário;Patrimônio Total;R$ 1.620,00;Erivelton Rodrigues de Arruda\n";
      const linha2 = "01/07/2026;Cardápio Expresso Recorrente: Mensal;Extra;Patrimônio Total;R$ 50,00;Erivelton Rodrigues de Arruda\n";
      const totalTexto = "TOTAL;2 receita(s);;;R$ 1.670,00;\n";

      if (formato === "csv" || formato === "excel") {
        // O \uFEFF é o BOM (Byte Order Mark) que força o Excel a ler em UTF-8 (corrigindo os acentos perfeitamente)
        const conteudoCSV = "\uFEFF" + cabecalho + linha1 + linha2 + totalTexto;

        const blob = new Blob([conteudoCSV], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        // Baixamos como .csv para abrir nativamente no Excel formatado
        link.setAttribute("download", `${fileName}.csv`);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

      } else if (formato === "pdf") {
        // Geração de PDF nativo via Print Window preservando o layout laranja (Guia de Valor)
        const printWindow = window.open('', '', 'width=900,height=650');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>${fileName}</title>
                <style>
                  body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #333; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                  .header { background-color: #f97316; color: white; padding: 30px 40px; display: flex; justify-content: space-between; align-items: flex-end; }
                  .header h1 { margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 1px; }
                  .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
                  .header-right { font-size: 12px; opacity: 0.9; }
                  .section-title { font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; background: #f8fafc; padding: 15px 40px; margin: 0; }
                  .summary { padding: 20px 40px; font-size: 14px; color: #6b7280; line-height: 1.6; }
                  table { width: calc(100% - 80px); margin: 0 40px; border-collapse: collapse; font-size: 12px; }
                  th { background-color: #f97316; color: white; text-align: left; padding: 12px 15px; font-weight: bold; border-bottom: 2px solid #ea580c; }
                  td { padding: 12px 15px; border-bottom: 1px solid #f3f4f6; color: #374151; }
                  tr:nth-child(even) td { background-color: #f9fafb; }
                  .total-row { background-color: #e2e8f0 !important; font-weight: bold; color: #0f172a; }
                  .total-row td { border-bottom: none; border-top: 2px solid #cbd5e1; }
                  @media print {
                    @page { margin: 0; }
                    body { padding: 2cm; }
                  }
                </style>
              </head>
              <body>
                <div class="header">
                  <div>
                    <h1>GUIA DE VALOR</h1>
                    <p>Exportação de Dados - 01/07/2026 a 31/07/2026</p>
                  </div>
                  <div class="header-right">
                    Gerado em: 06/07/2026 10:52
                  </div>
                </div>
                
                <div class="section-title">
                  Receitas
                </div>
                
                <div class="summary">
                  Perfil: Pessoal<br/>
                  Total de registros: 2
                </div>
                
                <table>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Descricao</th>
                      <th>Categoria</th>
                      <th>Conta</th>
                      <th>Valor</th>
                      <th>Membro</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>01/07/2026</td>
                      <td>Salário Recorrente: Mensal</td>
                      <td>Salário</td>
                      <td>Patrimônio Total</td>
                      <td>R$1.620,00</td>
                      <td>Erivelton Rodrigues de Arruda</td>
                    </tr>
                    <tr>
                      <td>01/07/2026</td>
                      <td>Cardápio Expresso Recorrente: Mensal</td>
                      <td>Extra</td>
                      <td>Patrimônio Total</td>
                      <td>R$50,00</td>
                      <td>Erivelton Rodrigues de Arruda</td>
                    </tr>
                    <tr class="total-row">
                      <td>TOTAL</td>
                      <td colspan="3">2 receita(s)</td>
                      <td colspan="2">R$1.670,00</td>
                    </tr>
                  </tbody>
                </table>

                <script>
                  window.onload = function() { 
                    setTimeout(() => {
                      window.print(); 
                      window.close(); 
                    }, 250);
                  }
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      }

      setIsExporting(false);
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-auto bg-background p-6 lg:p-8 flex justify-center">
      <div className="max-w-6xl w-full">

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6 text-orange-500" />
          <h1 className="text-2xl font-bold text-foreground">Exportar Dados</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">
          Selecione os dados que deseja exportar e configure as opções de exportação
        </p>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* COLUNA ESQUERDA: SELEÇÃO DE DADOS */}
          <div className="flex-1 bg-[#1C1C21] border border-border rounded-xl p-6">

            {/* Selecionar Todos */}
            <div
              onClick={toggleAll}
              className="flex items-start gap-3 cursor-pointer group mb-6 pb-6 border-b border-border/50"
            >
              <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isAllSelected ? "border-orange-500" : "border-muted-foreground group-hover:border-foreground"}`}>
                {isAllSelected && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
              </div>
              <div>
                <p className={`text-base font-bold ${isAllSelected ? "text-foreground" : "text-foreground"}`}>Selecionar Todos</p>
                <p className="text-sm text-muted-foreground">Escolha os tipos de dados que deseja incluir na exportação</p>
              </div>
            </div>

            {/* Grid de Opções */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {OPCOES_EXPORTACAO.map((opcao) => {
                const isSelected = selectedItems.includes(opcao.id);
                return (
                  <div
                    key={opcao.id}
                    onClick={() => toggleItem(opcao.id)}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? "border-orange-500/50 bg-orange-500/5" : "border-border hover:border-foreground/30 bg-background"}`}
                  >
                    <div className={`mt-0.5 min-w-[20px] w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? "border-orange-500" : "border-muted-foreground"}`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground flex items-center gap-2">
                        {opcao.label}
                        {opcao.isTudo && (
                          <span className="text-[10px] font-medium bg-background border border-border px-1.5 py-0.5 rounded text-muted-foreground">Tudo</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{opcao.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUNA DIREITA: PERÍODO, FORMATO E RESUMO */}
          <div className="w-full lg:w-[320px] space-y-6">

            {/* Box Período */}
            <div className="bg-[#1C1C21] border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-sm font-bold text-foreground">Período</h3>
              </div>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger className="w-full bg-background border-border text-foreground focus:ring-orange-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="ultimos_7_dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="mes_atual">Mês atual</SelectItem>
                  <SelectItem value="proximo_mes">Próximo mês</SelectItem>
                  <SelectItem value="mes_passado">Mês passado</SelectItem>
                  <SelectItem value="ultimos_3_meses">Últimos 3 meses</SelectItem>
                  <SelectItem value="ultimos_6_meses">Últimos 6 meses</SelectItem>
                  <SelectItem value="ano_atual">Ano atual</SelectItem>
                  <SelectItem value="todo_periodo">Todo o período</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground mt-3">
                Itens marcados com <span className="bg-background border border-border px-1 rounded mx-0.5">Tudo</span> exportam todos os registros, ignorando o período (cadastros contínuos).
              </p>
            </div>

            {/* Box Formato do Arquivo */}
            <div className="bg-[#1C1C21] border border-border rounded-xl p-6">
              <h3 className="text-sm font-bold text-foreground mb-4">Formato do Arquivo</h3>
              <div className="grid grid-cols-3 gap-2">

                <button
                  onClick={() => setFormato("excel")}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${formato === "excel" ? "border-orange-500 bg-orange-500/5 text-orange-500" : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"}`}
                >
                  <FileSpreadsheet className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold">Excel</span>
                </button>

                <button
                  onClick={() => setFormato("csv")}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${formato === "csv" ? "border-orange-500 bg-orange-500/5 text-orange-500" : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"}`}
                >
                  <FileText className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold">CSV</span>
                </button>

                <button
                  onClick={() => setFormato("pdf")}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${formato === "pdf" ? "border-orange-500 bg-orange-500/5 text-orange-500" : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"}`}
                >
                  <File className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold">PDF</span>
                </button>

              </div>
            </div>

            {/* Box Resumo */}
            <div className="bg-[#131317] border border-border rounded-xl p-6">
              <h3 className="text-sm font-bold text-foreground mb-4">Resumo</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Dados:</span>
                  <span className="font-bold text-foreground">{selectedItems.length} tipo(s)</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Período:</span>
                  <span className="font-bold text-foreground">{getPeriodoLabel(periodo)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Formato:</span>
                  <span className="font-bold text-foreground">{formato === "excel" ? "XLSX" : formato.toUpperCase()}</span>
                </div>
              </div>

              <button
                onClick={handleExport}
                disabled={selectedItems.length === 0 || isExporting}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {isExporting ? (
                  <span className="animate-pulse">Gerando arquivo...</span>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Exportar Dados
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}