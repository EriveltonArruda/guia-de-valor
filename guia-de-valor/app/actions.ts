"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createClient();

  // Destrói a sessão do usuário no Supabase e limpa os cookies
  await supabase.auth.signOut();

  // Chuta o usuário de volta para a tela de login
  redirect("/login");
}