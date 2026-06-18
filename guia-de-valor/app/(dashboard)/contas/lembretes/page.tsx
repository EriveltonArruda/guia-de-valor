import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LembretesClient from "./LembretesClient";

export default async function LembretesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const workspace = await prisma.workspace.findFirst({
    where: { users: { some: { userId: user.id } } },
    select: { id: true },
  });

  if (!workspace) redirect("/");

  // Array tipado explicitamente para evitar erros de compilação implicit-any
  const lembretes: any[] = [];

  return <LembretesClient lembretes={lembretes} />;
}