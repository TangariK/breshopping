import { InventoryView } from "@/features/catalog/ui/InventoryView";

type Props = { params: Promise<{ tenantSlug: string }> };

/**
 * Inventário — listagem com filtros e estado vazio.
 */
export default async function InventoryPage({ params }: Props) {
  const { tenantSlug } = await params;
  return <InventoryView tenantSlug={tenantSlug} />;
}
