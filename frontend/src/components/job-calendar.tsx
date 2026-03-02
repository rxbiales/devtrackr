"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface JobCalendarProps {
  jobs: any[];
  dateField: string; // Ex: 'interview_date' ou 'challenge_deadline'
  colorClass?: string;
}

export function JobCalendar({
  jobs,
  dateField,
  colorClass = "bg-primary",
}: JobCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const renderHeader = () => (
    <div className="flex items-center justify-between px-2 mb-4">
      <h2 className="text-xl font-bold capitalize">
        {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
      </h2>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return (
      <div className="grid grid-cols-7 mb-2 border-b pb-2">
        {days.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-muted-foreground uppercase"
          >
            {d}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;

        // Filtra os jobs que acontecem neste dia específico
        const dayJobs = jobs.filter(
          (job) =>
            job[dateField] && isSameDay(parseISO(job[dateField]), cloneDay),
        );

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "relative h-24 border-r border-b p-2 transition-colors hover:bg-muted/30",
              !isSameMonth(day, monthStart) &&
                "bg-muted/10 text-muted-foreground/30",
            )}
          >
            <span className="text-sm font-medium">{formattedDate}</span>
            <div className="mt-1 flex flex-col gap-1 overflow-hidden">
              {dayJobs.map((job) => (
                <HoverCard key={job.id}>
                  <HoverCardTrigger asChild>
                    <div
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-bold truncate text-white cursor-help",
                        colorClass,
                      )}
                    >
                      {job.company}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold">{job.company}</h4>
                      <p className="text-xs text-muted-foreground">
                        {job.job_title}
                      </p>
                      <div className="text-[10px] bg-muted p-1 rounded mt-2">
                        {job.platform || "Plataforma não informada"}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div
          key={day.toString()}
          className="grid grid-cols-7 border-l border-t"
        >
          {days}
        </div>,
      );
      days = [];
    }
    return (
      <div className="rounded-xl border overflow-hidden bg-card">{rows}</div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
