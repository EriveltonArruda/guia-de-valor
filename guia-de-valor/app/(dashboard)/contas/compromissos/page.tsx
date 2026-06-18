import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CompromissosClient from "./CompromissosClient";

export default async function CompromissosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const workspace = await prisma.workspace.findFirst({
    where: { users: { some: { userId: user.id } } },
    select: { id: true },
  });

  if (!workspace) redirect("/");

  // Busca contas a pagar normais e faturas de cartão pendentes
  const transactions = await prisma.transaction.findMany({
    where: {
      workspaceId: workspace.id,
      status: "PENDING",
      type: "EXPENSE"
    },
    include: {
      category: true,
      creditCard: true,
    },
    orderBy: { date: "asc" }
  });

  const cartoes = await prisma.creditCard.findMany({
    where: { workspaceId: workspace.id }
  });

  return <CompromissosClient transacoes={transactions} cartoes={cartoes} />;
}