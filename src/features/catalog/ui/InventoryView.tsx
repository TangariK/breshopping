"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { formatBRLInput } from "@/shared/lib/money";

type ProductRow = {
  id: string;
  title: string;
  sku: string | null;
  status: string | null;
  category_name: string | null;
  display_price: string | null;
  thumb_url: string | null;
  color: string | null;
  size: string | null;
};

type Category = { id: string; name: string };

type Props = { tenantSlug: string };

/**
 * Listagem dinâmica com filtros em pílula e estado vazio amigável.
 */
export function InventoryView({ tenantSlug }: Props) {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catFilter, setCatFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>("disponivel");
  const [q, setQ] = useState("");

  useEffect(() => {
    let live = true;
    void (async () => {
      const c = await fetch(`/api/tenants/${tenantSlug}/categories`).then((r) => r.json());
      if (live) setCategories(c.categories ?? []);
    })();
    return () => {
      live = false;
    };
  }, [tenantSlug]);

  useEffect(() => {
    let live = true;
    const params = new URLSearchParams();
    if (catFilter) params.set("categoryId", catFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (q.trim()) params.set("q", q.trim());
    void (async () => {
      const res = await fetch(`/api/tenants/${tenantSlug}/products?${params.toString()}`);
      const data = await res.json();
      if (live) setProducts(data.products ?? []);
    })();
    return () => {
      live = false;
    };
  }, [tenantSlug, catFilter, statusFilter, q]);

  const pills = useMemo(
    () => [
      { id: "disponivel" as const, label: "Disponíveis" },
      { id: "reservado" as const, label: "Reservados" },
      { id: null, label: "Todos status" },
    ],
    [],
  );

  const statusTone = (s: string | null) => {
    if (s === "disponivel") return "success";
    if (s === "reservado") return "warning";
    return "muted";
  };

  const statusLabel = (s: string | null) => {
    if (s === "disponivel") return "Disponível";
    if (s === "reservado") return "Reservado";
    if (s === "vendido") return "Vendido";
    return s ?? "—";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Inventário</h1>
          <p className="text-sm text-muted-foreground">Gestão rápida dos seus desapegos.</p>
        </div>
        <Link href={`/${tenantSlug}/products/new`}>
          <Button>Novo item</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          className="min-w-[200px] flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="Buscar título, marca ou SKU…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-medium text-muted-foreground">Categoria:</span>
        <button
          type="button"
          className={`rounded-full px-3 py-1 text-xs ${!catFilter ? "bg-foreground text-background" : "bg-muted text-foreground"}`}
          onClick={() => setCatFilter(null)}
        >
          Todas
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`rounded-full px-3 py-1 text-xs ${catFilter === c.id ? "bg-foreground text-background" : "bg-muted text-foreground"}`}
            onClick={() => setCatFilter(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-medium text-muted-foreground">Status:</span>
        {pills.map((p) => (
          <button
            key={p.label}
            type="button"
            className={`rounded-full px-3 py-1 text-xs ${statusFilter === p.id ? "bg-foreground text-background" : "bg-muted text-foreground"}`}
            onClick={() => setStatusFilter(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
          <div className="mb-4 text-6xl" aria-hidden>
            👜
          </div>
          <h2 className="text-lg font-semibold">Você ainda não tem itens</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Que tal cadastrar seu primeiro desapego? Leva só um minuto.
          </p>
          <Link href={`/${tenantSlug}/products/new`} className="mt-6">
            <Button>Cadastrar primeiro item</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Foto</th>
                <th className="px-3 py-2">Título</th>
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Vitrine</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-3 py-2">
                    <div className="h-12 w-12 overflow-hidden rounded-md border border-border bg-muted">
                      {p.thumb_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.thumb_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                          —
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <Link href={`/${tenantSlug}/products/${p.id}`} className="font-medium hover:underline">
                      {p.title}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {[p.category_name, p.color, p.size].filter(Boolean).join(" · ")}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{p.sku ?? "—"}</td>
                  <td className="px-3 py-2">
                    {p.display_price != null ? formatBRLInput(Number(p.display_price)) : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <Badge tone={statusTone(p.status)}>{statusLabel(p.status)}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
