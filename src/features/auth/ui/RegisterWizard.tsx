"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { slugifyFromName, SLUG_REGEX } from "@/shared/lib/slug";

/**
 * Cadastro em duas etapas: usuário e negócio (slug com sugestão automática).
 */
export function RegisterWizard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const onShopNameChange = (v: string) => {
    setShopName(v);
    if (!slugTouched) {
      setSlug(slugifyFromName(v));
    }
  };

  const onSlugChange = (v: string) => {
    setSlugTouched(true);
    const cleaned = v.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSlug(cleaned);
  };

  const submit = async () => {
    setError(null);
    if (!SLUG_REGEX.test(slug)) {
      setError("Slug inválido. Use apenas letras minúsculas, números e hífens.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          password,
          shopName,
          address,
          city,
          slug,
          currencyCode: "BRL",
          measureSystem: "metric",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Erro ao cadastrar.");
        return;
      }
      router.push(`/${data.tenantSlug}/dashboard`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-border bg-background p-6 shadow-sm">
      <div>
        <h1 className="text-xl font-semibold">Criar conta</h1>
        <p className="text-sm text-muted-foreground">
          Passo {step} de 2 — {step === 1 ? "seus dados" : "seu brechó"}
        </p>
      </div>

      {step === 1 ? (
        <div className="space-y-3">
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Nome">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Senha">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          <Button className="w-full" onClick={() => setStep(2)} disabled={!email || !name || password.length < 8}>
            Continuar
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Field label="Nome do brechó">
            <Input value={shopName} onChange={(e) => onShopNameChange(e.target.value)} required />
          </Field>
          <Field label="Endereço">
            <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
          </Field>
          <Field label="Cidade">
            <Input value={city} onChange={(e) => setCity(e.target.value)} required />
          </Field>
          <Field
            label="Slug da URL"
            hint="Ex.: breshopping.com.br/seu-slug — apenas letras minúsculas, números e hífen."
          >
            <Input value={slug} onChange={(e) => onSlugChange(e.target.value)} required />
          </Field>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>
              Voltar
            </Button>
            <Button className="flex-1" onClick={() => void submit()} disabled={loading}>
              {loading ? "Salvando…" : "Finalizar"}
            </Button>
          </div>
        </div>
      )}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
