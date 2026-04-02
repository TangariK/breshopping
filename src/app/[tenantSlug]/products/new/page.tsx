import { ProductForm } from "@/features/catalog/ui/ProductForm";

type Props = { params: Promise<{ tenantSlug: string }> };

/**
 * Novo item — formulário de catalogação.
 */
export default async function NewProductPage({ params }: Props) {
  const { tenantSlug } = await params;
  return <ProductForm tenantSlug={tenantSlug} />;
}
