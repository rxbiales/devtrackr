"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface JobCalendarProps {
  jobs: any[];
  dateField: string;
  colorClass?: string;
}

export function JobCalendar({
  jobs,
  dateField,
  colorClass = "bg-primary",
}: JobCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const today = new Date();

  const renderHeader = () => (
    <div className="flex items-center justify-between px-1 mb-4">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold tracking-tight capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => setCurrentMonth(new Date())}
        >
          Hoje
        </Button>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return (
      <div className="grid grid-cols-7 mb-0 border-b bg-muted/30">
        {days.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider"
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
        const dayJobs = jobs.filter(
          (job) =>
            job[dateField] && isSameDay(parseISO(job[dateField]), cloneDay),
        );
        const isToday = isSameDay(day, today);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "relative h-20 border-r border-b p-1.5 transition-colors",
              !isCurrentMonth
                ? "bg-muted/5 text-muted-foreground/20"
                : "bg-background",
              isToday && "bg-primary/5",
            )}
          >
            <span
              className={cn(
                "text-xs font-medium flex items-center justify-center h-5 w-5 rounded-full",
                isToday && "bg-primary text-primary-foreground font-bold",
                !isCurrentMonth && "opacity-50",
              )}
            >
              {formattedDate}
            </span>
            <div className="mt-1 flex flex-col gap-0.5 overflow-y-auto max-h-[45px] scrollbar-hide">
              {dayJobs.map((job) => (
                <HoverCard key={job.id} openDelay={100} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <div
                      className={cn(
                        "px-1.5 py-0.5 rounded-[3px] text-[9px] font-semibold truncate text-white cursor-pointer shadow-sm",
                        colorClass,
                      )}
                    >
                      {job.company}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent
                    className="w-64 p-3 shadow-xl border-primary/10"
                    side="top"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold leading-none">
                          {job.company}
                        </h4>
                        <Badge
                          variant="outline"
                          className="text-[9px] h-4 uppercase"
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {job.job_title}
                      </p>
                      <div className="flex flex-col gap-1 pt-1 border-t">
                        <span className="text-[10px] font-medium text-muted-foreground italic truncate">
                          📍 {job.location || "Remoto / Link"}
                        </span>
                        {job.notes && (
                          <p className="text-[10px] text-muted-foreground line-clamp-2 italic">
                            "{job.notes}"
                          </p>
                        )}
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
        <div key={day.toString()} className="grid grid-cols-7 border-l">
          {days}
        </div>,
      );
      days = [];
    }
    return <div className="border-t">{rows}</div>;
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="p-4 bg-card">{renderHeader()}</div>
      {renderDays()}
      {renderCells()}
    </div>
  );
}
