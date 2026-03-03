import { GeneralList } from "@/components/application/general-list";

export default function GeneralListPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Lista de Vagas</h1>
        <p className="text-muted-foreground text-sm">
          Visualize e gerencie todas as suas candidaturas ativas.
        </p>
      </div>

      <GeneralList />
    </div>
  );
}
