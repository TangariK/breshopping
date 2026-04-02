import { getPool } from "@/shared/lib/db";
import type { CreateProductInput } from "@/features/catalog/model/product.schema";

/**
 * Serviço de catálogo: criação de item único, listagem com filtros e atualização de preços com histórico.
 */

export type ListFilters = {
  categoryId?: string;
  status?: string;
  search?: string;
};

export async function listProducts(
  tenantId: string,
  filters: ListFilters,
): Promise<
  Array<{
    id: string;
    title: string;
    sku: string | null;
    status: string | null;
    category_name: string | null;
    display_price: string | null;
    thumb_url: string | null;
    color: string | null;
    size: string | null;
  }>
> {
  const pool = getPool();
  const params: unknown[] = [tenantId];
  let i = 2;
  let where = `p.tenant_id = $1`;
  if (filters.categoryId) {
    where += ` AND p.category_id = $${i++}`;
    params.push(filters.categoryId);
  }
  if (filters.status) {
    where += ` AND p.status = $${i++}`;
    params.push(filters.status);
  }
  if (filters.search?.trim()) {
    where += ` AND (p.title ILIKE $${i} OR p.brand ILIKE $${i} OR p.sku ILIKE $${i})`;
    params.push(`%${filters.search.trim()}%`);
    i++;
  }
  const q = `
    SELECT
      p.id,
      p.title,
      p.sku,
      p.status,
      c.name AS category_name,
      pp.current_display_price::text AS display_price,
      (
        SELECT image_url FROM product_images pi
        WHERE pi.product_id = p.id
        ORDER BY pi.is_main DESC, pi.created_at ASC
        LIMIT 1
      ) AS thumb_url,
      p.color,
      p.size
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN product_pricing pp ON pp.product_id = p.id
    WHERE ${where}
    ORDER BY p.created_at DESC
  `;
  const res = await pool.query(q, params);
  return res.rows;
}

export async function getProductDetail(tenantId: string, productId: string) {
  const pool = getPool();
  const p = await pool.query(
    `SELECT p.*, c.name AS category_name,
            s.name AS supplier_name,
            pp.acquisition_price::text AS acquisition_price,
            pp.current_display_price::text AS display_price,
            pp.original_target_price::text AS original_target_price
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     LEFT JOIN suppliers s ON s.id = p.supplier_id
     LEFT JOIN product_pricing pp ON pp.product_id = p.id
     WHERE p.id = $1 AND p.tenant_id = $2`,
    [productId, tenantId],
  );
  if (p.rows.length === 0) return null;
  const imgs = await pool.query(
    `SELECT id, image_url, is_main FROM product_images WHERE product_id = $1 ORDER BY is_main DESC, created_at`,
    [productId],
  );
  const hist = await pool.query(
    `SELECT id, previous_acquisition::text, new_acquisition::text,
            previous_display_price::text, new_display_price::text, changed_at
     FROM product_price_history
     WHERE product_id = $1
     ORDER BY changed_at DESC
     LIMIT 50`,
    [productId],
  );
  return { product: p.rows[0], images: imgs.rows, priceHistory: hist.rows };
}

