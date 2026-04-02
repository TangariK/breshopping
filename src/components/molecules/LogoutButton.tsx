"use client";

import { useRouter } from "next/navigation";

/**
 * Encerra sessão via API e redireciona para a home.
 */
export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-left text-xs text-muted-foreground hover:text-foreground"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
      }}
    >
      Sair
    </button>
  );
}
