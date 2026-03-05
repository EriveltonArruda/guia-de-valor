"use client";

import { Bell, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

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
              Bem-vindo(a) de volta!
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

        <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-muted hover:bg-muted/80 text-foreground">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}