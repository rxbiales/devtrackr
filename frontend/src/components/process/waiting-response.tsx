"use client";

import { useEffect, useState } from "react";
import { differenceInDays, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquarePlus,
  Trash2,
  Clock,
  Loader2,
  Building2,
  ClipboardPen, // Ícone para Desafio Técnico
} from "lucide-react";
import {
  fetchAllJobs,
  updateJobStatus,
  deactivateJob,
} from "@/services/jobServices";

export function WaitingResponse() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllJobs(); //
      const filtered = data.filter(
        (j: any) => j.status === "applied" && j.is_active,
      );
      setJobs(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Atualizado para incluir o tipo 'challenge'
  const handleAction = async (
    id: number,
    type: "interview" | "archive" | "challenge",
  ) => {
    if (type === "interview") {
      await updateJobStatus(id, "interviewing");
    } else if (type === "challenge") {
      // Novo status para desafio técnico
      await updateJobStatus(id, "technical_challenge");
    } else {
      await deactivateJob(id);
    }
    loadData();
  };

  if (loading)
    return (
      <div className="flex justify-center p-16">
        <Loader2 className="animate-spin h-7 w-7 text-primary" />
      </div>
    );

  // Verificação de lista vazia com formato MINIMALISTA
  if (jobs.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>Sem vagas em espera.</p>
      </div>
    );
  }

  return (
    // Grid mantido, mas com gap menor para densidade
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {jobs.map((job) => {
        const days = differenceInDays(new Date(), parseISO(job.applied_date));
        const isCritical = days >= 15;
        const isWarning = days >= 7;

        return (
          <Card
            key={job.id}
            className="flex flex-col border shadow-sm hover:border-primary/15 transition-all overflow-hidden"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/5 text-primary border border-primary/10 flex-shrink-0">
                    <Building2 className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-lg font-semibold leading-tight truncate text-foreground/90">
                      {job.company}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate font-medium">
                      {job.job_title}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold whitespace-nowrap flex-shrink-0
                  ${isCritical ? "bg-red-50 text-red-700 border-red-100" : isWarning ? "bg-yellow-50 text-yellow-800 border-yellow-100" : "bg-green-50 text-green-700 border-green-100"}`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  {days === 0 ? "Hoje" : `${days}d`}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t pt-3 border-border/60">
                <Badge
                  variant="outline"
                  className="px-2.5 py-0.5 text-[11px] font-bold tracking-tight uppercase border-muted-foreground/30 text-muted-foreground/90"
                >
                  {job.role || "FULL-STACK"}
                </Badge>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    onClick={() => handleAction(job.id, "interview")}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs font-semibold gap-1.5 text-green-700 hover:bg-green-100/70 hover:text-green-800 rounded-md"
                    title="Mover para Entrevista"
                  >
                    <MessageSquarePlus className="h-4 w-4" /> Entrevista
                  </Button>

                  <Button
                    onClick={() => handleAction(job.id, "challenge")}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs font-semibold gap-1.5 text-blue-700 hover:bg-blue-100/70 hover:text-blue-800 rounded-md"
                    title="Mover para Desafio Técnico"
                  >
                    <ClipboardPen className="h-4 w-4" /> Desafio
                  </Button>

                  <Button
                    onClick={() => handleAction(job.id, "archive")}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs font-semibold gap-1.5 text-red-700 hover:bg-red-100/70 hover:text-red-800 rounded-md"
                    title="Descartar Vaga"
                  >
                    <Trash2 className="h-4 w-4" /> Descartar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
