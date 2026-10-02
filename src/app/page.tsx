"use client";

import React, { useState } from "react";
import { useTickets } from "@/lib/hooks/useTickets";
import { Specialty } from "@/types/specialty";
import { MedicalTicket } from "@/types/ticket";
import { HospitalSelector } from "@/components/fichas/HospitalSelector";
import { LiveQuotaBanner } from "@/components/fichas/LiveQuotaBanner";
import { SpecialtyList } from "@/components/fichas/SpecialtyList";
import { BookingModal } from "@/components/fichas/BookingModal";
import { DigitalPass } from "@/components/fichas/DigitalPass";

export default function HomePage() {
  const [hospitalId, setHospitalId] = useState<string>("hosp-clinicas-lp");
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<MedicalTicket | null>(null);

  const {
    specialties,
    currentHospital,
    bookTicket,
  } = useTickets(hospitalId);

  const totalAvailable = specialties.reduce((acc, curr) => acc + curr.availableSlots, 0);

  const handleOpenBooking = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setIsModalOpen(true);
  };

  const handleBookingSuccess = (ticket: MedicalTicket) => {
    setActiveTicket(ticket);
  };

  return (
    <div className="container" style={{ paddingTop: "24px", paddingBottom: "48px" }}>
      {/* Si el paciente acaba de sacar una ficha, mostramos su Pase Digital inmediatamente */}
      {activeTicket ? (
        <div style={{ marginTop: "16px" }}>
          <DigitalPass ticket={activeTicket} onClose={() => setActiveTicket(null)} />
        </div>
      ) : (
        <>
          {/* Selector de Hospital */}
          <HospitalSelector selectedId={hospitalId} onSelect={setHospitalId} />

          {/* Banner Principal de Alerta y Semáforo de Cupos */}
          <LiveQuotaBanner hospital={currentHospital} totalAvailable={totalAvailable} />

          {/* Listado y Filtros de Especialidades */}
          <SpecialtyList
            specialties={specialties}
            onBookSpecialty={handleOpenBooking}
          />
        </>
      )}

      {/* Modal de Reserva con Carnet */}
      <BookingModal
        isOpen={isModalOpen}
        specialty={selectedSpecialty}
        onClose={() => setIsModalOpen(false)}
        onBook={bookTicket}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
}
