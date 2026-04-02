import { Suspense } from "react";
import { LoginForm } from "@/features/auth/ui/LoginForm";

/**
 * Página de login.
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Carregando…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
