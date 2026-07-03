import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ComprasClient from "./ComprasClient";

export default async function ComprasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const workspace = await prisma.workspace.findFirst({
    where: { users: { some: { userId: user.id } } },
    select: { id: true },
  });

  if (!workspace) redirect("/");

  // Array vazio para forçar o Empty State inicial igual ao seu Print 1
  const comprasPlanejadas: any[] = [];

  return <ComprasClient compras={comprasPlanejadas} />;
}