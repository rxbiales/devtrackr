import { WeeklyMetrics } from "@/components/stats/weekly-metrics";

export default function WeeklyStatsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Métricas Semanais</h1>
        <p className="text-muted-foreground">
          Acompanhe seu ritmo de aplicações e constância nos últimos 7 dias.
        </p>
      </div>

      <WeeklyMetrics />
    </div>
  );
}
