import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { MonthYearPicker } from "@/components/dashboard/MonthYearPicker";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";

export const dynamic = "force-dynamic";

export default async function DashboardPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const formatBRL = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  let totalIncome = 0;
  let totalExpense = 0;
  let saldoTotal = 0;
  
  let chartData: { day: string; receita: number; despesa: number }[] = [];
  let categoryExpenses: { name: string; amount: number; percentage: number; icon: string | null; iconType: string | null }[] = [];
  let recentTxs: any[] = [];

  const supabase = await createClient();
  const {
    data: { user },
    error: supabaseError,
  } = await supabase.auth.getUser();

  const now = new Date();
  let currentYear = now.getFullYear();
  let currentMonth = now.getMonth();

  if (searchParams.month && searchParams.year) {
    const parseMonth = parseInt(searchParams.month as string) - 1;
    const parseYear = parseInt(searchParams.year as string);
    if (!isNaN(parseMonth) && !isNaN(parseYear) && parseMonth >= 0 && parseMonth <= 11) {
      currentMonth = parseMonth;
      currentYear = parseYear;
    }
  }

  // Utilizando Date.UTC pra estancar bug de Fuso Horário entre JS -03:00 vs Banco Postgres 00:00:00Z
  const startOfMonth = new Date(Date.UTC(currentYear, currentMonth, 1));
  const startOfNextMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 1));

  if (user && !supabaseError) {
    const workspace = await prisma.workspace.findFirst({
      where: {
        users: { some: { userId: user.id } },
      },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      select: { id: true, initialBalance: true },
    });

    if (workspace) {
      const [incomeAgg, expenseAgg] = await Promise.all([
        prisma.transaction.aggregate({
          _sum: { amount: true },
          where: {
            workspaceId: workspace.id,
            type: TransactionType.INCOME,
            date: { gte: startOfMonth, lt: startOfNextMonth },
          },
        }),
        prisma.transaction.aggregate({
          _sum: { amount: true },
          where: {
            workspaceId: workspace.id,
            type: TransactionType.EXPENSE,
            date: { gte: startOfMonth, lt: startOfNextMonth },
          },
        }),
      ]);

      totalIncome = incomeAgg._sum.amount ?? 0;
      totalExpense = expenseAgg._sum.amount ?? 0;
      
      // O Saldo global considera as movimentações em balanço - o ideal num app robusto é acumular os meses passados
      // mas para o escopo inicial: Initial Balance + Receitas Globais - Despesas Globais 
      saldoTotal = totalIncome - totalExpense + (workspace.initialBalance ?? 0);

      const monthTxs = await prisma.transaction.findMany({
        where: {
          workspaceId: workspace.id,
          date: { gte: startOfMonth, lt: startOfNextMonth },
        },
        include: { category: true },
        orderBy: { date: "asc" }
      });

      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const tempMap: Record<number, { receita: number; despesa: number }> = {};
      
      for (let i = 1; i <= daysInMonth; i++) {
        tempMap[i] = { receita: 0, despesa: 0 };
      }

      const expensesCatMap = new Map<string, { amount: number, icon: string | null, iconType: string | null }>();

      monthTxs.forEach((tx) => {
        const txDay = tx.date.getUTCDate();
        if (tx.type === TransactionType.INCOME) {
          tempMap[txDay].receita += tx.amount;
        } else {
          tempMap[txDay].despesa += tx.amount;
          
          const catName = tx.category?.name || "Sem categoria";
          const catData = expensesCatMap.get(catName) || { amount: 0, icon: tx.category?.icon || null, iconType: tx.category?.iconType || null };
          catData.amount += tx.amount;
          if (!catData.icon && tx.category?.icon) {
             catData.icon = tx.category.icon;
             catData.iconType = tx.category.iconType;
          }
          expensesCatMap.set(catName, catData);
        }
      });

      chartData = Object.entries(tempMap).map(([day, val]) => ({
        day: String(day).padStart(2, "0"),
        receita: val.receita,
        despesa: val.despesa,
      }));

      const sortedCategories = Array.from(expensesCatMap.entries())
        .sort((a, b) => b[1].amount - a[1].amount);
      
      categoryExpenses = sortedCategories.map(([name, data]) => ({
        name,
        amount: data.amount,
        percentage: totalExpense > 0 ? (data.amount / totalExpense) * 100 : 0,
        icon: data.icon,
        iconType: data.iconType
      }));

      recentTxs = await prisma.transaction.findMany({
        where: { workspaceId: workspace.id },
        include: { category: true },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        take: 5,
      });
    }
  }

  return (
    <div className="space-y-6 mt-2 pb-10 max-w-7xl mx-auto w-full px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Central</h1>
          <p className="text-white/60 text-sm mt-1">Sua visão geral financeira avançada</p>
        </div>
        <MonthYearPicker currentMonth={currentMonth} currentYear={currentYear} updateUrl={true} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[#292B49]/40 border-white/5 shadow-none rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Saldo do Período</CardTitle>
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <Wallet className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">{formatBRL(saldoTotal)}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#292B49]/40 border-white/5 shadow-none rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-500/80">Receitas</CardTitle>
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500 tracking-tight">
              + {formatBRL(totalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#292B49]/40 border-white/5 shadow-none rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-500/80">Despesas</CardTitle>
            <div className="bg-red-500/10 p-2 rounded-lg">
              <ArrowDownCircle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500 tracking-tight">
              - {formatBRL(totalExpense)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="bg-[#292B49]/30 border border-white/5 flex flex-col rounded-2xl shadow-none">
          <CardHeader>
            <CardTitle className="text-white text-lg font-bold">Fluxo de Caixa</CardTitle>
            <p className="text-white/50 text-xs">Curva financeira do mês analisado.</p>
          </CardHeader>
          <CardContent className="flex-1 min-h-[340px] pt-4">
            <CashFlowChart data={chartData} />
          </CardContent>
        </Card>

        <Card className="bg-[#292B49]/30 border border-white/5 flex flex-col rounded-2xl shadow-none">
          <CardHeader>
            <CardTitle className="text-white text-lg font-bold">Destino das Despesas</CardTitle>
            <p className="text-white/50 text-xs">Distribuição do seu orçamento</p>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[340px] pr-2 custom-scrollbar">
            {categoryExpenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-white/40 text-sm space-y-2">
                 <p>Nenhuma despesa processada</p>
              </div>
            ) : (
              <div className="space-y-5 pt-2">
                {categoryExpenses.map((cat, idx) => {
                  return (
                    <div key={cat.name} className="space-y-1.5 group">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2.5 text-white/90">
                          {cat.iconType === "EMOJI" ? (
                            <span className="text-lg leading-none bg-black/20 p-1.5 rounded-md">{cat.icon}</span>
                          ) : (
                            <span className="w-6 h-6 rounded-md bg-black/20 flex items-center justify-center border border-white/5" /> 
                          )}
                          <span className="font-semibold text-sm truncate max-w-[120px]">{cat.name}</span>
                        </div>
                        <span className="text-white/90 font-bold">{formatBRL(cat.amount)}</span>
                      </div>
                      <div className="relative h-2.5 w-full bg-[#0b1220] rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="absolute left-0 top-0 h-full rounded-full group-hover:brightness-125 transition-all duration-500 ease-out"
                          style={{
                            width: `${Math.max(2, cat.percentage)}%`,
                            background: idx === 0 ? "linear-gradient(90deg, #b91c1c, #ef4444)" : 
                                        idx === 1 ? "linear-gradient(90deg, #c2410c, #f97316)" : 
                                        idx === 2 ? "linear-gradient(90deg, #a16207, #eab308)" : 
                                        idx === 3 ? "linear-gradient(90deg, #4338ca, #6366f1)" :
                                        idx === 4 ? "linear-gradient(90deg, #0f766e, #14b8a6)" :
                                        "#8b5cf6" 
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#292B49]/30 border border-white/5 rounded-2xl shadow-none">
        <CardHeader>
          <CardTitle className="text-white text-lg font-bold">Transações Recentes</CardTitle>
          <p className="text-white/50 text-xs">Acompanhamento das últimas movimentações da carteira</p>
        </CardHeader>
        <CardContent>
          {recentTxs.length === 0 ? (
            <div className="text-center text-sm text-white/50 py-8 bg-[#0b1220]/50 rounded-xl border border-white/5">
              Sua conta ainda não possui movimentações.
            </div>
          ) : (
            <div className="space-y-3">
              {recentTxs.map((tx) => {
                const isIncome = tx.type === "INCOME";
                const isEmoji = tx.category?.iconType === "EMOJI";
                
                const day = String(tx.date.getUTCDate()).padStart(2, '0');
                const monthStr = String(tx.date.getUTCMonth() + 1).padStart(2, '0');
                const year = tx.date.getUTCFullYear();
                const displayDate = `${day}/${monthStr}/${year}`;

                return (
                  <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#0b1220] border border-white/5 hover:bg-[#0b1220]/80 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all ${isIncome ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20' : 'bg-red-500/10 group-hover:bg-red-500/20'}`}>
                        {isEmoji && tx.category?.icon ? (
                          <span className="text-2xl">{tx.category.icon}</span>
                        ) : isIncome ? (
                          <ArrowUpRight className="h-6 w-6 text-emerald-500" />
                        ) : (
                          <ArrowDownLeft className="h-6 w-6 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white/90">{tx.description}</p>
                        <p className="text-xs text-white/50 mt-1 uppercase tracking-wide font-medium">{tx.category?.name || "Geral"} • {displayDate}</p>
                      </div>
                    </div>
                    <div className={`text-base font-bold sm:mt-0 mt-3 sm:text-right ${isIncome ? 'text-emerald-500' : 'text-red-500'}`}>
                      {isIncome ? "+" : "-"} {formatBRL(tx.amount)}
                      <p className="text-[10px] text-white/30 truncate mt-0.5 font-normal tracking-wide">
                        Efetivada
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}