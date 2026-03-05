import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6 mt-2">
      {/* Grid com os 3 Cards Principais */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Card de Saldo */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 15.231,89</div>
            <p className="text-xs text-muted-foreground">
              Atualizado agora
            </p>
          </CardContent>
        </Card>

        {/* Card de Receitas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">+ R$ 5.432,00</div>
            <p className="text-xs text-muted-foreground">
              Valor recebido até o momento
            </p>
          </CardContent>
        </Card>

        {/* Card de Despesas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">- R$ 2.145,00</div>
            <p className="text-xs text-muted-foreground">
              Valor gasto até o momento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Esqueleto para os Gráficos e Tabela de Últimas Transações */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Fluxo de Caixa (Em breve)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 flex items-center justify-center h-\[300px] text-muted-foreground border-t border-border mt-4">
            O Gráfico de Barras entrará aqui...
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Últimas Transações (Em breve)</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-\[300px] text-muted-foreground border-t border-border mt-4">
            A lista com as 5 últimas movimentações entrará aqui...
          </CardContent>
        </Card>
      </div>
    </div>
  );
}