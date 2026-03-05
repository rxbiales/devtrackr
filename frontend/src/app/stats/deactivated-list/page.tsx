import { DeactivatedList } from "@/components/stats/deactivated-list";

export default function DeactivatedListPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vagas Desativadas</h1>
        <p className="text-muted-foreground">
          Gerencie e visualize as vagas que foram desativadas.
        </p>
      </div>

      <DeactivatedList />
    </div>
  );
}
