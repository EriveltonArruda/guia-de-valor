"use client";

import { Bell, Moon, Sun, LogOut, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions"; // 🚀 Importação do motor de logout
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();

  const isDashboardPage = pathname === "/";

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Lado Esquerdo - Título Dinâmico */}
      <div className="flex items-center gap-4">
        {isDashboardPage && (
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-foreground leading-tight">Dashboard</h2>
            <span className="text-sm text-muted-foreground font-medium leading-tight">
              Bem-vindo(a) de volta, Erivelton Rodrigues!
            </span>
          </div>
        )}
      </div>

      {/* Lado Direito - Ações */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>

        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-emerald-500"></span>
        </Button>

        <div className="h-6 w-px bg-border mx-2"></div>

        {/* Avatar e Menu Dropdown Substituindo o antigo botão de User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-[#cce833] hover:bg-[#b5cc2d]">
              <span className="text-xs font-bold text-black">ER</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Nosso motor de Sair embutido no item do menu */}
            <DropdownMenuItem asChild>
              <form action={logout} className="w-full">
                <button type="submit" className="flex w-full items-center text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}