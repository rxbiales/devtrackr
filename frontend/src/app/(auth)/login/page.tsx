"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    try {
      const response = await fetch("http://localhost:8000/token/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });

      if (!response.ok) throw new Error("Invalid email or password");

      const data = await response.json();

      document.cookie = `token=${data.access_token}; path=/; max-age=3600; SameSite=Lax`;
      localStorage.setItem("user_email", email);

      window.location.href = "/";
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <LoginForm />
          {error && (
            <p className="text-sm text-red-500 text-center mt-4">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
