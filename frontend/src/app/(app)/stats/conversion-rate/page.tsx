import { ConversionMetrics } from "@/components/stats/conversion-rate";

export default function ConversionStatsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Taxa de Conversão</h1>
        <p className="text-muted-foreground">
          Analise a eficiência dos seus currículos e seu desempenho em etapas
          técnicas.
        </p>
      </div>

      <ConversionMetrics />
    </div>
  );
}
