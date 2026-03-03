import { WaitingResponse } from "@/components/process/waiting-response";

export default function WaitingResponsePage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Vagas em Espera</h1>
        <p className="text-muted-foreground text-sm">
          Monitore candidaturas que aguardam retorno das empresas.
        </p>
      </div>

      <WaitingResponse />
    </div>
  );
}
