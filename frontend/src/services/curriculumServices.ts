import { getAuthHeaders } from "./authHeaders";
const API_URL = "http://localhost:8000";

export async function fetchAllCurriculums() {
  const response = await fetch(`${API_URL}/curriculums/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao buscar currículos");
  return response.json();
}

export async function createCurriculum(formData: FormData) {
  const response = await fetch(`${API_URL}/curriculums/upload`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: formData,
  });
  if (!response.ok) throw new Error("Erro ao fazer upload");
  return response.json();
}
