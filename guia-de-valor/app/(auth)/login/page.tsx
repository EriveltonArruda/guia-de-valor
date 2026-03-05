import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Target } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10 p-4">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="space-y-2 items-center text-center pb-6">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
            <Target className="w-6 h-6 text-emerald-500" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Bem-vindo ao <span className="text-emerald-500">Guia de Valor</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Faça login com seu e-mail e senha para acessar o painel
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link href="/recuperar" className="text-sm text-emerald-500 hover:text-emerald-400 hover:underline transition-colors">
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-background"
            />
          </div>

          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2">
            Entrar na minha conta
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link href="/cadastro" className="text-emerald-500 hover:text-emerald-400 hover:underline font-medium transition-colors">
              Criar agora
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}