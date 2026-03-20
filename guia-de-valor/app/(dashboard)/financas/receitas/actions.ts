"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  IconType,
  AccountType,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";

function parseBRCurrency(input: string) {
  const normalized = input.trim().replace(/\./g, "").replace(",", ".");
  const value = Number(normalized);
  return value;
}

export type CreateReceitaState = {
  ok: boolean;
  error?: string;
};

export async function createReceitaAction(
  _prevState: CreateReceitaState,
  formData: FormData,
): Promise<CreateReceitaState> {
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();
  const transactionId = String(formData.get("transactionId") ?? "").trim(); // NOVO: Pega o ID se existir
  const descricao = String(formData.get("descricao") ?? "").trim();
  const valorRaw = String(formData.get("valor") ?? "").trim();
  const dataRaw = String(formData.get("data") ?? "").trim();
  const observacoes = String(formData.get("observacoes") ?? "").trim();

  const recorrente = String(formData.get("recorrente") ?? "false") === "true";
  const frequencia = String(formData.get("frequencia") ?? "Mensal").trim();

  if (!workspaceId || !descricao || !valorRaw || !dataRaw) {
    return { ok: false, error: "Dados incompletos." };
  }

  const amount = parseBRCurrency(valorRaw);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "Valor inválido." };
  }

  const date = new Date(dataRaw);
  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: "Data inválida." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Usuário não autenticado." };

  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      users: { some: { userId: user.id } },
    },
    select: { id: true },
  });
  if (!workspace) return { ok: false, error: "Workspace não encontrado." };

  try {
    const accountFromDb = await prisma.account.findFirst({
      where: { workspaceId: workspace.id },
      select: { id: true },
    });

    const account =
      accountFromDb ??
      (await prisma.account.create({
        data: {
          workspaceId: workspace.id,
          name: "Conta Principal",
          type: AccountType.CHECKING,
          initialBalance: 0,
          isActive: true,
        },
        select: { id: true },
      }));

    const categoryFromDb = await prisma.category.findFirst({
      where: { workspaceId: workspace.id, type: TransactionType.INCOME },
      select: { id: true },
    });

    const category =
      categoryFromDb ??
      (await prisma.category.create({
        data: {
          workspaceId: workspace.id,
          type: TransactionType.INCOME,
          name: "Geral",
          icon: "💰",
          iconType: IconType.EMOJI,
          isActive: true,
        },
        select: { id: true },
      }));

    let finalDescription = descricao;
    if (observacoes) {
      finalDescription = `${finalDescription}\nObservações: ${observacoes}`;
    }
    if (recorrente) {
      finalDescription = `${finalDescription}\nRecorrente: ${frequencia}`;
    }

    if (transactionId) {
      // SE TEM ID, ATUALIZA
      await prisma.transaction.update({
        where: { id: transactionId },
        data: {
          categoryId: category.id,
          amount,
          description: finalDescription,
          date,
          paidAt: date,
        },
      });
    } else {
      // SE NÃO TEM ID, CRIA
      await prisma.transaction.create({
        data: {
          workspaceId: workspace.id,
          userId: user.id,
          categoryId: category.id,
          accountId: account.id,
          type: TransactionType.INCOME,
          status: TransactionStatus.PAID,
          amount,
          description: finalDescription,
          date,
          paidAt: date,
          needsReview: false,
        },
      });
    }
  } catch (error) {
    console.error("Erro ao salvar receita:", error);
    return { ok: false, error: "Erro ao salvar receita no banco." };
  }

  revalidatePath("/financas/receitas");
  revalidatePath("/");

  return { ok: true };
}

export async function deleteReceitaAction(id: string) {
  try {
    await prisma.transaction.delete({
      where: { id }
    });
    revalidatePath("/financas/receitas");
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    console.error("Erro ao deletar receita:", error);
    return { ok: false, error: "Erro ao deletar receita." };
  }
}