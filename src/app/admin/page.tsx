export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-500">Panoramica del tuo impero multilingua</p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Prodotti Totali</p>
          <p className="text-3xl font-bold">—</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Lingue Attive</p>
          <p className="text-3xl font-bold">—</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-3xl font-bold">€0</p>
        </div>
      </div>

      <div className="mt-8">
        <a
          href="/admin/products/new"
          className="inline-block rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
        >
          Crea Nuovo Prodotto
        </a>
      </div>
    </div>
  );
}
