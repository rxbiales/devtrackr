import { Interview } from "@/types/interview";

const API_URL = "http://localhost:8000";

export async function fetchAllInterviews(): Promise<Interview[]> {
  try {
    const response = await fetch(`${API_URL}/interviews/`);
    if (!response.ok) {
      throw new Error("Failed to fetch interviews");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return [];
  }
}

export async function createInterview(data: {
  job_id: number;
  interview_date: string;
  location: string;
  notes: string;
}) {
  console.log("Tentando criar entrevista com dados:", data);

  const response = await fetch(`${API_URL}/interviews/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.log("DETALHE DO ERRO:", JSON.stringify(errorBody, null, 2)); // Isso vai mostrar exatamente qual campo falhou
    throw new Error("Erro ao criar entrevista");
  }

  return response.json();
}
