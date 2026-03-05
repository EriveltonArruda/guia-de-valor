import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* A Sidebar fica fixa do lado esquerdo */}
      <Sidebar />

      {/* Área principal na direita */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Cabeçalho fixo no topo */}
        <Header />

        {/* O conteúdo das páginas vai renderizar aqui dentro */}
        <main className="flex-1 overflow-y-auto bg-muted/10 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}