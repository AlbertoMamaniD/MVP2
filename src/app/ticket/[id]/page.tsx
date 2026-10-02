"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MedicalTicket } from "@/types/ticket";
import { TicketService } from "@/lib/services/ticketService";
import { DigitalPass } from "@/components/fichas/DigitalPass";
import Link from "next/link";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params?.id as string;
  const [ticket, setTicket] = useState<MedicalTicket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ticketId) {
      const found = TicketService.getTicketById(ticketId);
      setTicket(found);
      setLoading(false);
    }
  }, [ticketId]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "64px 16px" }}>
        <p>Cargando información del ticket médico...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "64px 16px" }}>
        <h2>Ficha Médica No Encontrada</h2>
        <p style={{ marginTop: "8px", color: "var(--text-secondary)" }}>
          El código o identificador <strong>{ticketId}</strong> no corresponde a una ficha registrada hoy.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "var(--primary-600)",
            color: "#ffffff",
            borderRadius: "8px",
            fontWeight: 700,
          }}
        >
          Volver al Semáforo de Cupos
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "24px", paddingBottom: "48px" }}>
      <DigitalPass ticket={ticket} onClose={() => router.push("/")} />
    </div>
  );
}
