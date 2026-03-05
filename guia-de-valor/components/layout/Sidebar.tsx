"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  ArrowRightLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  CalendarDays,
  CalendarCheck,
  CircleDollarSign,
  Landmark,
  Bell,
  Target,
  LineChart,
  PiggyBank,
  ShoppingBag,
  ShoppingCart,
  Car,
  FileText,
  Tags,
  Download,
  Users,
  MoreHorizontal,
  Gift,
  BookOpen,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from "lucide-react";

// Mapeamento 100% fiel ao modelo GestorMoney
const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  {
    name: "Utilidades",
    icon: Sparkles,
    subItems: []
  },
  {
    name: "Finanças",
    icon: ArrowRightLeft,
    subItems: [
      { name: 'Patrimônio "Conta"', href: "/financas/patrimonio", icon: Wallet },
      { name: "Receitas", href: "/financas/receitas", icon: TrendingUp },
      { name: "Despesas", href: "/financas/despesas", icon: TrendingDown },
      { name: "Transações", href: "/financas/transacoes", icon: ArrowRightLeft },
      { name: "Cartões de Crédito", href: "/financas/cartoes", icon: CreditCard },
    ]
  },
  {
    name: "Contas",
    icon: CalendarDays,
    subItems: [
      { name: "Compromissos", href: "/contas/compromissos", icon: CalendarCheck },
      { name: "Contas a Pagar/Receber", href: "/contas/pagar-receber", icon: CircleDollarSign },
      { name: "Dívidas/Financiamentos", href: "/contas/dividas", icon: Landmark },
      { name: "Lembretes", href: "/contas/lembretes", icon: Bell },
    ]
  },
  {
    name: "Planejar",
    icon: Target,
    subItems: [
      { name: "Projeção Financ.", href: "/planejar/projecao", icon: LineChart },
      { name: "Metas", href: "/planejar/metas", icon: Target },
      { name: "Investimentos", href: "/planejar/investimentos", icon: PiggyBank },
      { name: "Planejamento de Compras", href: "/planejar/compras", icon: ShoppingBag },
      { name: "Lista de Supermercado", href: "/planejar/supermercado", icon: ShoppingCart },
      { name: "Veículos", href: "/planejar/veiculos", icon: Car },
    ]
  },
  {
    name: "Gestão",
    icon: FileText,
    subItems: [
      { name: "Categorias", href: "/gestao/categorias", icon: Tags },
      { name: "Relatórios", href: "/gestao/relatorios", icon: FileText },
      { name: "Exportar Dados", href: "/gestao/exportar", icon: Download },
      { name: "Perfis Financeiros", href: "/gestao/perfis", icon: Users },
    ]
  },
  {
    name: "Mais",
    icon: MoreHorizontal,
    subItems: [
      { name: "Indique e Ganhe", href: "/mais/indique", icon: Gift },
      { name: "Tutorial", href: "/mais/tutorial", icon: BookOpen },
      { name: "Contato e Sugestões", href: "/mais/contato", icon: MessageSquare },
      { name: "Configurações", href: "/mais/configuracoes", icon: Settings },
    ]
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const activeParentMenu = menuItems.find(item =>
      item.subItems?.some(sub => pathname === sub.href)
    );
    if (activeParentMenu) {
      setOpenMenu(activeParentMenu.name);
    }
  }, [pathname]);

  const toggleSubmenu = (menuName: string) => {
    if (isCollapsed) setIsCollapsed(false);
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <aside
      className={`bg-background flex flex-col h-screen border-r border-border transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"
        }`}
    >
      {/* Topo / Logotipo */}
      <div className={`h-16 flex items-center border-b border-border ${isCollapsed ? "justify-center px-2" : "justify-between px-6"}`}>
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2 truncate">
            {/* O "Guia" agora tem a cor HEX chumbada para não falhar */}
            <span className="text-[#ED6936]">Guia</span> de Valor
          </h1>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-muted text-foreground/70 hover:text-foreground transition-colors"
          title={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Links de Navegação */}
      <nav className="flex-1 overflow-y-auto py-4 overflow-x-hidden custom-scrollbar">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isItemActive = pathname === item.href;
            const hasActiveSubItem = item.subItems?.some(sub => pathname === sub.href);
            const isExpanded = openMenu === item.name;

            if (item.subItems && item.subItems.length === 0) return null;

            return (
              <li key={item.name} className="flex flex-col gap-1">
                {/* Botão Principal */}
                {item.href ? (
                  <Link
                    href={item.href}
                    title={isCollapsed ? item.name : undefined}
                    className={`flex items-center gap-3 rounded-lg transition-colors ${isCollapsed ? "justify-center py-3 px-0" : "px-3 py-2.5"
                      } ${isItemActive
                        ? "bg-[#ED6936]/10 text-[#ED6936] font-medium"
                        : "text-foreground/90 hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    {/* O Ícone também fica laranja se ativo */}
                    <item.icon className={`w-5 h-5 shrink-0 ${isItemActive ? "text-[#ED6936]" : ""}`} />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    title={isCollapsed ? item.name : undefined}
                    className={`flex items-center justify-between rounded-lg transition-colors w-full ${isCollapsed ? "justify-center py-3 px-0" : "px-3 py-2.5"
                      } ${hasActiveSubItem
                        ? "text-[#ED6936] font-medium"
                        : "text-foreground/90 hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 shrink-0 ${hasActiveSubItem ? "text-[#ED6936]" : ""}`} />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </div>
                    {!isCollapsed && item.subItems && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>
                )}

                {/* Renderização do Submenu */}
                {!isCollapsed && item.subItems && isExpanded && (
                  <ul className="flex flex-col gap-1 pl-4 pr-2 py-1">
                    {item.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <li key={subItem.name}>
                          <Link
                            href={subItem.href}
                            className={`flex items-center gap-3 py-2 px-3 rounded-lg text-sm transition-colors ${isSubActive
                                ? "bg-[#ED6936]/10 text-[#ED6936] font-medium"
                                : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                              }`}
                          >
                            <subItem.icon className={`w-4 h-4 shrink-0 ${isSubActive ? "text-[#ED6936]" : "text-foreground/80"}`} />
                            <span className="truncate">{subItem.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Perfil do Usuário no rodapé */}
      <div className="p-4 border-t border-border">
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center px-0" : "px-3 py-2"}`}>
          <div className="w-8 h-8 shrink-0 rounded-full bg-[#292B49] flex items-center justify-center text-sm font-medium text-white border border-[#292B49]/20 shadow-sm">
            EV
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-foreground truncate">Erivelton</span>
              <span className="text-xs text-foreground/70 truncate">Plano Pessoal</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}