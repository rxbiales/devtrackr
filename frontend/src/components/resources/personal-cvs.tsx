"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, ExternalLink } from "lucide-react";
import { fetchAllCurriculums, Curriculum } from "@/services/curriculumServices";
import { AddCurriculumDialog } from "./create-cvs";

export function CurriculumGallery() {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllCurriculums();
      setCurriculums(data);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
            Galeria de Recursos
          </span>
        </div>
        <AddCurriculumDialog onSuccess={loadData} />
      </div>

      {curriculums.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p>Nenhum currículo encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {curriculums.map((cv) => (
            <Card
              key={cv.id}
              className="flex flex-col border shadow-sm hover:border-primary/15 transition-all group"
            >
              <CardContent className="p-0">
                <div className="h-48 bg-muted/30 flex items-center justify-center border-b overflow-hidden relative">
                  <iframe
                    src={cv.file_path}
                    className="w-full h-full pointer-events-none scale-90 origin-top pt-4 grayscale-[0.5] group-hover:grayscale-0 transition-all"
                    title={cv.name}
                  />
                  <div className="absolute inset-0 bg-transparent" />
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/5 text-primary border border-primary/10">
                        <FileText className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold truncate">
                          {cv.name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          Versão {cv.version}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t pt-3">
                    <Badge
                      variant="outline"
                      className="text-[11px] font-bold uppercase"
                    >
                      {/* Formata a data vinda do banco */}
                      {new Date(cv.created_at).toLocaleDateString()}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs gap-1.5"
                        onClick={() => window.open(cv.file_path, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" /> Visualizar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
