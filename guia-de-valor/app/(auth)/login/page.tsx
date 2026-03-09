import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Target } from "lucide-react";
import { login } from "./actions"; // 🚀 Importando o motor de login

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10 p-4">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="space-y-2 items-center text-center pb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Bem-vindo ao <span className="text-primary">Guia de Valor</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Faça login com seu e-mail e senha para acessar o painel
          </CardDescription>
        </CardHeader>

        {/* 🚀 O formulário que dispara o login no servidor */}
        <form action={login}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email" // <- Obrigatório para o backend ler
                type="email"
                placeholder="seu@email.com"
                required     // <- Não deixa enviar vazio
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link href="/recuperar" className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                name="password" // <- Obrigatório para o backend ler
                type="password"
                placeholder="••••••••"
                required        // <- Não deixa enviar vazio
                className="bg-background"
              />
            </div>

            {/* O type="submit" avisa o form que ele deve rodar a action */}
            <Button type="submit" className="w-full text-white mt-4">
              Entrar na minha conta
            </Button>
          </CardContent>
        </form>

        <CardFooter className="flex justify-center border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link href="/cadastro" className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors">
              Criar agora
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}