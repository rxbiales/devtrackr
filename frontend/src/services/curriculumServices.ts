const API_URL = "http://localhost:8000";

export interface Curriculum {
  id: number;
  name: string;
  file_path: string;
  version: string;
  created_at: string;
}

export async function fetchAllCurriculums(): Promise<Curriculum[]> {
  const response = await fetch(`${API_URL}/curriculums/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.error("Erro no Backend (Curriculums):", errorBody);
    throw new Error("Erro ao buscar currículos");
  }

  return response.json();
}
export async function createCurriculum(formData: FormData) {
  const response = await fetch(`${API_URL}/curriculums/upload`, {
    method: "POST",
    // Não definir Content-Type manualmente ao enviar FormData; o navegador fará isso.
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Erro ao fazer upload do currículo");
  }

  return response.json();
}
