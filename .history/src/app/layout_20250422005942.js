import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "JLA APP",
  description: "Aplicación reactiva para control de gastos y clientes nuevos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <link rel="manifest" href="/manifest.json" />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
