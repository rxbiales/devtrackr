"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ClipboardPen, Calendar, MapPin, FileText } from "lucide-react";
import { createTechnicalChallenge } from "@/services/challengesServices";
import { updateJobStatus } from "@/services/jobServices";

export function ChallengeAction({
  job,
  onSuccess,
}: {
  job: any;
  onSuccess: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    deadline: "",
    location: "",
    notes: "",
  });

  const handleConfirm = async () => {
    try {
      await createTechnicalChallenge({
        job_id: job.id,
        challenge_deadline: new Date(formData.deadline).toISOString(),
        location: formData.location,
        notes: formData.notes,
      });
      await updateJobStatus(job.id, "technical_challenge");
      setIsOpen(false);
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs text-blue-700 hover:bg-blue-100/70"
      >
        <ClipboardPen className="h-4 w-4" /> Desafio
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Registrar Desafio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Prazo
              </label>
              <Input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Link / Repositório
              </label>
              <Input
                placeholder="GitHub..."
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <FileText className="h-3 w-3" /> Requisitos
              </label>
              <Textarea
                placeholder="Instruções..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleConfirm}
              disabled={!formData.deadline}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
