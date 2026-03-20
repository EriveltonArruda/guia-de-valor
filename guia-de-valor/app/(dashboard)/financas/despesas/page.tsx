import { TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import DespesasClient from "./DespesasClient";
import { createDespesaAction, deleteDespesaAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function DespesasPage() {
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
        type: TransactionType.EXPENSE,
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    })
    : [];

  const transactions = workspace
    ? await prisma.transaction.findMany({
      where: {
        workspaceId: workspace.id,
        type: TransactionType.EXPENSE,
      },
      orderBy: { date: "desc" },
      select: {
        id: true,
        amount: true,
        description: true,
        date: true,
        status: true,
        category: {
          select: {
            id: true,
            name: true,
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
    <DespesasClient
      workspaceId={workspace?.id ?? null}
      transactions={transactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        description: t.description,
        date: t.date.toISOString().slice(0, 10),
        categoryName: t.category?.name ?? "Sem categoria",
        categoryId: t.category?.id ?? null,
        userName: t.user?.name ?? "Membro Desconhecido",
        status: t.status,
      }))}
      categories={categories}
      createDespesaAction={createDespesaAction}
      deleteDespesaAction={deleteDespesaAction}
    />
  );
}
