import { getAuthHeaders } from "./authHeaders";
const API_URL = "http://localhost:8000";

export async function createTechnicalChallenge(data: any) {
  const response = await fetch(`${API_URL}/challenges/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao criar desafio");
  return response.json();
}
