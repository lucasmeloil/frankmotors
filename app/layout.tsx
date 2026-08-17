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
  title: "Baby Motos - Compra • Vende • Troca | Novas e Usadas",
  description: "Baby Motos - As melhores ofertas em motos e veículos novos e usados. Compra, vende, troca e financiamentos em Itabaiana e região.",
  keywords: "motos, carros, veículos, novas e usadas, Baby Motos, compra, vende, troca, Itabaiana, Sergipe",
  icons: {
    icon: '/assets/logo-babymotos.png',
  },
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