export async function createProduct(tenantId: string, input: CreateProductInput) {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const tagsJson = JSON.stringify(input.tags ?? []);
    const pr = await client.query(
      `INSERT INTO products (
        tenant_id, category_id, supplier_id, sku, title, description,
        size, color, brand, material, product_condition, status, tags
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, COALESCE($12, 'disponivel'), $13::jsonb
      ) RETURNING id`,
      [
        tenantId,
        input.categoryId ?? null,
        input.supplierId,
        input.sku ?? null,
        input.title,
        input.description ?? null,
        input.size ?? null,
        input.color ?? null,
        input.brand ?? null,
        input.material ?? null,
        input.productCondition,
        input.status ?? null,
        tagsJson,
      ],
    );
    const productId: string = pr.rows[0].id;

    await client.query(
      `INSERT INTO product_pricing (product_id, acquisition_price, current_display_price, original_target_price)
       VALUES ($1, $2, $3, $4)`,
      [
        productId,
        input.acquisitionPrice,
        input.displayPrice,
        input.displayPrice,
      ],
    );

    const urls = input.imageUrls?.filter(Boolean) ?? [];
    let idx = 0;
    for (const url of urls) {
      await client.query(
        `INSERT INTO product_images (product_id, image_url, is_main)
         VALUES ($1, $2, $3)`,
        [productId, url, idx === 0],
      );
      idx++;
    }

    await client.query("COMMIT");
    return { id: productId };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export async function updateProductPricing(
  tenantId: string,
  productId: string,
  acquisition: number,
  display: number,
) {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const cur = await client.query(
      `SELECT pp.acquisition_price, pp.current_display_price, p.tenant_id
       FROM product_pricing pp
       JOIN products p ON p.id = pp.product_id
       WHERE pp.product_id = $1`,
      [productId],
    );
    if (cur.rows.length === 0 || cur.rows[0].tenant_id !== tenantId) {
      throw new Error("NOT_FOUND");
    }
    const prevA = Number(cur.rows[0].acquisition_price);
    const prevD = Number(cur.rows[0].current_display_price);

    await client.query(
      `UPDATE product_pricing SET acquisition_price = $1, current_display_price = $2, updated_at = CURRENT_TIMESTAMP
       WHERE product_id = $3`,
      [acquisition, display, productId],
    );

    await client.query(
      `INSERT INTO product_price_history (
        product_id, previous_acquisition, new_acquisition, previous_display_price, new_display_price
      ) VALUES ($1, $2, $3, $4, $5)`,
      [productId, prevA, acquisition, prevD, display],
    );

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export async function markProductSold(tenantId: string, productId: string) {
  const pool = getPool();
  const r = await pool.query(
    `UPDATE products SET status = 'vendido' WHERE id = $1 AND tenant_id = $2 RETURNING id`,
    [productId, tenantId],
  );
  return r.rowCount === 1;
}

export type PatchProductBody = Partial<{
  title: string;
  description: string | null;
  categoryId: string | null;
  supplierId: string;
  sku: string | null;
  size: string | null;
  color: string | null;
  brand: string | null;
  material: string | null;
  tags: string[];
  productCondition: string;
  status: string;
  acquisitionPrice: number;
  displayPrice: number;
}>;

export async function patchProduct(
  tenantId: string,
  productId: string,
  body: PatchProductBody,
) {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const own = await client.query(`SELECT id FROM products WHERE id = $1 AND tenant_id = $2`, [
      productId,
      tenantId,
    ]);
    if (own.rows.length === 0) throw new Error("NOT_FOUND");

    const fields: string[] = [];
    const vals: unknown[] = [];
    let n = 1;
    const set = (col: string, v: unknown) => {
      fields.push(`${col} = $${n++}`);
      vals.push(v);
    };

    if (body.title !== undefined) set("title", body.title);
    if (body.description !== undefined) set("description", body.description);
    if (body.categoryId !== undefined) set("category_id", body.categoryId);
    if (body.supplierId !== undefined) set("supplier_id", body.supplierId);
    if (body.sku !== undefined) set("sku", body.sku);
    if (body.size !== undefined) set("size", body.size);
    if (body.color !== undefined) set("color", body.color);
    if (body.brand !== undefined) set("brand", body.brand);
    if (body.material !== undefined) set("material", body.material);
    if (body.productCondition !== undefined) set("product_condition", body.productCondition);
    if (body.status !== undefined) set("status", body.status);
    if (body.tags !== undefined) set("tags", JSON.stringify(body.tags));

    if (fields.length > 0) {
      vals.push(productId);
      await client.query(`UPDATE products SET ${fields.join(", ")} WHERE id = $${n}`, vals);
    }

    if (body.acquisitionPrice !== undefined && body.displayPrice !== undefined) {
      const cur = await client.query(
        `SELECT pp.acquisition_price, pp.current_display_price
         FROM product_pricing pp
         JOIN products p ON p.id = pp.product_id
         WHERE pp.product_id = $1 AND p.tenant_id = $2`,
        [productId, tenantId],
      );
      if (cur.rows.length === 0) throw new Error("NOT_FOUND");
      const prevA = Number(cur.rows[0].acquisition_price);
      const prevD = Number(cur.rows[0].current_display_price);
      await client.query(
        `UPDATE product_pricing SET acquisition_price = $1, current_display_price = $2, updated_at = CURRENT_TIMESTAMP
         WHERE product_id = $3`,
        [body.acquisitionPrice, body.displayPrice, productId],
      );
      await client.query(
        `INSERT INTO product_price_history (
          product_id, previous_acquisition, new_acquisition, previous_display_price, new_display_price
        ) VALUES ($1, $2, $3, $4, $5)`,
        [productId, prevA, body.acquisitionPrice, prevD, body.displayPrice],
      );
    }

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
