import { z } from "zod";

/**
 * Estados de conservação aceitos no MVP (valores persistidos em products.product_condition).
 */
export const PRODUCT_CONDITIONS = [
  "novo_com_etiqueta",
  "usado_excelente",
  "usado_marcas_uso",
] as const;

export const PRODUCT_STATUSES = ["disponivel", "reservado", "vendido"] as const;

export const createProductSchema = z.object({
  title: z.string().min(2).max(255),
  description: z.string().max(5000).optional(),
  categoryId: z.string().uuid().optional().nullable(),
  supplierId: z.string().uuid(),
  sku: z.string().max(50).optional().nullable(),
  size: z.string().max(20).optional().nullable(),
  color: z.string().max(50).optional().nullable(),
  brand: z.string().max(100).optional().nullable(),
  material: z.string().max(100).optional().nullable(),
  tags: z.array(z.string().max(40)).max(20).optional(),
  productCondition: z.enum(PRODUCT_CONDITIONS),
  status: z.enum(PRODUCT_STATUSES).optional(),
  acquisitionPrice: z.number().nonnegative(),
  displayPrice: z.number().nonnegative(),
  /** URLs públicas ou data URLs temporárias (preview local). */
  imageUrls: z.array(z.string().min(4)).max(12).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema
  .partial()
  .extend({
    title: z.string().min(2).max(255).optional(),
    supplierId: z.string().uuid().optional(),
    productCondition: z.enum(PRODUCT_CONDITIONS).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "Nada para atualizar" });

export const markSoldSchema = z.object({
  finalPrice: z.number().nonnegative().optional(),
});
