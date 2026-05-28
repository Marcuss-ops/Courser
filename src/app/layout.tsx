import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Courser — Cervellone",
  description: "Generatore automatico di Funnel e Aree Corsi multilingua",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
