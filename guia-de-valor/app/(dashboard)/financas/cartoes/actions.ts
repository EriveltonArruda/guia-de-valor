"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCreditCardAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const lastFourDigits = String(formData.get("lastFourDigits") ?? "").trim();
  const nameOnCard = String(formData.get("nameOnCard") ?? "").trim();
  const limitRaw = String(formData.get("limit") ?? "0").replace(/\D/g, "");
  const limit = Number(limitRaw) / 100;

  const closingDay = Number(formData.get("closingDay") ?? 1);
  const dueDay = Number(formData.get("dueDay") ?? 1);
  const interestRateRaw = String(formData.get("interestRate") ?? "0");
  const interestRate = Number(interestRateRaw.replace(",", ".")) || 0;
  const color = String(formData.get("color") ?? "#8B5CF6").trim();

  if (!name || limit <= 0 || !closingDay || !dueDay) {
    return { ok: false, error: "Preencha todos os campos obrigatórios em vermelho." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sem autenticação." };

  const workspace = await prisma.workspace.findFirst({
    where: { users: { some: { userId: user.id } } },
    select: { id: true },
  });

  if (!workspace) return { ok: false, error: "Workspace não encontrado." };

  try {
    await prisma.creditCard.create({
      data: {
        workspaceId: workspace.id,
        name,
        brand,
        lastFourDigits: lastFourDigits || null,
        nameOnCard: nameOnCard || null,
        limit,
        closingDay,
        dueDay,
        interestRate: interestRate > 0 ? interestRate : null,
        color,
      }
    });

    revalidatePath("/financas/cartoes");
    return { ok: true };
  } catch (err) {
    console.error("Erro interno:", err);
    return { ok: false, error: "Erro interno no servidor." };
  }
}

export async function deleteCreditCardAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sem autenticação." };

  try {
    await prisma.creditCard.delete({
      where: { id }
    });
    revalidatePath("/financas/cartoes");
    return { ok: true };
  } catch (err) {
    console.error("Erro ao excluir cartão:", err);
    return { ok: false, error: "Erro interno ao excluir cartão." };
  }
}

export async function updateCreditCardAction(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const lastFourDigits = String(formData.get("lastFourDigits") ?? "").trim();
  const nameOnCard = String(formData.get("nameOnCard") ?? "").trim();
  const limitRaw = String(formData.get("limit") ?? "0").replace(/\D/g, "");
  const limit = Number(limitRaw) / 100;

  const closingDay = Number(formData.get("closingDay") ?? 1);
  const dueDay = Number(formData.get("dueDay") ?? 1);
  const interestRateRaw = String(formData.get("interestRate") ?? "0");
  const interestRate = Number(interestRateRaw.replace(",", ".")) || 0;
  const color = String(formData.get("color") ?? "#8B5CF6").trim();

  if (!name || limit <= 0 || !closingDay || !dueDay) {
    return { ok: false, error: "Preencha todos os campos obrigatórios." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sem autenticação." };

  try {
    await prisma.creditCard.update({
      where: { id },
      data: {
        name,
        brand,
        lastFourDigits: lastFourDigits || null,
        nameOnCard: nameOnCard || null,
        limit,
        closingDay,
        dueDay,
        interestRate: interestRate > 0 ? interestRate : null,
        color,
      }
    });

    revalidatePath("/financas/cartoes");
    return { ok: true };
  } catch (err) {
    console.error("Erro interno:", err);
    return { ok: false, error: "Erro interno no servidor ao atualizar." };
  }
}

export async function createCreditCardTransactionAction(formData: FormData) {
  const creditCardId = String(formData.get("creditCardId") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const amountRaw = String(formData.get("amount") ?? "0").replace(/\D/g, "");
  const amount = Number(amountRaw) / 100;
  const dateRaw = String(formData.get("date") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const installments = Number(formData.get("installments") ?? 1);
  const isRecurring = String(formData.get("isRecurring") ?? "") === "on";
  const notes = String(formData.get("notes") ?? "").trim();

  if (!creditCardId || !description || amount <= 0 || !dateRaw) {
    return { ok: false, error: "Preencha todos os campos obrigatórios." };
  }

  const date = new Date(`${dateRaw}T12:00:00`);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sem autenticação." };

  const workspace = await prisma.workspace.findFirst({
    where: { users: { some: { userId: user.id } } },
    select: { id: true }
  });

  if (!workspace) return { ok: false, error: "Workspace não encontrado." };

  const card = await prisma.creditCard.findFirst({
    where: { id: creditCardId, workspaceId: workspace.id }
  });

  if (!card) return { ok: false, error: "Cartão não encontrado." };

  let mainAccount = await prisma.account.findFirst({
    where: { workspaceId: workspace.id },
    select: { id: true }
  });

  if (!mainAccount) {
    mainAccount = await prisma.account.create({
      data: {
        workspaceId: workspace.id,
        name: "Conta Corrente",
        type: "CHECKING",
        initialBalance: 0,
        isActive: true,
      },
      select: { id: true }
    });
  }

  let finalCategoryId = categoryId;
  if (!finalCategoryId) {
    const fallbackCategory = await prisma.category.findFirst({ where: { workspaceId: workspace.id, type: "EXPENSE" } });
    if (fallbackCategory) {
      finalCategoryId = fallbackCategory.id;
    } else {
      const newCategory = await prisma.category.create({
        data: {
          workspaceId: workspace.id,
          name: "Outros (Cartão)",
          type: "EXPENSE",
          icon: "credit-card",
          iconType: "UI_ICON",
          isActive: true
        }
      });
      finalCategoryId = newCategory.id;
    }
  }

  let baseDesc = description;
  if (notes) baseDesc += `\nObs: ${notes}`;
  if (isRecurring) baseDesc += `\n[Recorrente]`;

  try {
    const transactionsToCreate = [];
    const installmentAmount = amount / installments;
    const groupUid = `grp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    for (let i = 1; i <= installments; i++) {
      const instDate = new Date(date);
      const targetMonth = instDate.getMonth() + (i - 1);
      instDate.setMonth(targetMonth);

      // Ajuste de segurança para meses com 28/30 dias
      if (instDate.getMonth() !== targetMonth % 12 && targetMonth % 12 !== -1) {
        instDate.setDate(0);
      }

      let finalDesc = baseDesc;
      if (installments > 1) {
        finalDesc += ` (${i}/${installments})`;
      }

      transactionsToCreate.push({
        workspaceId: workspace.id,
        userId: user.id,
        categoryId: finalCategoryId,
        accountId: mainAccount.id,
        creditCardId: card.id,
        type: "EXPENSE" as const,
        status: "PENDING" as const,
        amount: installmentAmount,
        description: finalDesc,
        date: instDate,
        totalInstallments: installments > 1 ? installments : null,
        installmentIndex: installments > 1 ? i : null,
        installmentGroup: installments > 1 ? groupUid : null,
      });
    }

    await prisma.transaction.createMany({
      data: transactionsToCreate
    });

    revalidatePath("/financas/cartoes");
    return { ok: true };
  } catch (err) {
    console.error("Erro ao registrar transação no cartão:", err);
    return { ok: false, error: "Erro interno no servidor ao disparar a transação." };
  }
}