"use client";

import { useState } from "react";
import { User, Building2, Crown, CheckCircle2, RefreshCw, Plus, Edit2, Trash2, ShieldAlert, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { MembrosView } from "./MembrosView";

interface PerfisClientProps {
  userName: string;
  userEmail: string;
}

export default function PerfisClient({ userName, userEmail }: PerfisClientProps) {
  const [activeView, setActiveView] = useState<"main" | "membros-pessoal" | "membros-empresarial">("main");
  const [openFaq, setOpenFaq] = useState<number | null>(0); // Primeiro FAQ aberto por padrão

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Se a view não for a principal, renderiza a tela de membros correspondente
  if (activeView === "membros-pessoal") {
    return <MembrosView tipo="pessoal" nomePerfil="Pessoal" ownerName={userName} ownerEmail={userEmail} onBack={() => setActiveView("main")} />;
  }

  if (activeView === "membros-empresarial") {
    return <MembrosView tipo="empresarial" nomePerfil="Empresarial" ownerName={userName} ownerEmail={userEmail} onBack={() => setActiveView("main")} />;
  }

  return (
    <div className="flex-1 overflow-auto bg-background p-6 lg:p-8 flex justify-center">
      <div className="max-w-5xl w-full">

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Perfis Financeiros</h1>
            <p className="text-sm text-muted-foreground">Gerencie seus perfis pessoal e empresariais</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-[#1C1C21] border border-border rounded-lg hover:bg-white/5 transition-colors shadow-sm">
            <RefreshCw className="w-4 h-4" /> Atualizar
          </button>
        </div>

        {/* CARDS DE PERFIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Perfil Pessoal */}
          <div className="bg-[#1C1C21] border border-orange-500 rounded-xl p-6 relative shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-bold text-foreground">Pessoal</h2>
              </div>
              <span className="bg-orange-500/10 text-orange-500 border border-orange-500/30 text-xs font-bold px-2 py-1 rounded flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Ativo
              </span>
            </div>

            <div className="flex gap-4 mb-4">
              <span className="flex items-center gap-1.5 text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded">
                <Crown className="w-3.5 h-3.5" /> Proprietário
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="w-3.5 h-3.5" /> 1/2 membro
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-6 h-10">
              Suas finanças <span className="text-orange-500 font-medium">pessoais</span>. Controle gastos, receitas e metas individuais.
            </p>

            <button
              onClick={() => setActiveView("membros-pessoal")}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm mb-3"
            >
              Gerenciar Membros
            </button>
            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Perfil padrão (não removível)
            </p>
          </div>

          {/* Perfil Empresarial */}
          <div className="bg-[#1C1C21] border border-border rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-bold text-foreground">Empresarial</h2>
              </div>
              <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-xs font-bold px-2 py-1 rounded">
                Grátis
              </span>
            </div>

            <div className="flex gap-4 mb-4">
              <span className="flex items-center gap-1.5 text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded">
                <Crown className="w-3.5 h-3.5" /> Proprietário
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="w-3.5 h-3.5" /> 2/2 membros
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-6 h-10">
              Seu 1º perfil empresarial é <span className="text-emerald-500 font-medium">gratuito</span>. Perfis adicionais: R$ 59 (taxa única).
            </p>

            <button
              onClick={() => setActiveView("membros-empresarial")}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm mb-2"
            >
              Gerenciar Membros
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-background border border-border hover:bg-white/5 text-foreground py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                <Edit2 className="w-3.5 h-3.5" /> Renomear Empresa
              </button>
              <button className="bg-background border border-border hover:bg-red-500/10 hover:text-red-500 text-muted-foreground py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Excluir
              </button>
            </div>
          </div>

        </div>

        {/* UPSELL: PERFIS ADICIONAIS */}
        <div className="bg-[#18181b] border border-border/50 rounded-xl p-6 md:p-8 mb-10 overflow-hidden relative">
          {/* Fundo Decorativo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Plus className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">Perfis Adicionais</h3>
                <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Taxa Única</span>
              </div>
              <p className="text-sm text-muted-foreground">Adicione até 4 perfis extras além do gratuito</p>
            </div>
          </div>

          <div className="bg-[#1C1C21] border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">1/1 Perfis Empresariais</p>
                <p className="text-xs text-muted-foreground">1 gratuito em uso. Compre slots extras para adicionar mais.</p>
              </div>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm whitespace-nowrap">
              <Plus className="w-4 h-4 inline-block mr-1" /> Comprar mais 1 slot — R$ 59
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1C1C21] border border-border rounded-lg p-5">
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-2xl font-bold text-emerald-500">R$ 59</span>
                <span className="text-sm text-muted-foreground">/perfil extra</span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Pagamento único - pague uma vez só</li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sem mensalidade ou taxa adicional</li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Vale enquanto sua assinatura estiver ativa</li>
              </ul>
            </div>
            <div className="bg-[#1C1C21] border border-border rounded-lg p-5">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                <Crown className="w-4 h-4 text-orange-500" /> O que cada perfil extra inclui
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-orange-500" /> Controle financeiro totalmente separado</li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-orange-500" /> 1 membro adicional (cônjuge, sócio, etc)</li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-orange-500" /> Relatórios e categorias independentes</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 text-sm">
            <p className="font-bold text-orange-500 flex items-center gap-2 mb-1"><ShieldAlert className="w-4 h-4" /> Importante: Pagamento Único por perfil extra</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              O 1º perfil empresarial já está <strong>incluso gratuitamente</strong>. Você só paga R$ 59,00 uma única vez por cada perfil adicional. Não há cobrança mensal ou anual!
            </p>
          </div>
        </div>

        {/* FAQ - COMO FUNCIONA */}
        <div className="bg-[#1C1C21] border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-orange-500" />
            <div>
              <h3 className="text-lg font-bold text-foreground">Como Funciona?</h3>
              <p className="text-sm text-muted-foreground">Entenda como gerenciar seus perfis financeiros, membros e empresas adicionais</p>
            </div>
          </div>

          <div className="space-y-3">

            {/* Item 1 */}
            <div className="border border-border rounded-lg overflow-hidden">
              <button onClick={() => toggleFaq(0)} className="w-full flex items-center justify-between p-4 bg-[#121214] hover:bg-white/5 transition-colors">
                <span className="font-bold text-sm text-foreground flex items-center gap-2"><User className="w-4 h-4 text-orange-500" /> Tipos de Perfis: Pessoal e Empresarial</span>
                {openFaq === 0 ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {openFaq === 0 && (
                <div className="p-4 bg-[#1C1C21] text-sm text-muted-foreground border-t border-border">
                  <p className="mb-3">O sistema permite criar <strong>dois tipos de perfis</strong>:</p>
                  <div className="space-y-4">
                    <div>
                      <p className="font-bold text-blue-400 flex items-center gap-1.5 mb-1"><User className="w-4 h-4" /> Perfil Pessoal (1 por conta)</p>
                      <p>Ideal para gerenciar suas finanças pessoais, gastos domésticos e investimentos. <strong>Criado automaticamente</strong> quando você se cadastra.</p>
                    </div>
                    <div>
                      <p className="font-bold text-purple-400 flex items-center gap-1.5 mb-1"><Building2 className="w-4 h-4" /> Perfil Empresarial (até 5 por conta)</p>
                      <p>Perfeito para MEIs, autônomos e pequenas empresas. Separe suas finanças. <strong>A primeira empresa é gratuita!</strong></p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Item 2 */}
            <div className="border border-border rounded-lg overflow-hidden">
              <button onClick={() => toggleFaq(1)} className="w-full flex items-center justify-between p-4 bg-[#121214] hover:bg-white/5 transition-colors">
                <span className="font-bold text-sm text-foreground flex items-center gap-2"><Building2 className="w-4 h-4 text-emerald-500" /> Perfis Adicionais: Como Funciona o Pagamento? <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded ml-2">Novo</span></span>
                {openFaq === 1 ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {openFaq === 1 && (
                <div className="p-4 bg-[#1C1C21] text-sm text-muted-foreground border-t border-border space-y-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-3 text-emerald-500 font-medium flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                    <p><strong>É um pagamento ÚNICO, não é assinatura!</strong><br /><span className="text-xs text-emerald-500/80">Quando você adiciona um perfil extra por R$ 59,00, esse é o único valor que você paga. Não existe mensalidade.</span></p>
                  </div>
                  <p className="font-bold text-foreground">Como funciona na prática:</p>
                  <ol className="list-decimal pl-4 space-y-2 text-sm">
                    <li>Você assina o sistema (mensal ou anual) - essa é sua única assinatura recorrente.</li>
                    <li>Sua assinatura inclui: 1 Perfil Pessoal + 1 Perfil Empresarial gratuito.</li>
                    <li><strong>Precisa de mais perfis?</strong> Pague R$ 59 uma vez e ganhe +1 slot.</li>
                  </ol>
                </div>
              )}
            </div>

            {/* Item 3 */}
            <div className="border border-border rounded-lg overflow-hidden">
              <button onClick={() => toggleFaq(2)} className="w-full flex items-center justify-between p-4 bg-[#121214] hover:bg-white/5 transition-colors">
                <span className="font-bold text-sm text-foreground flex items-center gap-2"><User className="w-4 h-4 text-blue-500" /> Sistema de Membros (até 2 por perfil)</span>
                {openFaq === 2 ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {openFaq === 2 && (
                <div className="p-4 bg-[#1C1C21] text-sm text-muted-foreground border-t border-border space-y-3">
                  <p>Cada perfil pode ter <strong>até 2 membros</strong> (incluindo você como proprietário):</p>
                  <ul className="space-y-2">
                    <li><strong className="text-orange-500 flex items-center gap-1.5"><Crown className="w-4 h-4" /> Proprietário (você):</strong> Controle total. Pode adicionar membros e excluir perfis.</li>
                    <li><strong className="text-blue-400 flex items-center gap-1.5"><User className="w-4 h-4" /> Membro Adicional (1 pessoa):</strong> Pode visualizar e gerenciar transações APENAS do perfil onde foi adicionado.</li>
                  </ul>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 mt-3">
                    <p className="font-bold text-blue-400 flex items-center gap-2 mb-1"><ShieldAlert className="w-4 h-4" /> Segurança de Acesso:</p>
                    <p className="text-xs">O membro só tem acesso ao perfil específico. Se você adicionar um sócio no empresarial, ele NÃO verá seu perfil pessoal.</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}