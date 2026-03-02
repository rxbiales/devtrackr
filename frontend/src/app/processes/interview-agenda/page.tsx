import { InterviewAgenda } from "@/components/process/interview-agenda";

export default function InterviewsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
        <p className="text-muted-foreground text-sm">
          Acompanhe suas entrevistas marcadas no calendário.
        </p>
      </div>

      <InterviewAgenda />
    </div>
  );
}
