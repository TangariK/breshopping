import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/molecules/LogoutButton";

type Props = {
  tenantSlug: string;
  shopName: string;
  children: ReactNode;
};

/**
 * Shell do painel: navegação lateral e área de conteúdo.
 */
export function TenantShell({ tenantSlug, shopName, children }: Props) {
  const base = `/${tenantSlug}`;
  const links = [
    { href: `${base}/dashboard`, label: "Início" },
    { href: `${base}/inventory`, label: "Inventário" },
    { href: `${base}/products/new`, label: "Novo item" },
  ];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-6">
        <aside className="hidden w-52 shrink-0 flex-col gap-2 md:flex">
          <div className="mb-4 text-sm font-semibold">{shopName}</div>
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6">
            <LogoutButton />
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
