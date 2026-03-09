"use client";

import { LoginForm } from "@/components/login-form";
import { login } from "@/services/authServices";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      router.push("/");
    } catch (error) {
      alert("Falha no login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Este form é o único permitido */}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <LoginForm />
        </form>
      </div>
    </div>
  );
}
