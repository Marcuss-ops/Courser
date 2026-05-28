export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-50 p-4">
        <h2 className="mb-6 text-lg font-bold">Cervellone</h2>
        <nav className="flex flex-col gap-2">
          <a href="/admin" className="rounded-md px-3 py-2 text-sm hover:bg-gray-200">
            Dashboard
          </a>
          <a href="/admin/products" className="rounded-md px-3 py-2 text-sm hover:bg-gray-200">
            Prodotti
          </a>
          <a href="/admin/products/new" className="rounded-md px-3 py-2 text-sm hover:bg-gray-200">
            + Nuovo Prodotto
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
