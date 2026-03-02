"use client";

import { useEffect, useState } from "react";
import { Loader2, Code2 } from "lucide-react";
import { fetchAllJobs } from "@/services/jobServices";
import { JobCalendar } from "@/components/job-calendar";

export function TechnicalChallenges() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllJobs();
        // Filtra apenas quem está em fase de desafio
        const filtered = data.filter(
          (j: any) => j.status === "technical_challenge" && j.is_active,
        );
        setJobs(filtered);
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
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-2">
        <Code2 className="h-5 w-5 text-blue-600" />
        <h1 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Desafios Técnicos
        </h1>
      </div>
      <JobCalendar
        jobs={jobs}
        dateField="challenge_deadline"
        colorClass="bg-blue-600 hover:bg-blue-700"
      />
    </div>
  );
}
