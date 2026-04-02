import { ProductDetailView } from "@/features/catalog/ui/ProductDetailView";

type Props = { params: Promise<{ tenantSlug: string; productId: string }> };

/**
 * Detalhe do item — modo gerenciamento e histórico.
 */
export default async function ProductDetailPage({ params }: Props) {
  const { tenantSlug, productId } = await params;
  return <ProductDetailView tenantSlug={tenantSlug} productId={productId} />;
}
