"use client";

import { useParams } from "next/navigation";

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Modifica Prodotto #{productId}</h1>
      <p className="mt-1 text-gray-500">
        Modifica i testi, traduzioni e lezioni del prodotto
      </p>

      {/* Placeholder — verrà popolato dal database */}
      <div className="mt-8 rounded-lg border border-dashed p-8 text-center text-gray-400">
        Caricamento prodotto dal database in arrivo...
      </div>
    </div>
  );
}
