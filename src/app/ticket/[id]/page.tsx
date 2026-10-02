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
        <p>Buscando tu ficha...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "64px 16px" }}>
        <h1 style={{ font: "var(--type-title)" }}>No encontramos esta ficha</h1>
        <p style={{ marginTop: "8px", color: "var(--muted)" }}>
          El código <strong>{ticketId}</strong> no corresponde a ninguna ficha. Revisa el código o reserva una nueva.
        </p>
        <Link
          href="/"
          className="btn btn-primary"
          style={{ marginTop: "24px", maxWidth: "320px" }}
        >
          Ver cupos de hoy
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
