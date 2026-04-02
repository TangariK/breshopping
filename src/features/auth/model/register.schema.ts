import { z } from "zod";
import { isValidSlug } from "@/shared/lib/slug";

/**
 * Schemas Zod do cadastro em duas etapas (usuário + negócio).
 */

export const stepUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(120),
  password: z.string().min(8).max(128),
});

export const stepBusinessSchema = z.object({
  shopName: z.string().min(2).max(255),
  address: z.string().min(3).max(500),
  city: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(255)
    .refine((s) => isValidSlug(s), "Slug inválido ou reservado"),
  currencyCode: z.string().length(3).optional(),
  measureSystem: z.enum(["metric", "imperial"]).optional(),
});

export const registerBodySchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(2).max(120),
    password: z.string().min(8).max(128),
    shopName: z.string().min(2).max(255),
    address: z.string().min(3).max(500),
    city: z.string().min(2).max(100),
    slug: z
      .string()
      .min(2)
      .max(255)
      .refine((s) => isValidSlug(s), "Slug inválido ou reservado"),
    currencyCode: z.string().length(3).optional(),
    measureSystem: z.enum(["metric", "imperial"]).optional(),
  })
  .transform((data) => ({
    ...data,
    currencyCode: data.currencyCode ?? "BRL",
    measureSystem: data.measureSystem ?? "metric",
  }));

export type RegisterBody = z.infer<typeof registerBodySchema>;
