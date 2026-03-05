"use client";

import * as React from "react";
import { Search, Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAllJobs, deactivateJob } from "@/services/jobServices";

const statusVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  applied: "secondary",
  interviewing: "default",
  rejected: "destructive",
  offer: "outline",
};

export function GeneralList() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadJobs = React.useCallback(async () => {
    try {
      const data = await fetchAllJobs();
      setJobs(data.filter((j: any) => j.is_active));
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const onDeactivate = async (id: number) => {
    try {
      await deactivateJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (error) {
      console.error("Erro ao desativar:", error);
    }
  };

  const filtered = jobs.filter(
    (j) =>
      j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.job_title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4 w-full">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por empresa ou cargo..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((job) => (
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
                    <Badge variant={statusVariants[job.status] || "default"}>
                      {(job.status || "applied").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(job.applied_date).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeactivate(job.id)}
                      className="text-muted-foreground hover:text-primary"
                      title="Desativar (Mover para Arquivo)"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
