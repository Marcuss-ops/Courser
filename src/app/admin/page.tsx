"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TemplateSelector from "@/components/admin/template-selector";
import type { TemplateId } from "@/components/funnel";

// Mock data — poi verrà dal database
interface Product {
  id: string;
  slug: string;
  title: string;
  template: TemplateId;
  status: "draft" | "published" | "archived";
  locales: string[];
  createdAt: string;
}

const mockProducts: Product[] = [
  {
    id: "1",
    slug: "corso-fotografia",
    title: "Corso di Fotografia",
    template: "lumio",
    status: "published",
    locales: ["it", "en", "es"],
    createdAt: "2026-05-20",
  },
  {
    id: "2",
    slug: "libro-cucina",
    title: "Libro della Cucina",
    template: "h612",
    status: "draft",
    locales: ["it"],
    createdAt: "2026-05-22",
  },
];

const TEMPLATE_COLORS: Record<TemplateId, string> = {
  lumio: "bg-pink-100 text-pink-700",
  h612: "bg-blue-100 text-blue-700",
  horizon: "bg-orange-100 text-orange-700",
};

const TEMPLATE_NAMES: Record<TemplateId, string> = {
  lumio: "Lumio",
  h612: "Obsidian",
  horizon: "Horizon",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [showSelector, setShowSelector] = useState(false);
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const handleCreateProduct = (templateId: TemplateId, domain: string) => {
    // In futuro: chiama API per creare il prodotto
    const newProduct: Product = {
      id: String(products.length + 1),
      slug: domain,
      title: domain.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      template: templateId,
      status: "draft",
      locales: ["it"],
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProducts((prev) => [...prev, newProduct]);
    setShowSelector(false);
    router.push(`/admin/products/${newProduct.id}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-gray-500">Gestisci i tuoi prodotti multilingua</p>
        </div>
        <button
          onClick={() => setShowSelector(true)}
          className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          <span className="text-lg">+</span> Nuovo Prodotto
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Prodotti</p>
          <p className="mt-1 text-2xl font-bold">{products.length}</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Pubblicati</p>
          <p className="mt-1 text-2xl font-bold">
            {products.filter((p) => p.status === "published").length}
          </p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Lingue Attive</p>
          <p className="mt-1 text-2xl font-bold">
            {new Set(products.flatMap((p) => p.locales)).size}
          </p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="mt-1 text-2xl font-bold">€0</p>
        </div>
      </div>

      {/* Product List */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">I Tuoi Prodotti</h2>
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium">Prodotto</th>
                <th className="px-4 py-3 font-medium">Template</th>
                <th className="px-4 py-3 font-medium">Stato</th>
                <th className="px-4 py-3 font-medium">Lingue</th>
                <th className="px-4 py-3 font-medium">Creato</th>
                <th className="px-4 py-3 font-medium">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-xs text-gray-400">/{product.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${TEMPLATE_COLORS[product.template]}`}>
                      {TEMPLATE_NAMES[product.template]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      product.status === "published"
                        ? "bg-green-100 text-green-700"
                        : product.status === "draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {product.locales.join(", ").toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{product.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <a
                        href={`/admin/products/${product.id}`}
                        className="text-gray-900 underline hover:no-underline"
                      >
                        Modifica
                      </a>
                      <a
                        href={`/${product.slug}`}
                        target="_blank"
                        className="text-gray-400 underline hover:text-gray-600 hover:no-underline"
                      >
                        Preview
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Template Selector Modal */}
      {showSelector && (
        <TemplateSelector
          onSelect={handleCreateProduct}
          onClose={() => setShowSelector(false)}
        />
      )}
    </div>
  );
}
