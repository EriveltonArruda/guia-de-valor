import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import TransacoesClient from "@/app/(dashboard)/financas/transacoes/TransacoesClient";
import { TransactionType } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function TransacoesPage() {
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
        },
        orderBy: { name: "asc" },
        select: { id: true, name: true, type: true, icon: true, iconType: true },
      })
    : [];

  const transactions = workspace
    ? await prisma.transaction.findMany({
        where: {
          workspaceId: workspace.id,
        },
        orderBy: { date: "desc" },
        select: {
          id: true,
          type: true,
          amount: true,
          description: true,
          date: true,
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
              iconType: true,
            },
          },
          user: {
            select: {
              name: true,
            },
          },
        },
      })
    : [];

  return (
    <TransacoesClient
      workspaceId={workspace?.id ?? null}
      transactions={transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        description: t.description,
        date: t.date.toISOString().slice(0, 10),
        categoryId: t.category?.id ?? null,
        categoryName: t.category?.name ?? "Sem categoria",
        categoryIcon: t.category?.icon ?? null,
        categoryIconType: t.category?.iconType ?? null,
        userName: t.user?.name ?? "Membro Desconhecido",
      }))}
      categories={categories}
    />
  );
}
