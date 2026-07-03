import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SupermercadoClient from "./SupermercadoClient";

export default async function SupermercadoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const workspace = await prisma.workspace.findFirst({
    where: { users: { some: { userId: user.id } } },
    select: { id: true },
  });

  if (!workspace) redirect("/");

  // Array vazio para forçar a visualização do Empty State exatamente como no Print 1
  const itensLista: any[] = [];

  return <SupermercadoClient itens={itensLista} />;
}