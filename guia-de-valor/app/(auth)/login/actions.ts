"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  // Tenta fazer o login com o Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Erro no login:", error.message);
    // Se a senha estiver errada, recarrega a página de login
    return redirect("/login");
  }

  // Se deu tudo certo, joga o usuário para o painel principal!
  redirect("/");
}