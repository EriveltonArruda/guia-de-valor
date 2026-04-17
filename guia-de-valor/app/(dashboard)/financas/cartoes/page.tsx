import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CartoesClient from "./CartoesClient";

export default async function CartoesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const workspace = await prisma.workspace.findFirst({
    where: { users: { some: { userId: user.id } } },
    select: { id: true },
  });

  if (!workspace) redirect("/");

  const cartoes = await prisma.creditCard.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" },
    include: { transactions: true }
  });

  const categories = await prisma.category.findMany({
    where: { workspaceId: workspace.id, type: "EXPENSE" },
    select: { id: true, name: true }
  });

  return <CartoesClient cartoes={cartoes} categories={categories} />;
}
