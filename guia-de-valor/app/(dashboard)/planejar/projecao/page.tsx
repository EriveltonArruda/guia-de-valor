import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProjecaoClient from "./ProjecaoClient";

export default async function ProjecaoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const workspace = await prisma.workspace.findFirst({
    where: { users: { some: { userId: user.id } } },
    select: { id: true },
  });

  if (!workspace) redirect("/");

  // Como é uma tela puramente analítica (GET), depois passaremos as consolidações aqui.
  // Por enquanto mandamos os dados zerados para montar a interface.
  const resumoMes = {
    entradas: 0,
    saidas: 0,
    saldo: 0,
    detalhes: {
      faturasCartao: 0,
      contasPagar: 0,
      parcelasDividas: 0,
      contasReceber: 0
    }
  };

  return <ProjecaoClient resumo={resumoMes} />;
}