import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { VehicleProvider } from "@/context/VehicleContext";
import { Toaster } from 'sonner';
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CABO CAR Multimarcas - Venda de Carros Novos e Seminovos",
  description: "CABO CAR Multimarcas - Há mais de 20 anos realizando sonhos. Loja física em Salgado-SE. Compra, venda, troca e financiamento de carros com procedência e garantia.",
  keywords: "CABO CAR, carros, veículos, seminovos, multimarcas, Salgado, Sergipe, compra, venda, troca, financiamento",
  icons: {
    icon: '/assets/logo-cabocar.png',
    apple: '/assets/logo-cabocar.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Toaster position="top-right" richColors closeButton />
        <AuthProvider>
          <CartProvider>
            <VehicleProvider>
              <ClientLayoutWrapper>
                {children}
              </ClientLayoutWrapper>
            </VehicleProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
