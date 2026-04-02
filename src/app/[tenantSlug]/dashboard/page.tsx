import { formatBRLInput } from "@/shared/lib/money";
import { getDashboardSummary } from "@/features/tenant/services/tenant.service";
import { getServerSession } from "@/shared/lib/get-session";
import { redirect } from "next/navigation";

type Props = { params: Promise<{ tenantSlug: string }> };

/**
 * Dashboard — resumo de itens e valor em estoque (itens disponíveis).
 */
export default async function DashboardPage({ params }: Props) {
  const { tenantSlug } = await params;
  const session = await getServerSession();
  if (!session || session.tenantSlug !== tenantSlug) {
    redirect("/login");
  }
  const summary = await getDashboardSummary(session.tenantId);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Início</h1>
        <p className="text-sm text-muted-foreground">Resumo do seu brechó.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Itens cadastrados</p>
          <p className="mt-2 text-3xl font-semibold">{summary.totalItems}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Valor em estoque (disponíveis)</p>
          <p className="mt-2 text-3xl font-semibold">{formatBRLInput(Number(summary.stockValue))}</p>
        </div>
      </div>
    </div>
  );
}
