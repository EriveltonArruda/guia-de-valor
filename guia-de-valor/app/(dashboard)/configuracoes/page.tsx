import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ConfiguracoesClient from "./ConfiguracoesClient";

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  // Em um cenário real com banco integrado, puxaríamos o nome do banco de dados
  return (
    <ConfiguracoesClient
      userName="Erivelton Rodrigues de Arruda"
      userEmail={user.email || "erivelton@email.com"}
    />
  );
}