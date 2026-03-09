"use client";

import { SignupForm } from "@/components/signup-form";
import { signup } from "@/services/authServices";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signup(email, password);
      router.push("/login");
    } catch (error) {
      alert("Erro ao criar conta.");
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <SignupForm />
        </form>
      </div>
    </div>
  );
}
