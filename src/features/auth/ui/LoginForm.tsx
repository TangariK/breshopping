"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

/**
 * Formulário de login (email/senha) com redirecionamento opcional `?next=`.
 */
export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Falha no login.");
        return;
      }
      const next = params.get("next");
      const dest = next && next.startsWith("/") ? next : `/${data.tenantSlug}/dashboard`;
      router.push(dest);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-border bg-background p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Entrar</h1>
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Senha</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button className="w-full" onClick={() => void submit()} disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <p className="text-sm text-muted-foreground">
        Não tem conta?{" "}
        <Link href="/register" className="text-foreground underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
