import { TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import ReceitasClient from "@/app/(dashboard)/financas/receitas/ReceitasClient";
import { createReceitaAction, deleteReceitaAction } from "@/app/(dashboard)/financas/receitas/actions";

export const dynamic = "force-dynamic";

export default async function ReceitasPage() {
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

  const categories = workspace
    ? await prisma.category.findMany({
      where: {
        workspaceId: workspace.id,
        type: TransactionType.INCOME,
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true, icon: true, iconType: true },
    })
    : [];

  const transactions = workspace
    ? await prisma.transaction.findMany({
      where: {
        workspaceId: workspace.id,
        type: TransactionType.INCOME,
      },
      orderBy: { date: "desc" },
      select: {
        id: true,
        amount: true,
        description: true,
        date: true,
        status: true, // NOVO: Trazendo o Status (PAID / PENDING)
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            iconType: true,
          },
        },
        user: { // NOVO: Trazendo o Nome do Membro que cadastrou
          select: {
            name: true,
          },
        },
      },
    })
    : [];

  return (
    <ReceitasClient
      workspaceId={workspace?.id ?? null}
      transactions={transactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        description: t.description,
        date: t.date.toISOString().slice(0, 10),
        categoryName: t.category?.name ?? "Sem categoria",
        categoryId: t.category?.id ?? null,
        categoryIcon: t.category?.icon ?? null,
        categoryIconType: t.category?.iconType ?? null,
        userName: t.user?.name ?? "Membro Desconhecido", // Repassando para o Client
        status: t.status,
      }))}
      categories={categories}
      createReceitaAction={createReceitaAction}
      deleteReceitaAction={deleteReceitaAction}
    />
  );
}