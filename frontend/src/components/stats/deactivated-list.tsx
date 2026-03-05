"use client";

import * as React from "react";
import { Search, Trash2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { fetchAllJobs, deleteJobPermanently } from "@/services/jobServices";

export function DeactivatedList() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadJobs = React.useCallback(async () => {
    try {
      const data = await fetchAllJobs();
      setJobs(data.filter((j: any) => !j.is_active));
    } catch (error) {
      console.error("Erro ao carregar inativas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleDelete = async (id: number) => {
    try {
      await deleteJobPermanently(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4 w-full">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar no arquivo morto..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-muted/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Plataforma</TableHead>
              <TableHead>Data de Aplicação</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium opacity-60">
                    {job.company}
                  </TableCell>
                  <TableCell className="opacity-60">{job.job_title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="opacity-60">
                      {job.work_mode || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground italic opacity-60">
                    {job.platform || "—"}
                  </TableCell>
                  <TableCell className="opacity-60">
                    {job.applied_date
                      ? new Date(job.applied_date).toLocaleDateString("pt-BR")
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ⚠️ ATENÇÃO: Ação irreversível
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Deseja excluir permanentemente esta vaga do banco de
                            dados? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(job.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Confirmar Exclusão
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
