"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { formatBRLInput } from "@/shared/lib/money";

type Props = { tenantSlug: string; productId: string };

/**
 * Modo gerenciamento do item: curadoria, histórico de preços e ações rápidas.
 */
export function ProductDetailView({ tenantSlug, productId }: Props) {
  const [data, setData] = useState<{
    product: Record<string, unknown>;
    images: { id: string; image_url: string }[];
    priceHistory: Record<string, unknown>[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [priceOpen, setPriceOpen] = useState(false);
  const [acq, setAcq] = useState("");
  const [sale, setSale] = useState("");

  useEffect(() => {
    let live = true;
    void (async () => {
      const res = await fetch(`/api/tenants/${tenantSlug}/products/${productId}`);
      if (!live) return;
      if (!res.ok) {
        setError("Item não encontrado.");
        return;
      }
      const json = await res.json();
      setData(json);
      setAcq(String(json.product.acquisition_price ?? ""));
      setSale(String(json.product.display_price ?? ""));
    })();
    return () => {
      live = false;
    };
  }, [tenantSlug, productId]);

  const refetch = () => {
    void (async () => {
      const res = await fetch(`/api/tenants/${tenantSlug}/products/${productId}`);
      if (!res.ok) return;
      const json = await res.json();
      setData(json);
      setAcq(String(json.product.acquisition_price ?? ""));
      setSale(String(json.product.display_price ?? ""));
    })();
  };

  const savePrice = async () => {
    const res = await fetch(`/api/tenants/${tenantSlug}/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        acquisitionPrice: Number(acq),
        displayPrice: Number(sale),
      }),
    });
    if (res.ok) {
      setPriceOpen(false);
      refetch();
    }
  };

  const markSold = async () => {
    const res = await fetch(`/api/tenants/${tenantSlug}/products/${productId}/sold`, { method: "POST" });
    if (res.ok) refetch();
  };

  const printLabel = () => {
    window.print();
  };

  if (error || !data) {
    return <p className="text-sm text-muted-foreground">{error ?? "Carregando…"}</p>;
  }

  const p = data.product;
  const title = String(p.title ?? "");
  const condition = String(p.product_condition ?? "");
  const supplier = String(p.supplier_name ?? "—");
  const status = String(p.status ?? "");

  const condLabel =
    condition === "novo_com_etiqueta"
      ? "Novo com etiqueta"
      : condition === "usado_excelente"
        ? "Usado — excelente"
        : condition === "usado_marcas_uso"
          ? "Usado — marcas de uso"
          : condition;

  return (
    <div className="space-y-6 print:max-w-none">
      <div className="flex flex-col gap-4 print:hidden md:flex-row md:items-start md:justify-between">
        <div>
          <Link href={`/${tenantSlug}/inventory`} className="text-sm text-muted-foreground hover:underline">
            ← Inventário
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone={status === "disponivel" ? "success" : status === "reservado" ? "warning" : "muted"}>
              {status}
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setPriceOpen(true)}>
            Mudar preço
          </Button>
          <Button variant="secondary" onClick={() => void markSold()}>
            Marcar como vendido
          </Button>
          <Button variant="ghost" onClick={printLabel}>
            Imprimir etiqueta
          </Button>
        </div>
      </div>

      <div id="print-area" className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(data.images ?? []).map((img) => (
              <div key={img.id} className="h-40 w-40 overflow-hidden rounded-xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.image_url} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <section className="rounded-xl border border-border p-4">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">Curadoria</h2>
            <p className="mt-2 text-sm">
              <span className="text-muted-foreground">Fornecedor:</span> {supplier}
            </p>
            <p className="mt-1 text-sm">
              <span className="text-muted-foreground">Conservação:</span> {condLabel}
            </p>
          </section>
        </div>
        <aside className="space-y-3 rounded-xl border border-border p-4">
          <h2 className="text-sm font-semibold uppercase text-muted-foreground">Preços atuais</h2>
          <p className="text-sm">
            Custo: {formatBRLInput(Number(p.acquisition_price ?? 0))}
          </p>
          <p className="text-sm">
            Vitrine: {formatBRLInput(Number(p.display_price ?? 0))}
          </p>
          <h3 className="pt-4 text-sm font-semibold uppercase text-muted-foreground">Histórico</h3>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {data.priceHistory.length === 0 ? <li>Sem alterações registradas ainda.</li> : null}
            {data.priceHistory.map((h) => (
              <li key={String(h.id)}>
                {String(h.changed_at)} — vitrine {String(h.previous_display_price)} → {String(h.new_display_price)}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="hidden print:block">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-lg">{formatBRLInput(Number(p.display_price ?? 0))}</p>
        <p className="text-sm text-gray-600">{supplier}</p>
      </div>

      {priceOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 print:hidden">
          <div className="w-full max-w-sm rounded-xl border border-border bg-background p-4 shadow-lg">
            <h3 className="font-semibold">Atualizar preços</h3>
            <div className="mt-3 space-y-2">
              <label className="text-sm">Custo</label>
              <Input value={acq} onChange={(e) => setAcq(e.target.value)} />
              <label className="text-sm">Vitrine</label>
              <Input value={sale} onChange={(e) => setSale(e.target.value)} />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setPriceOpen(false)}>
                Fechar
              </Button>
              <Button onClick={() => void savePrice()}>Salvar</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
