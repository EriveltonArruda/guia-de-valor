import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import {
  Info,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  InvestmentStatus,
  TransactionType,
  WorkspaceType,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import GerenciarPatrimonioInicial from "./GerenciarPatrimonioInicial";
import TransferirEntrePerfis from "./TransferirEntrePerfis";

function formatBrShort(value: number) {
  // Mantém a fidelidade dos cards (ex.: "R$ 0,00") sem estourar largura.
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);
}

function labelWorkspaceType(type: WorkspaceType) {
  if (type === "BUSINESS") return "Empresarial";
  return "Pessoal";
}

export async function updateInitialBalanceAction(formData: FormData) {
  "use server";

  const rawValue = formData.get("value");
  const operation = String(formData.get("operation") ?? "ADD");
  const workspaceId = String(formData.get("workspaceId") ?? "");

  const str = String(rawValue ?? "").trim();
  if (!workspaceId) return;

  const normalized = str.replace(/\./g, "").replace(",", ".");
  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      users: { some: { userId: user.id } },
    },
    select: { id: true, initialBalance: true },
  });
  if (!workspace) return;

  const sign = operation === "REMOVE" ? -1 : 1;
  const nextInitialBalance = Math.max(0, workspace.initialBalance + sign * value);

  await prisma.workspace.update({
    where: { id: workspace.id },
    data: { initialBalance: nextInitialBalance },
  });

  // Atualiza a tela do patrimônio e também o dashboard principal ("/"),
  // pois o saldo exibido nos cards depende do initialBalance.
  revalidatePath("/financas/patrimonio");
  revalidatePath("/");
}

export async function transferBetweenProfilesAction(formData: FormData) {
  "use server";

  const rawValue = formData.get("value");
  const originWorkspaceId = String(formData.get("originWorkspaceId") ?? "");
  const destinationWorkspaceId = String(
    formData.get("destinationWorkspaceId") ?? "",
  );

  const str = String(rawValue ?? "").trim();
  if (!originWorkspaceId || !destinationWorkspaceId) return;

  const normalized = str.replace(/\./g, "").replace(",", ".");
  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const origin = await prisma.workspace.findFirst({
    where: {
      id: originWorkspaceId,
      users: { some: { userId: user.id } },
    },
    select: { id: true, initialBalance: true },
  });
  const destination = await prisma.workspace.findFirst({
    where: {
      id: destinationWorkspaceId,
      users: { some: { userId: user.id } },
    },
    select: { id: true, initialBalance: true },
  });

  if (!origin || !destination) return;
  if (origin.id === destination.id) return;

  const nextOriginInitialBalance = Math.max(0, origin.initialBalance - value);
  const nextDestinationInitialBalance =
    destination.initialBalance + value;

  await prisma.$transaction(async (tx) => {
    await tx.workspace.update({
      where: { id: origin.id },
      data: { initialBalance: nextOriginInitialBalance },
    });
    await tx.workspace.update({
      where: { id: destination.id },
      data: { initialBalance: nextDestinationInitialBalance },
    });
  });

  revalidatePath("/financas/patrimonio");
}

