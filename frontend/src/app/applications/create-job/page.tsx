import { AddJobDialog } from "@/components/application/add-job-dialog";

export default function CreateJobPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Nova Vaga</h1>
        <p className="text-muted-foreground text-sm">
          Adicione uma nova oportunidade ao seu funil de candidaturas.
        </p>
      </div>

      <AddJobDialog />
    </div>
  );
}
