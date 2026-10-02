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
  title: "Sinfi | Reserva tu ficha médica sin filas",
  description:
    "Mira tu cupo antes de salir de casa, reserva tu ficha con tu carnet y llega a la hora que te damos. Hospitales públicos de Bolivia.",
  keywords: [
    "ficha médica Bolivia",
    "ficha hospital Tarija",
    "Hospital San Juan de Dios Tarija",
    "sin filas",
    "SUS Bolivia",
  ],
  authors: [{ name: "Sinfi" }],
  openGraph: {
    title: "Sinfi | Sin filas. Atiende a tiempo.",
    description:
      "Mira tu cupo antes de salir, reserva con tu carnet y nadie te quita tu lugar.",
    type: "website",
    locale: "es_BO",
    siteName: "Sinfi",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000080",
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
