"use client";

import React from "react";
import { useTickets } from "@/lib/hooks/useTickets";
import { ValidationScanner } from "@/components/staff/ValidationScanner";

export default function PersonalSaludPage() {
  const { tickets, checkIn, resetAll } = useTickets();

  return (
    <div className="container" style={{ paddingTop: "24px", paddingBottom: "48px" }}>
      <ValidationScanner
        tickets={tickets}
        onCheckIn={checkIn}
        onResetData={resetAll}
      />
    </div>
  );
}
