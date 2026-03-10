import { getAuthHeaders } from "./authHeaders";
const API_URL = "http://localhost:8000";

export async function fetchAllInterviews() {
  const response = await fetch(`${API_URL}/interviews/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch interviews");
  return response.json();
}

export async function createInterview(data: any) {
  const response = await fetch(`${API_URL}/interviews/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}
