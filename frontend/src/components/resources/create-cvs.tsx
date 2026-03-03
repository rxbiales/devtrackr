"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Upload, Hash, Plus, Loader2 } from "lucide-react";
import { createCurriculum } from "@/services/curriculumServices";

export function AddCurriculumDialog({ onSuccess }: { onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    version: "",
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Sugere o nome do arquivo (sem extensão) se o campo nome estiver vazio
      if (!formData.name) {
        setFormData((prev) => ({
          ...prev,
          name: selectedFile.name.replace(".pdf", ""),
        }));
      }
    }
  };

  const handleConfirm = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("name", formData.name);
      data.append("version", formData.version || "1.0");

      await createCurriculum(data);

      setIsOpen(false);
      setFile(null);
      setFormData({ name: "", version: "" });
      onSuccess();
    } catch (err) {
      console.error("Erro no upload:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-2">
          <Plus className="h-4 w-4" /> Novo Currículo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Subir Novo Currículo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Campo de Upload de Arquivo */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-2">
              <Upload className="h-3 w-3" /> Arquivo PDF
            </label>
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="cursor-pointer file:bg-primary/5 file:text-primary file:text-xs file:font-bold file:border-0 file:rounded-full"
            />
          </div>

          {/* Nome do Currículo */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-2">
              <FileText className="h-3 w-3" /> Nome de Identificação
            </label>
            <Input
              placeholder="Ex: Curriculo_FullStack_Rene"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* Versão */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-2">
              <Hash className="h-3 w-3" /> Versão do Documento
            </label>
            <Input
              placeholder="Ex: 2026.1"
              value={formData.version}
              onChange={(e) =>
                setFormData({ ...formData, version: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full gap-2"
            onClick={handleConfirm}
            disabled={!file || !formData.name || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Subindo...
              </>
            ) : (
              "Confirmar Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
