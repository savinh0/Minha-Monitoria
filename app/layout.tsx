import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minha Monitoria",
  description: "Sistema transparente de ranqueamento de monitorias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-gray-50 text-gray-900 min-h-screen">
        <header className="bg-sisuBlue text-white py-4 shadow-md">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-tight">Minha Monitoria</h1>
            <nav className="text-sm">
              <span className="opacity-80">Parciais atualizadas a cada 5 horas</span>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
