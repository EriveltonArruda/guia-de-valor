"use client";

import { ArrowLeft, UserPlus, Crown, Mail, Edit2, Trash2, ShieldAlert, Send, User } from "lucide-react";

interface MembrosViewProps {
  tipo: "pessoal" | "empresarial";
  nomePerfil: string;
  ownerName: string;
  ownerEmail: string;
  onBack: () => void;
}

export function MembrosView({ tipo, nomePerfil, ownerName, ownerEmail, onBack }: MembrosViewProps) {

  // Lógica baseada nos prints: 
  // Pessoal (Print 2) tem 1 membro (liberado pra convidar)
  // Empresarial (Print 3) tem 2 membros (limite atingido)
  const isLimitReached = tipo === "empresarial";

  return (
    <div className="flex-1 overflow-auto bg-background p-6 lg:p-8 flex justify-center">
      <div className="max-w-3xl w-full">

        {/* Header Voltar */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium text-sm transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar aos Perfis
          </button>
          <h1 className="text-2xl font-bold text-foreground mb-1">Membros do Perfil</h1>
          <p className="text-sm text-muted-foreground">{nomePerfil}</p>
        </div>

        {/* CARD: ADICIONAR MEMBRO */}
        <div className="bg-[#1C1C21] border border-border rounded-xl p-6 md:p-8 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <UserPlus className="w-5 h-5 text-foreground" />
            <h2 className="text-lg font-bold text-foreground">Adicionar Membro</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Convide outra pessoa para compartilhar <strong>este perfil financeiro específico</strong>
          </p>

          {isLimitReached ? (
            // Layout Print 3: Limite Atingido
            <div className="space-y-4">
              <p className="font-bold text-orange-500 text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Limite de 2 membros atingido
              </p>
              <div className="bg-background border border-border rounded-lg p-5 flex items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">
                  Este perfil já possui o máximo de 2 membros permitidos. Remova um membro existente para adicionar outro.
                </p>
              </div>
            </div>
          ) : (
            // Layout Print 2: Formulário Liberado
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Nome do Membro *</label>
                <input type="text" placeholder="Ex: João Silva" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Email *</label>
                <input type="email" placeholder="email@exemplo.com" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500" />
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-sm font-bold text-foreground">WhatsApp *</label>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">País / Country</label>
                  <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500 appearance-none">
                    <option>BR Brasil (+55)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Número de Telefone / Phone Number</label>
                  <input type="text" placeholder="+55 48 99999-9999" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500" />
                </div>

                <div className="bg-background border border-border rounded-md p-4 flex items-start gap-3 mt-2">
                  <ShieldAlert className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>País:</strong> BR Brasil</p>
                    <p><strong>Formato:</strong> +55 (XX) 9XXXX-XXXX</p>
                    <p><strong>Exemplo:</strong> +55 (99) 99999-9999</p>
                    <p>Digite o número completo com o 9º dígito para celulares (11 dígitos) ou sem o 9 para telefones fixos (10 dígitos).</p>
                  </div>
                </div>
              </div>

              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mt-6 shadow-sm">
                <Mail className="w-4 h-4" /> Enviar Convite
              </button>
            </div>
          )}
        </div>

        {/* LISTA DE MEMBROS */}
        <div className="bg-[#1C1C21] border border-border rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-foreground" />
            <h2 className="text-lg font-bold text-foreground">Membros ({isLimitReached ? 2 : 1})</h2>
          </div>

          <div className="space-y-3">
            {/* Membro 1: Proprietário (Erivelton) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-orange-500/30 bg-orange-500/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/50">
                  <Crown className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{ownerName}</p>
                  <p className="text-xs text-muted-foreground">{ownerEmail}</p>
                </div>
              </div>
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 w-fit">
                <Crown className="w-3.5 h-3.5" /> Proprietário
              </span>
            </div>

            {/* Membro 2: Sócio/Membro (Aparece apenas no perfil Empresarial simulando o limite cheio) */}
            {isLimitReached && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border bg-background rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2c2c35] flex items-center justify-center border border-border">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">Sócio Investidor</p>
                    <p className="text-xs text-muted-foreground">socio@guiadevalor.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-fit">
                  <span className="bg-[#2c2c35] text-white text-xs font-bold px-3 py-1.5 rounded">
                    Membro
                  </span>
                  <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" title="Editar Permissões">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-muted-foreground hover:text-orange-500 transition-colors" title="Reenviar Convite">
                    <Send className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors" title="Remover Membro">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}