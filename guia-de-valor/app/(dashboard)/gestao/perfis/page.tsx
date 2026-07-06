import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PerfisClient from "./PerfisClient";

export default async function PerfisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const workspace = await prisma.workspace.findFirst({
    where: { users: { some: { userId: user.id } } },
    select: { id: true },
  });

  if (!workspace) redirect("/");

  return <PerfisClient userName="Erivelton Rodrigues de Arruda" userEmail={user.email || "erivelton@email.com"} />;
}