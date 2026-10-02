import type { Metadata } from "next";
import "@/styles/globals.css";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "FichaYa Bolivia · Semáforo de Fichas y Turnos Médicos Sin Filas",
  description:
    "Consulta en tiempo real la disponibilidad de cupos en hospitales públicos de Bolivia y reserva tu ficha médica con tu carnet de identidad. ¡No más filas a las 4 AM en el frío!",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="main-layout">
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
