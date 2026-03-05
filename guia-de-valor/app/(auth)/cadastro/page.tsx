import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Target } from "lucide-react";
import { signup } from "./actions"; // Importando o nosso motor de cadastro

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10 p-4">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="space-y-2 items-center text-center pb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Crie sua conta no <span className="text-primary">Guia de Valor</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Comece hoje mesmo a transformar sua vida financeira
          </CardDescription>
        </CardHeader>

        {/* 🚀 O formulário que dispara a criação do usuário */}
        <form action={signup}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                name="name"           // <- Necessário para o backend ler
                type="text"
                placeholder="Como quer ser chamado?"
                required              // <- Torna o campo obrigatório
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"          // <- Necessário para o backend ler
                type="email"
                placeholder="seu@email.com"
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"       // <- Necessário para o backend ler
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}         // <- Segurança básica
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword" // <- Necessário para o backend ler
                type="password"
                placeholder="Repita sua senha"
                required
                minLength={6}
                className="bg-background"
              />
            </div>

            <Button type="submit" className="w-full text-white mt-4">
              Criar minha conta gratuita
            </Button>
          </CardContent>
        </form>

        <CardFooter className="flex justify-center border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors">
              Fazer login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}