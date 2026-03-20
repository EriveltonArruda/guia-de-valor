"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TransactionType, IconType } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

export type CategoriaState = {
  ok: boolean;
  error?: string;
};

export async function createCategoriaAction(
  _prevState: CategoriaState,
  formData: FormData
): Promise<CategoriaState> {
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const typeStr = String(formData.get("type") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim();
  const iconTypeStr = String(formData.get("iconType") ?? "").trim();

  if (!workspaceId || !name || !typeStr || !icon || !iconTypeStr) {
    return { ok: false, error: "Dados incompletos." };
  }

  const type = typeStr === "INCOME" ? TransactionType.INCOME : TransactionType.EXPENSE;
  const iconType = iconTypeStr === "EMOJI" ? IconType.EMOJI : IconType.UI_ICON;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Usuário não autenticado." };

  try {
    if (id) {
      await prisma.category.update({
        where: { id },
        data: { name, type, icon, iconType },
      });
    } else {
      await prisma.category.create({
        data: { workspaceId, name, type, icon, iconType, isActive: true },
      });
    }
  } catch (error) {
    console.error("Erro ao salvar categoria:", error);
    return { ok: false, error: "Erro ao salvar categoria no banco." };
  }

  revalidatePath("/gestao/categorias");
  return { ok: true };
}

export async function deleteCategoriaAction(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/gestao/categorias");
    return { ok: true };
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return { ok: false, error: "Erro ao deletar categoria." };
  }
}
