import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PagarReceberClient from "./PagarReceberClient";

export default async function PagarReceberPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const workspace = await prisma.workspace.findFirst({
    where: { users: { some: { userId: user.id } } },
    select: { id: true },
  });

  if (!workspace) redirect("/");

  // Busca as transações gerais (que não são de cartão de crédito)
  const transacoes = await prisma.transaction.findMany({
    where: {
      workspaceId: workspace.id,
      creditCardId: null // Apenas contas do dia a dia, ignora fatura de cartão
    },
    include: {
      category: true,
    },
    orderBy: { date: "asc" }
  });

  const categorias = await prisma.category.findMany({
    where: { workspaceId: workspace.id },
    select: { id: true, name: true, type: true }
  });

  return <PagarReceberClient transacoes={transacoes} categorias={categorias} />;
}