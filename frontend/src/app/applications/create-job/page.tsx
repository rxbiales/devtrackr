import { AddJobDialog } from "@/components/add-job-dialog" // Se você separou o form do modal [cite: 2026-02-25]

export function CreateJobPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Nova Vaga</h2>
      </div>
      <div className="max-w-2xl mx-auto border p-6 rounded-lg bg-card text-card-foreground shadow-sm">
        <AddJobDialog /> 
      </div>
    </div>
  )
}