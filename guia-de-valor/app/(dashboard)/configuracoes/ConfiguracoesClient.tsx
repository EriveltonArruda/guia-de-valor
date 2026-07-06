"use client";

import { User, Lock, RotateCcw, LogOut, Lightbulb, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface ConfiguracoesClientProps {
  userName: string;
  userEmail: string;
}

export default function ConfiguracoesClient({ userName, userEmail }: ConfiguracoesClientProps) {
  const [nome, setNome] = useState(userName);
  const [moeda, setMoeda] = useState("brl");
  const [fuso, setFuso] = useState("utc-3");

  return (
    <div className="flex-1 overflow-auto bg-background p-6 lg:p-8 flex justify-center">
      <div className="max-w-3xl w-full">

        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Configurações</h1>
          <p className="text-sm text-muted-foreground">Gerencie suas preferências</p>
        </div>

        <div className="space-y-6">

          {/* ================= CARD: PERFIL DO USUÁRIO ================= */}
          <div className="bg-[#1C1C21] border border-border rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-bold text-foreground">Perfil do Usuário</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Atualize suas informações pessoais</p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Nome Completo</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Email</label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-muted-foreground opacity-70 cursor-not-allowed outline-none"
                />
                <p className="text-[11px] text-muted-foreground">O email não pode ser alterado</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Moeda</label>
                <Select value={moeda} onValueChange={setMoeda}>
                  <SelectTrigger className="w-full bg-background border-border text-foreground focus:ring-orange-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brl">BRL - Real Brasileiro (R$)</SelectItem>
                    <SelectItem value="usd">USD - Dólar Americano ($)</SelectItem>
                    <SelectItem value="eur">EUR - Euro (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Fuso Horário</label>
                <Select value={fuso} onValueChange={setFuso}>
                  <SelectTrigger className="w-full bg-background border-border text-foreground focus:ring-orange-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-3">Brasília (UTC-3)</SelectItem>
                    <SelectItem value="utc-4">Manaus (UTC-4)</SelectItem>
                    <SelectItem value="utc-5">Acre (UTC-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm">
                Salvar Alterações
              </button>
            </div>
          </div>

          {/* ================= CARD: SEGURANÇA ================= */}
          <div className="bg-[#1C1C21] border border-border rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-bold text-foreground">Segurança</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Altere sua senha de acesso</p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Nova Senha</label>
                <input
                  type="password"
                  placeholder="Digite a nova senha (mínimo 6 caracteres)"
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Confirmar Nova Senha</label>
                <input
                  type="password"
                  placeholder="Confirme a nova senha"
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                />
              </div>

              <div className="bg-background border border-border rounded-md p-4 flex items-start gap-3">
                <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Dica:</strong> Sua senha deve ter no mínimo 6 caracteres. Pode usar números, letras ou ambos.
                </p>
              </div>

              <button className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm">
                Alterar Senha
              </button>
            </div>
          </div>

          {/* ================= CARD: RESETAR PERFIL (DANGER ZONE) ================= */}
          <div className="bg-[#1a1212] border border-red-900/30 rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <RotateCcw className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-red-500">Resetar Perfil Financeiro</h2>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-sm text-muted-foreground">
                <AlertTriangle className="w-4 h-4 text-orange-500 inline mr-1 mb-0.5" />
                <strong className="text-foreground">Ação irreversível</strong> — Apaga todos os dados do perfil <strong>"Pessoal"</strong> (transações, cartões, contas, dívidas, metas, investimentos e lembretes).
              </p>
              <p className="text-sm text-muted-foreground">
                <Lock className="w-4 h-4 text-emerald-500 inline mr-1 mb-0.5" />
                Seus outros perfis <strong>não serão afetados</strong>. Apenas o perfil selecionado acima será resetado.
              </p>
              <p className="text-sm font-medium text-red-400">
                Use apenas para recomeçar do zero. Os dados apagados não poderão ser recuperados.
              </p>
            </div>

            <button className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 hover:border-red-500 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <AlertTriangle className="w-4 h-4" /> Resetar Perfil (Apagar Todos os Dados)
            </button>
          </div>

          {/* ================= CARD: CONTA ================= */}
          <div className="bg-[#1C1C21] border border-border rounded-xl p-6 md:p-8">
            <h2 className="text-lg font-bold text-foreground mb-1">Conta</h2>
            <p className="text-sm text-muted-foreground mb-6">Gerencie sua conta</p>

            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
              <LogOut className="w-4 h-4" /> Sair da Conta
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}