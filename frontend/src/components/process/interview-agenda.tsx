"use client";

import { useEffect, useState } from "react";
import { Loader2, Calendar } from "lucide-react";
import { fetchAllJobs } from "@/services/jobServices";
import { JobCalendar } from "@/components/job-calendar";

export function InterviewAgenda() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllJobs();
        const flattened = data.flatMap((job: any) =>
          (job.interviews || []).map((i: any) => ({
            ...i,
            company: job.company,
            job_title: job.job_title,
            platform: job.platform,
          })),
        );
        setInterviews(flattened);
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

  if (interviews.length === 0)
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>Nenhuma entrevista agendada.</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-1 text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
          Datas Agendadas
        </span>
      </div>
      <JobCalendar
        jobs={interviews}
        dateField="interview_date"
        colorClass="bg-zinc-800 hover:bg-zinc-900"
      />
    </div>
  );
}
