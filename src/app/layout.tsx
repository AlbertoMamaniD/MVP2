import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "@/styles/globals.css";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { SprintBadge } from "@/components/common/SprintBadge";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FichaYa Bolivia | Sistema de Turnos y Semáforo de Fichas Hospitalarias",
  description:
    "Solución contra las filas de madrugada en hospitales públicos de Bolivia (Tarija, La Paz, Santa Cruz, Cochabamba). Consulta cupos en tiempo real y asegura tu ficha médica con tu Carnet de Identidad.",
  keywords: [
    "Ficha hospital Bolivia",
    "Ficha medica Tarija",
    "Hospital de Clinicas La Paz",
    "Hospital San Juan de Dios Tarija",
    "Cero filas de madrugada",
    "SUS Bolivia",
  ],
  authors: [{ name: "FichaYa Bolivia Team" }],
  openGraph: {
    title: "FichaYa Bolivia | Cero Filas de Madrugada",
    description:
      "Consulta cupos en vivo y reserva tu ficha médica con tu carnet de identidad. Sin madrugar a las 4 AM en el frío.",
    type: "website",
    locale: "es_BO",
    siteName: "FichaYa Bolivia",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1d3f8a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${plusJakarta.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="main-layout" suppressHydrationWarning>
        <Header />
        <main style={{ flex: 1 }} suppressHydrationWarning>
          {children}
        </main>
        <Footer />
        <SprintBadge />
      </body>
    </html>
  );
}
