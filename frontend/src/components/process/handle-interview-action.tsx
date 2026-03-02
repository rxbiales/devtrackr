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
import { MessageSquarePlus, Calendar, MapPin, FileText } from "lucide-react";
import { createInterview } from "@/services/interviewServices";
import { updateJobStatus } from "@/services/jobServices";

export function InterviewAction({
  job,
  onSuccess,
}: {
  job: any;
  onSuccess: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    location: "",
    notes: "",
  });

  const handleConfirm = async () => {
    try {
      await createInterview({
        job_id: job.id,
        interview_date: new Date(formData.date).toISOString(),
        location: formData.location,
        notes: formData.notes,
      });
      await updateJobStatus(job.id, "interviewing");
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
        className="h-8 px-2 text-xs text-green-700 hover:bg-green-100/70"
      >
        <MessageSquarePlus className="h-4 w-4" /> Entrevista
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Agendar Entrevista</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Data e Hora
              </label>
              <Input
                type="datetime-local"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Localização / Link
              </label>
              <Input
                placeholder="Google Meet..."
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <FileText className="h-3 w-3" /> Anotações
              </label>
              <Textarea
                placeholder="Nomes..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full"
              onClick={handleConfirm}
              disabled={!formData.date}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
