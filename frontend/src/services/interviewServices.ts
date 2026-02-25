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