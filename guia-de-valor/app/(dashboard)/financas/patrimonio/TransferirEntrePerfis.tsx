"use client";

import * as React from "react";
import { ArrowLeftRight } from "lucide-react";
import { Input } from "@/components/ui/input";

type Profile = {
  label: string;
  workspaceId: string;
  initialBalance: number;
  type: string;
};

export default function TransferirEntrePerfis({
  profiles,
  activeProfileType,
  action,
}: {
  profiles: Profile[];
  activeProfileType: string;
  action: (formData: FormData) => Promise<any>;
}) {
  const origin = React.useMemo(() => {
    // O activeProfileType vem do workspace ativo; por segurança pegamos pelo `type`.
    return profiles.find((p) => p.type === activeProfileType) ?? profiles[0];
  }, [profiles, activeProfileType]);

  const destinationOptions = React.useMemo(() => {
    return profiles.filter((p) => origin && p.workspaceId !== origin.workspaceId);
  }, [profiles, origin]);

  const [destinationWorkspaceId, setDestinationWorkspaceId] = React.useState<string>(
    destinationOptions[0]?.workspaceId ?? "",
  );
  const [value, setValue] = React.useState<string>("");

  React.useEffect(() => {
    // Se a lista mudar, garante um destino válido.
    if (
      destinationOptions.length > 0 &&
      !destinationOptions.some((d) => d.workspaceId === destinationWorkspaceId)
    ) {
      setDestinationWorkspaceId(destinationOptions[0].workspaceId);
    }
  }, [destinationOptions, destinationWorkspaceId]);

  const disabled = !origin || destinationOptions.length === 0;

  return (
    <section className="rounded-xl border border-white/5 bg-[#0f172a] p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Transferir entre Perfis
          </h2>
          <p className="text-xs text-muted-foreground">
            Mova valores entre seus perfis, com opção de registrar nos
            relatórios.
          </p>
        </div>
      </div>

      <form className="mt-5" action={action}>
        <input type="hidden" name="originWorkspaceId" value={origin?.workspaceId ?? ""} />
        <input
          type="hidden"
          name="destinationWorkspaceId"
          value={destinationWorkspaceId}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Perfil de Origem
            </div>
            <select
              disabled
              value={origin?.workspaceId ?? ""}
              className="w-full h-11 rounded-lg border border-white/10 bg-[#0b1220] text-foreground px-3 opacity-70"
            >
              {origin ? (
                <option value={origin.workspaceId}>{origin.label}</option>
              ) : (
                <option value="">Sem origem</option>
              )}
            </select>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Perfil de Destino
            </div>
            <select
              disabled={disabled}
              value={destinationWorkspaceId}
              onChange={(e) => setDestinationWorkspaceId(e.target.value)}
              className="w-full h-11 rounded-lg border border-white/10 bg-[#0b1220] text-foreground px-3"
            >
              {destinationOptions.length === 0 ? (
                <option value="">Sem destinos</option>
              ) : (
                destinationOptions.map((p) => (
                  <option key={p.workspaceId} value={p.workspaceId}>
                    {p.label}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs text-muted-foreground mb-1">
            Valor da Transferência
          </div>
          <Input
            name="value"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled}
            className="h-11 bg-[#0b1220] border-white/10 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={disabled}
            className={[
              "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition",
              disabled
                ? "bg-emerald-500/30 text-emerald-300 opacity-60 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-500/90 text-black",
            ].join(" ")}
          >
            <ArrowLeftRight className="h-4 w-4" />
            Transferir
          </button>
        </div>

        <div className="mt-3 text-[11px] text-muted-foreground">
          Você só pode transferir a parte do patrimônio do perfil ativo para o
          perfil de destino.
        </div>
      </form>
    </section>
  );
}

