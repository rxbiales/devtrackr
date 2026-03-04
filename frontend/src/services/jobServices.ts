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
  try {
    const response = await fetch(`${API_URL}/jobs/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(
        `Erro na API ao atualizar status: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating job status:", error);
    throw error;
  }
}

export async function deactivateJob(id: number) {
  try {
    const response = await fetch(`${API_URL}/jobs/${id}/deactivate`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na API ao desativar vaga: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deactivating job:", error);
    throw error;
  }
}

export async function getWeeklyStats() {
  const jobs = await fetchAllJobs();

  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const weeklyJobs = jobs.filter(
    (job: any) => new Date(job.applied_date) >= sevenDaysAgo,
  );

  const daysMap: Record<string, number> = {
    Seg: 0,
    Ter: 0,
    Qua: 0,
    Qui: 0,
    Sex: 0,
    Sáb: 0,
    Dom: 0,
  };
  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  weeklyJobs.forEach((job: any) => {
    const dayName = weekdays[new Date(job.applied_date).getDay()];
    if (daysMap[dayName] !== undefined) daysMap[dayName]++;
  });

  const weeklyChartData = Object.entries(daysMap).map(([day, count]) => ({
    day,
    applications: count,
  }));

  // 2. Processamento de Modelo de Trabalho
  const modelsMap: Record<string, number> = {
    Remoto: 0,
    Híbrido: 0,
    Presencial: 0,
  };
  weeklyJobs.forEach((job: any) => {
    const model = job.work_model || "Presencial"; // Fallback caso esteja nulo
    if (modelsMap[model] !== undefined) modelsMap[model]++;
  });

  const workModelData = [
    { model: "Remoto", count: modelsMap["Remoto"], fill: "#3b82f6" },
    { model: "Híbrido", count: modelsMap["Híbrido"], fill: "#a855f7" },
    { model: "Presencial", count: modelsMap["Presencial"], fill: "#64748b" },
  ];

  return {
    weeklyChartData,
    workModelData,
    totalApplications: weeklyJobs.length,
    goalPercentage: Math.min(Math.round((weeklyJobs.length / 65) * 100), 100),
  };
}
