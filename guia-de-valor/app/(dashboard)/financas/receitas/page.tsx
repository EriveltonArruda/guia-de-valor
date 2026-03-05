import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function ReceitasPage() {
  return (
    <div className="space-y-6 mt-2">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Receitas</h1>
        <p className="text-muted-foreground">
          Gerencie todas as suas entradas de dinheiro nesta tela.
        </p>
      </div>

      <Card className="max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Receitas (Exemplo)</CardTitle>
          <TrendingUp className="h-4 w-4 text-[#ED6936]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#ED6936]">+ R$ 5.432,00</div>
          <p className="text-xs text-muted-foreground">
            Página de teste para validar a navegação da Sidebar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}