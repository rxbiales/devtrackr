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
        
    return jobs.filter(job => job.is_active);
  } catch (error) {
    console.error("Error fetching active jobs:", error);
    return [];
  }
}
