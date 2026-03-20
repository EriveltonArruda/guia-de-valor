 "use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export type PatrimonioInitialOperation = "add" | "remove";

function parseBRL(input: string) {
  // Aceita formatos como: "1.234,56" ou "1234,56" ou "1234.56".
  const str = String(input ?? "").trim();
  const normalized = str.replace(/\./g, "").replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : NaN;
}

export async function savePatrimonioInicialAction(params: {
  operation: PatrimonioInitialOperation;
  value: string;
}) {
  const { operation, value } = params;

  const amount = parseBRL(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "Valor inválido" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Usuário não autenticado" };
  }

  const workspace = await prisma.workspace.findFirst({
    where: {
      users: { some: { userId: user.id } },
    },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    select: { id: true, initialBalance: true },
  });

  if (!workspace) {
    return { ok: false, error: "Workspace ativo não encontrado" };
  }

  const nextInitialBalance =
    operation === "add"
      ? workspace.initialBalance + amount
      : Math.max(0, workspace.initialBalance - amount);

  await prisma.workspace.update({
    where: { id: workspace.id },
    data: { initialBalance: nextInitialBalance },
  });

  revalidatePath("/financas/patrimonio");

  return { ok: true, initialBalance: nextInitialBalance };
}

