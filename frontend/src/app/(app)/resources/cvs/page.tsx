import { CurriculumGallery } from "@/components/resources/personal-cvs";

export default function CurriculumPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Meus Currículos</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie suas versões de currículo e documentos de candidatura.
        </p>
      </div>

      <CurriculumGallery />
    </div>
  );
}
