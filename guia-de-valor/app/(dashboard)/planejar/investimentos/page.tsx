import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import InvestimentosClient from "./InvestimentosClient";

export default async function InvestimentosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const workspace = await prisma.workspace.findFirst({
    where: { users: { some: { userId: user.id } } },
    select: { id: true },
  });

  if (!workspace) redirect("/");

  // Array inicial vazio para não quebrar o TypeScript
  const investimentos: any[] = [];

  return <InvestimentosClient investimentos={investimentos} />;
}