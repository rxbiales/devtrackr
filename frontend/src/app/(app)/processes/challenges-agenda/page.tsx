import { TechnicalChallenges } from "@/components/process/technical-challenges";

export default function ChallengesPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Desafios Técnicos</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie prazos de testes e projetos práticos.
        </p>
      </div>

      <TechnicalChallenges />
    </div>
  );
}
