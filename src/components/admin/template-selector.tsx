"use client";

import { useState } from "react";
import { TEMPLATES, type TemplateId } from "@/components/funnel";

interface TemplateSelectorProps {
  onSelect: (templateId: TemplateId, domain: string) => void;
  onClose: () => void;
}

export default function TemplateSelector({ onSelect, onClose }: TemplateSelectorProps) {
  const [selected, setSelected] = useState<TemplateId | null>(null);
  const [domain, setDomain] = useState("");

  const handleConfirm = () => {
    if (selected && domain.trim()) {
      onSelect(selected, domain.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Crea Nuovo Prodotto</h2>
            <p className="mt-1 text-sm text-gray-500">
              Scegli un template white-label e collega il tuo dominio
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Template Grid */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {(Object.entries(TEMPLATES) as [TemplateId, typeof TEMPLATES[TemplateId]][]).map(([id, tpl]) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`group relative rounded-xl border-2 p-4 text-left transition ${
                selected === id
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              {selected === id && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[10px] text-white">
                  ✓
                </span>
              )}
              {/* Mini preview */}
              <div className={`mb-3 flex h-24 items-center justify-center rounded-lg ${tpl.preview}`}>
                <div className="text-2xl">
                  {id === "lumio" ? "☀️" : id === "h612" ? "🌑" : "🌅"}
                </div>
              </div>
              <h3 className="font-semibold text-sm">{tpl.name}</h3>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                {tpl.description}
              </p>
            </button>
          ))}
        </div>

        {/* Domain Input */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Dominio / Slug del prodotto
          </label>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-gray-400">https://</span>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="corso-fotografia"
              className="flex-1 rounded-lg border px-3 py-2 text-sm"
            />
            <span className="text-sm text-gray-400">.tuodominio.com</span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Oppure usa lo slug come sottocartella: tuodominio.com/<strong>{domain || "slug"}</strong>
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Annulla
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected || !domain.trim()}
            className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-40"
          >
            Crea Prodotto
          </button>
        </div>
      </div>
    </div>
  );
}
