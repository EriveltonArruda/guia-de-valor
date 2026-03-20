import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import CategoriasClient from "./CategoriasClient";
import { createCategoriaAction, deleteCategoriaAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const workspace = user
    ? await prisma.workspace.findFirst({
      where: {
        users: { some: { userId: user.id } },
      },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      select: { id: true },
    })
    : null;

  const categorias = workspace
    ? await prisma.category.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { name: "asc" },
    })
    : [];

  return (
    <CategoriasClient
      workspaceId={workspace?.id ?? null}
      categorias={categorias.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        icon: c.icon,
        iconType: c.iconType,
      }))}
      createCategoriaAction={createCategoriaAction}
      deleteCategoriaAction={deleteCategoriaAction}
    />
  );
}
