"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    // Por enquanto, vamos apenas retornar para a página se a senha não bater
    console.log("As senhas não coincidem");
    return redirect("/cadastro");
  }

  const supabase = await createClient();

  // 1. Criar usuário no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name: name }
    }
  });

  if (authError || !authData.user) {
    console.error("Erro no Supabase Auth:", authError?.message);
    return redirect("/cadastro");
  }

  // 2. Salvar no nosso banco via Prisma (A Mágica Multi-tenant)
  try {
    await prisma.$transaction(async (tx) => {
      // Cria o usuário com o mesmo ID gerado pelo Supabase
      const newUser = await tx.user.create({
        data: {
          id: authData.user!.id,
          name: name,
          email: email,
        }
      });

      // Cria o Workspace (Empresa/Perfil) do cliente
      const newWorkspace = await tx.workspace.create({
        data: {
          name: `Perfil Pessoal - ${name}`,
          type: "PERSONAL",
          isDefault: true,
        }
      });

      // Conecta o Usuário ao seu novo Workspace como DONO (Owner)
      await tx.userWorkspace.create({
        data: {
          userId: newUser.id,
          workspaceId: newWorkspace.id,
          role: "OWNER",
        }
      });
    });
  } catch (dbError) {
    console.error("Erro ao salvar no banco (Prisma):", dbError);
    return redirect("/cadastro");
  }

  // 3. Tudo deu certo! Redireciona o usuário para a Dashboard
  redirect("/");
}