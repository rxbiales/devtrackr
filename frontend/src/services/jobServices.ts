import { Job } from "@/types/job";

const API_URL = "http://localhost:8000";

export async function fetchAllJobs(): Promise<Job[]> {
  try {
    const response = await fetch(`${API_URL}/jobs/`);
    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

export async function fetchActiveJobs(): Promise<Job[]> {
  try {
    const response = await fetch(`${API_URL}/jobs/`);
    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }

    const jobs: Job[] = await response.json();

    return jobs.filter((job) => job.is_active);
  } catch (error) {
    console.error("Error fetching active jobs:", error);
    return [];
  }
}

export async function createJob(jobData: Omit<Job, "id" | "is_active">) {
  try {
    const response = await fetch(`${API_URL}/jobs/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
}

export async function updateJobStatus(id: number, status: string) {
  // Ajustado para a rota padrão que criamos acima
  const fullUrl = `${API_URL}/jobs/${id}`;

  try {
    const response = await fetch(fullUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }), // Enviando o novo status
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    throw error;
  }
}
export async function deactivateJob(id: number) {
  const response = await fetch(`${API_URL}/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_active: false }),
  });

  if (!response.ok) {
    throw new Error(`Erro na API ao desativar vaga: ${response.statusText}`);
  }

  return await response.json();
}

export async function deleteJobPermanently(id: number) {
  const response = await fetch(`${API_URL}/jobs/${id}`, {
    method: "DELETE",
  });
  return await response.json();
}
