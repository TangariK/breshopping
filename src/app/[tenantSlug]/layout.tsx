import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { TenantShell } from "@/components/organisms/TenantShell";
import { getTenantBySlug } from "@/features/tenant/services/tenant.service";
import { getServerSession } from "@/shared/lib/get-session";

type Props = { children: ReactNode; params: Promise<{ tenantSlug: string }> };

/**
 * Layout do painel por slug do brechó — valida sessão e carrega nome do tenant.
 */
export default async function TenantLayout({ children, params }: Props) {
  const { tenantSlug } = await params;
  const session = await getServerSession();
  if (!session || session.tenantSlug !== tenantSlug) {
    redirect("/login");
  }
  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) {
    notFound();
  }
  return (
    <TenantShell tenantSlug={tenantSlug} shopName={tenant.name}>
      {children}
    </TenantShell>
  );
}
