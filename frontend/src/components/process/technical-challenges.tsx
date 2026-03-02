"use client";

import { useEffect, useState } from "react";
import { Loader2, Terminal } from "lucide-react";
import { fetchAllJobs } from "@/services/jobServices";
import { JobCalendar } from "@/components/job-calendar";

export function TechnicalChallenges() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllJobs();
        const flattened = data.flatMap((job: any) =>
          (job.technical_challenges || []).map((c: any) => ({
            ...c,
            company: job.company,
            job_title: job.job_title,
            platform: job.platform,
          })),
        );
        setChallenges(flattened);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
      </div>
    );

  if (challenges.length === 0)
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>Nenhum desafio encontrado.</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-1 text-muted-foreground">
        <Terminal className="h-4 w-4" />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
          Prazos de Entrega
        </span>
      </div>
      <JobCalendar
        jobs={challenges}
        dateField="challenge_deadline"
        colorClass="bg-zinc-800 hover:bg-zinc-900"
      />
    </div>
  );
}
