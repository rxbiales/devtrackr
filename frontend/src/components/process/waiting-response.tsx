"use client";

import { useEffect, useState } from "react";
import { differenceInDays, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Loader2, Building2, Trash2 } from "lucide-react";
import { fetchAllJobs, deactivateJob } from "@/services/jobServices";
import { InterviewAction } from "./handle-interview-action";
import { ChallengeAction } from "./handle-challenge-action";

export function WaitingResponse() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllJobs();
      setJobs(data.filter((j: any) => j.status === "applied" && j.is_active));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center p-16">
        <Loader2 className="animate-spin h-7 w-7 text-primary" />
      </div>
    );
  if (jobs.length === 0)
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>Sem vagas em espera.</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {jobs.map((job) => {
        const days = job.applied_date
          ? differenceInDays(new Date(), parseISO(job.applied_date))
          : 0;
        const color =
          days >= 15
            ? "bg-red-50 text-red-700"
            : days >= 7
              ? "bg-yellow-50 text-yellow-800"
              : "bg-green-50 text-green-700";

        return (
          <Card
            key={job.id}
            className="flex flex-col border shadow-sm hover:border-primary/15 transition-all"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/5 text-primary border border-primary/10">
                    <Building2 className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold truncate">
                      {job.company}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {job.job_title}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${color}`}
                >
                  <Clock className="h-3.5 w-3.5" />{" "}
                  {days === 0 ? "Hoje" : `${days}d`}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t pt-3">
                <Badge
                  variant="outline"
                  className="text-[11px] font-bold uppercase"
                >
                  {job.role || "FULL-STACK"}
                </Badge>
                <div className="flex items-center gap-1">
                  <InterviewAction job={job} onSuccess={loadData} />
                  <ChallengeAction job={job} onSuccess={loadData} />
                  <Button
                    onClick={() => deactivateJob(job.id).then(loadData)}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-red-700 hover:bg-red-100/70"
                  >
                    <Trash2 className="h-4 w-4" />
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
