import Link from "next/link";

// Lista prodotti (per ora mock, poi da Supabase)
const mockProducts = [
  {
    id: "1",
    slug: "corso-fotografia",
    title: "Corso di Fotografia",
    status: "published",
    locales: ["it", "en", "es"],
  },
];

export default function ProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Prodotti</h1>
          <p className="mt-1 text-gray-500">Gestisci i tuoi corsi e libri digitali</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700"
        >
          + Nuovo Prodotto
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Stato</th>
              <th className="px-4 py-3 font-medium">Lingue</th>
              <th className="px-4 py-3 font-medium">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="px-4 py-3 font-medium">{product.title}</td>
                <td className="px-4 py-3 text-gray-500">{product.slug}</td>
                <td className="px-4 py-3">
                  <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {product.locales.join(", ")}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-gray-900 underline hover:no-underline"
                  >
                    Modifica
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
