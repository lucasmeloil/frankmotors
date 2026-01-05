import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { VehicleProvider } from "@/context/VehicleContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileFixedMenu from "@/components/MobileFixedMenu";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollToTop from "@/components/ScrollToTop";
import GlobalCartDrawer from "@/components/GlobalCartDrawer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Frank Motors - Veículos Novos e Seminovos",
  description: "Loja Destaque 2024 e 2025 🏆🏅 • Vendas, compras, trocas e financiamentos de veículos",
  keywords: "carros, motos, veículos, seminovos, Frank Motors, Lagarto",
};

import { Toaster } from 'sonner';
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <Toaster position="top-right" richColors closeButton />
        <CartProvider>
          <VehicleProvider>
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
          </VehicleProvider>
        </CartProvider>
      </body>
    </html>
  );
}
