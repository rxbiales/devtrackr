"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAllJobs } from "@/services/jobServices";
import { useEffect } from "react";

const statusVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  applied: "secondary",
  interviewing: "default",
  rejected: "destructive",
  offer: "outline",
  inactive: "destructive",
};

export function GeneralList() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await fetchAllJobs();
        setJobs(data);
      } catch (error) {
        console.error("Erro ao buscar vagas:", error);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.role && job.role.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por empresa ou cargo..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Plataforma</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Aplicação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Carregando vagas...
                </TableCell>
              </TableRow>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => {
                const currentStatus = !job.is_active ? "inactive" : job.status;
                const statusLabel = !job.is_active
                  ? "INACTIVE"
                  : (job.status || "N/A").toUpperCase();

                return (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.company}</TableCell>
                    <TableCell>{job.job_title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{job.work_mode || "N/A"}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground italic">
                      {job.platform || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusVariants[currentStatus] || "default"}
                      >
                        {statusLabel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {job.applied_date
                        ? new Date(job.applied_date).toLocaleDateString("pt-BR")
                        : "Data não disponível"}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  Nenhuma vaga encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
