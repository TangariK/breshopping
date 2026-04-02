"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";

type Props = {
  /** Lista completa de data URLs a enviar ao salvar. */
  onChange: (urls: string[]) => void;
  className?: string;
};

/**
 * Área de arrastar/soltar imagens com preview local (object URL / data URL).
 * Não faz upload remoto no MVP — as URLs são enviadas ao backend como texto.
 */
export function ImageDropzone({ onChange, className }: Props) {
  const [previews, setPreviews] = useState<{ key: string; src: string; name: string }[]>([]);
  const dataUrlsRef = useRef<string[]>([]);

  const mergeNew = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      const newPreviews: { key: string; src: string; name: string }[] = [];
      const newData: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (!f.type.startsWith("image/")) continue;
        const key = `${f.name}-${Date.now()}-${i}`;
        const objectUrl = URL.createObjectURL(f);
        newPreviews.push({ key, src: objectUrl, name: f.name });
        newData.push(await fileToDataUrl(f));
      }
      setPreviews((p) => [...p, ...newPreviews]);
      dataUrlsRef.current = [...dataUrlsRef.current, ...newData];
      onChange(dataUrlsRef.current);
    },
    [onChange],
  );

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void mergeNew(e.dataTransfer.files);
        }}
      >
        <p className="font-medium text-foreground">Arraste fotos aqui</p>
        <p className="mt-1">ou clique para selecionar</p>
        <input
          type="file"
          accept="image/*"
          multiple
          className="mt-3 max-w-[200px] text-xs"
          onChange={(e) => void mergeNew(e.target.files)}
        />
      </div>
      {previews.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {previews.map((p) => (
            <div key={p.key} className="relative h-20 w-20 overflow-hidden rounded-lg border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.name} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
