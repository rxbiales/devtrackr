import Cookies from "js-cookie";

const API_URL = "http://localhost:8000";

export const login = async (email: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${API_URL}/token/`, {
    method: "POST",
    body: formData,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (!response.ok) throw new Error("Falha no login");

  const data = await response.json();
  // Salva o token no cookie por 30 minutos (mesmo tempo do seu backend)
  Cookies.set("token", data.access_token, { expires: 1 / 48, secure: true });
  return data;
};

export const signup = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Falha ao criar conta");
  return await response.json();
};
