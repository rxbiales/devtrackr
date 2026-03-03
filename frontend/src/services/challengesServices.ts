const API_URL = "http://localhost:8000";

export async function createTechnicalChallenge(data: {
  job_id: number;
  challenge_deadline: string;
  location: string;
  notes: string;
}) {
  console.log("Tentando criar desafio com dados:", data);

  const response = await fetch(`${API_URL}/challenges/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.error("Erro no Backend (Desafio):", errorBody);
    throw new Error("Erro ao criar desafio técnico");
  }

  return response.json();
}
