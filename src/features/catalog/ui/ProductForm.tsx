"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { MoneyField } from "@/components/molecules/MoneyField";
import { PRODUCT_CONDITIONS } from "@/features/catalog/model/product.schema";
import { ImageDropzone } from "@/features/catalog/ui/ImageDropzone";
import { formatBRLInput } from "@/shared/lib/money";

type Category = { id: string; name: string };
type Supplier = { id: string; name: string };

type Props = {
  tenantSlug: string;
};

/**
 * Formulário rápido de catalogação (básico, atributos, preços, imagens, fornecedor).
 */
export function ProductForm({ tenantSlug }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [supplierId, setSupplierId] = useState<string>("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [sku, setSku] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
  const [tags, setTags] = useState("");
  const [condition, setCondition] = useState<string>(PRODUCT_CONDITIONS[0]);
  const [acq, setAcq] = useState(0);
  const [sale, setSale] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState("");

  useEffect(() => {
    void (async () => {
      const [c, s] = await Promise.all([
        fetch(`/api/tenants/${tenantSlug}/categories`).then((r) => r.json()),
        fetch(`/api/tenants/${tenantSlug}/suppliers`).then((r) => r.json()),
      ]);
      setCategories(c.categories ?? []);
      setSuppliers(s.suppliers ?? []);
    })();
  }, [tenantSlug]);

  useEffect(() => {
    if (!supplierId && suppliers.length > 0) {
      setSupplierId(suppliers[0].id);
    }
  }, [suppliers, supplierId]);

  const marginHint = useMemo(() => {
    if (acq <= 0 || sale <= 0) return "Informe custo e preço de vitrine para ver a margem estimada.";
    const margin = sale - acq;
    const pct = acq > 0 ? (margin / acq) * 100 : 0;
    return `Margem estimada: ${formatBRLInput(margin)} (${pct.toFixed(1)}% sobre o custo).`;
  }, [acq, sale]);

  const filteredSuppliers = useMemo(() => {
    const q = supplierFilter.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((s) => s.name.toLowerCase().includes(q));
  }, [suppliers, supplierFilter]);

  const submit = async () => {
    setError(null);
    if (!supplierId) {
      setError("Selecione um fornecedor.");
      return;
    }
    setLoading(true);
    try {
      const tagList = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const res = await fetch(`/api/tenants/${tenantSlug}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          categoryId: categoryId || null,
          supplierId,
          sku: sku || null,
          size: size || null,
          color: color || null,
          brand: brand || null,
          material: material || null,
          tags: tagList,
          productCondition: condition,
          acquisitionPrice: acq,
          displayPrice: sale,
          imageUrls: imageUrls.length ? imageUrls : undefined,
        }),
      });
      if (!res.ok) {
        await res.json().catch(() => null);
        setError("Não foi possível salvar. Verifique os campos e tente novamente.");
        return;
      }
      router.push(`/${tenantSlug}/inventory`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async () => {
    if (newSupplierName.trim().length < 2) return;
    const res = await fetch(`/api/tenants/${tenantSlug}/suppliers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSupplierName.trim() }),
    });
    const data = await res.json();
    if (res.ok && data.supplier) {
      setSuppliers((s) => [...s, data.supplier]);
      setSupplierId(data.supplier.id);
      setModalOpen(false);
      setNewSupplierName("");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Novo item</h1>
        <p className="text-sm text-muted-foreground">Cadastro rápido, estilo vitrine.</p>
      </div>

      <section className="space-y-3 rounded-xl border border-border bg-background p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Básico</h2>
        <div className="space-y-1">
          <label className="text-sm font-medium">Título</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Jaqueta jeans vintage" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Categoria</label>
          <select
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Selecione…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-background p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Atributos</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="SKU (opcional)">
            <Input value={sku} onChange={(e) => setSku(e.target.value)} />
          </Field>
          <Field label="Tamanho">
            <Input value={size} onChange={(e) => setSize(e.target.value)} />
          </Field>
          <Field label="Cor">
            <Input value={color} onChange={(e) => setColor(e.target.value)} />
          </Field>
          <Field label="Marca">
            <Input value={brand} onChange={(e) => setBrand(e.target.value)} />
          </Field>
          <Field label="Material">
            <Input value={material} onChange={(e) => setMaterial(e.target.value)} />
          </Field>
          <Field label="Tags (vírgula)">
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="vintage, anos 90" />
          </Field>
          <Field label="Conservação">
            <select
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="novo_com_etiqueta">Novo com etiqueta</option>
              <option value="usado_excelente">Usado — excelente</option>
              <option value="usado_marcas_uso">Usado — marcas de uso</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-background p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Preços</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <MoneyField label="Preço de aquisição (custo)" value={acq} onChange={setAcq} />
          <MoneyField label="Preço de vitrine (venda)" value={sale} onChange={setSale} helperText={marginHint} />
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-background p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Fornecedor</h2>
        <div className="flex flex-col gap-2 md:flex-row md:items-end">
          <div className="min-w-0 flex-1 space-y-1">
            <label className="text-sm font-medium">Buscar</label>
            <Input value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)} placeholder="Filtrar…" />
          </div>
          <Button type="button" variant="secondary" onClick={() => setModalOpen(true)}>
            + Novo fornecedor
          </Button>
        </div>
        <select
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
        >
          {filteredSuppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-background p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Imagens</h2>
        <ImageDropzone onChange={setImageUrls} />
        <p className="text-xs text-muted-foreground">
          Preview local; no MVP as imagens são enviadas como data URL ao salvar. Para produção, use URLs de
          armazenamento (Cloudinary, Supabase Storage, etc.).
        </p>
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button onClick={() => void submit()} disabled={loading || !title}>
          {loading ? "Salvando…" : "Salvar item"}
        </Button>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-background p-4 shadow-lg">
            <h3 className="font-semibold">Novo fornecedor</h3>
            <div className="mt-3 space-y-1">
              <label className="text-sm font-medium">Nome</label>
              <Input value={newSupplierName} onChange={(e) => setNewSupplierName(e.target.value)} />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Fechar
              </Button>
              <Button onClick={() => void createSupplier()}>Salvar</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