function EvolutionChart({ values }: { values: number[] }) {
  // Placeholder estático, mas desenhado a partir de `values` para ficar coerente com os números atuais.
  const width = 820;
  const height = 280;
  const padLeft = 48;
  const padRight = 16;
  const padTop = 22;
  const padBottom = 44;

  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const range = max - min || 1;

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const toX = (i: number) =>
    padLeft + (i * plotW) / Math.max(1, values.length - 1);
  const toY = (v: number) => padTop + (1 - (v - min) / range) * plotH;

  const pts = values.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
  const area = `${padLeft},${toY(0)} ${pts} ${padLeft + plotW},${toY(0)}`;

  return (
    <div className="w-full h-[280px] overflow-hidden rounded-xl border border-white/5 bg-[#0b1220]">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <defs>
          <linearGradient id="areaGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cce833" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#cce833" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#cce833" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="lineGreen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#cce833" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#cce833" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {Array.from({ length: 6 }).map((_, i) => {
          const y = padTop + (i * plotH) / 5;
          return (
            <line
              key={i}
              x1={padLeft}
              x2={padLeft + plotW}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          );
        })}

        {/* Area + Linha */}
        <polygon points={area} fill="url(#areaGreen)" />
        <polyline
          points={pts}
          fill="none"
          stroke="url(#lineGreen)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default async function PatrimonioContaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const workspace = user
    ? await prisma.workspace.findFirst({
        where: {
          users: { some: { userId: user.id } },
        },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        select: { id: true, type: true, initialBalance: true },
      })
    : null;

  const activeWorkspaceId = workspace?.id ?? null;
  const activeWorkspaceType = (workspace?.type ?? "PERSONAL") as WorkspaceType;
  const activeProfileLabel = labelWorkspaceType(activeWorkspaceType);

  const [saldoResult, investResult] = await Promise.all([
    activeWorkspaceId
      ? Promise.all([
          prisma.transaction.aggregate({
            _sum: { amount: true },
            where: {
              workspaceId: activeWorkspaceId,
              type: TransactionType.INCOME,
            },
          }),
          prisma.transaction.aggregate({
            _sum: { amount: true },
            where: {
              workspaceId: activeWorkspaceId,
              type: TransactionType.EXPENSE,
            },
          }),
        ])
      : Promise.resolve([
          { _sum: { amount: 0 } },
          { _sum: { amount: 0 } },
        ]),
    activeWorkspaceId
      ? prisma.investment.aggregate({
          _sum: { currentAmount: true },
          where: {
            workspaceId: activeWorkspaceId,
            status: InvestmentStatus.ACTIVE,
          },
        })
      : Promise.resolve({ _sum: { currentAmount: 0 } }),
  ]);

  const income = (saldoResult as any)[0]?._sum?.amount ?? 0;
  const expense = (saldoResult as any)[1]?._sum?.amount ?? 0;
  const saldo = income - expense;

  const investimentos = (investResult as any)?._sum?.currentAmount ?? 0;
  const patrimonioInicial = workspace?.initialBalance ?? 0;
  const patrimonioTotal = patrimonioInicial + saldo + investimentos;

  const personalWorkspace = user
    ? await prisma.workspace.findFirst({
        where: {
          users: { some: { userId: user.id } },
          type: WorkspaceType.PERSONAL,
        },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        select: { id: true, initialBalance: true, type: true },
      })
    : null;

  const businessWorkspace = user
    ? await prisma.workspace.findFirst({
        where: {
          users: { some: { userId: user.id } },
          type: WorkspaceType.BUSINESS,
        },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        select: { id: true, initialBalance: true, type: true },
      })
    : null;

  const profiles =
    personalWorkspace && businessWorkspace
      ? [
          {
            label: "Pessoal (Pessoal)",
            workspaceId: personalWorkspace.id,
            initialBalance: personalWorkspace.initialBalance,
            type: personalWorkspace.type,
          },
          {
            label: "Empresarial (Empresarial)",
            workspaceId: businessWorkspace.id,
            initialBalance: businessWorkspace.initialBalance,
            type: businessWorkspace.type,
          },
        ]
      : personalWorkspace
        ? [
            {
              label: "Pessoal (Pessoal)",
              workspaceId: personalWorkspace.id,
              initialBalance: personalWorkspace.initialBalance,
              type: personalWorkspace.type,
            },
          ]
        : businessWorkspace
          ? [
              {
                label: "Empresarial (Empresarial)",
                workspaceId: businessWorkspace.id,
                initialBalance: businessWorkspace.initialBalance,
                type: businessWorkspace.type,
              },
            ]
          : [];

  const evolutionValues =
    saldo === 0 && investimentos === 0
      ? [patrimonioInicial, patrimonioInicial, patrimonioInicial, patrimonioInicial, patrimonioInicial, 0]
      : [
          patrimonioInicial + saldo * 0.2,
          patrimonioInicial + saldo * 0.35,
          patrimonioInicial + saldo * 0.5,
          patrimonioInicial + saldo * 0.45,
          patrimonioInicial + saldo * 0.25,
          patrimonioTotal,
        ];

  return (
    <div className="space-y-6 mt-2 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Patrimônio (Conta)
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gerencie suas finanças e acompanhe o patrimônio total com base em
            saldo e investimentos.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/25 bg-lime-400/10 px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-[#cce833]" />
          <span className="text-xs font-semibold text-lime-200">
            Perfil Ativo: {activeProfileLabel}
          </span>
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-white/5 bg-[#0f172a] p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground font-medium">
              Patrimônio Total
            </div>
            <Wallet className="h-4 w-4 text-lime-400" />
          </div>
          <div className="mt-2 text-lg font-bold text-[#cce833]">
            {formatBrShort(patrimonioTotal)}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {activeProfileLabel} + investimentos
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#0f172a] p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground font-medium">
              Patrimônio Inicial
            </div>
            <TrendingUp className="h-4 w-4 text-[#cce833]" />
          </div>
          <div className="mt-2 text-lg font-bold text-[#cce833]">
            {formatBrShort(patrimonioInicial)}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Base atual do workspace
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#0f172a] p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground font-medium">
              Saldo
            </div>
            {saldo >= 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
          </div>
          <div
            className={`mt-2 text-lg font-bold ${
              saldo >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {formatBrShort(saldo)}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            INCOME - EXPENSE
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#0f172a] p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground font-medium">
              Investimentos
            </div>
            <Wallet className="h-4 w-4 text-lime-400" />
          </div>
          <div className="mt-2 text-lg font-bold text-[#cce833]">
            {formatBrShort(investimentos)}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Somatório de investimentos ativos
          </div>
        </div>
      </div>

      {/* Evolução */}
      <Card className="border-white/5 bg-[#0b1220]">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">
            Evolução do Patrimônio
          </CardTitle>
          <div className="text-xs text-muted-foreground mt-1">
            Acompanhamento da evolução do patrimônio nos últimos 6 meses.
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <EvolutionChart values={evolutionValues} />
        </CardContent>
      </Card>

      {/* Gerenciar Patrimônio Inicial */}
      <div className="grid gap-4">
        <GerenciarPatrimonioInicial currentInitialBalance={patrimonioInicial} />
      </div>

      {/* Transferir entre Perfis */}
      <div className="grid gap-4">
        <TransferirEntrePerfis
          profiles={profiles}
          activeProfileType={activeWorkspaceType}
          action={transferBetweenProfilesAction}
        />
      </div>

      {/* Por que apenas uma conta? */}
      <Card className="border-red-500/25 bg-[#140b14]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-red-300">
            Por que apenas uma conta?
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              O GestorMoney foi projetado com uma única conta patrimonial
              por perfil para garantir a melhor experiência possível.
            </p>
            <div className="grid gap-2 md:grid-cols-3">
              <div className="flex items-start gap-2 rounded-lg border border-red-500/15 bg-red-500/5 p-3">
                <Info className="mt-0.5 h-4 w-4 text-red-300" />
                <span className="text-xs">
                  Integração com WhatsApp e relatórios mais confiáveis
                </span>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-red-500/15 bg-red-500/5 p-3">
                <Info className="mt-0.5 h-4 w-4 text-red-300" />
                <span className="text-xs">
                  Simplifica dados e cálculos de saldo e patrimônio
                </span>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-red-500/15 bg-red-500/5 p-3">
                <Info className="mt-0.5 h-4 w-4 text-red-300" />
                <span className="text-xs">
                  Menos erros na experiência com múltiplas contas
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-red-200/80">
            Dica: use apenas Perfis Financeiros (Pessoal e Empresarial) para
            organizar seu patrimônio.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
