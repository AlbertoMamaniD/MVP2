"use client";

import React, { useState } from "react";
import { useTickets } from "@/lib/hooks/useTickets";
import { Specialty } from "@/types/specialty";
import { MedicalTicket } from "@/types/ticket";
import { HospitalSelector } from "@/components/fichas/HospitalSelector";
import { LiveQuotaBanner } from "@/components/fichas/LiveQuotaBanner";
import { DaySelector } from "@/components/fichas/DaySelector";
import { SpecialtyList } from "@/components/fichas/SpecialtyList";
import { BookingModal } from "@/components/fichas/BookingModal";
import { DigitalPass } from "@/components/fichas/DigitalPass";
import { getAvailableDays, AvailableDay } from "@/lib/utils/formatters";

const INITIAL_DAYS: AvailableDay[] = getAvailableDays();

export default function HomePage() {
  const [hospitalId, setHospitalId] = useState<string>("hrsjdd-tarija");
  const [days] = useState<AvailableDay[]>(INITIAL_DAYS);
  const [selectedDayId, setSelectedDayId] = useState<string>(INITIAL_DAYS[0]?.id || "");
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<MedicalTicket | null>(null);

  const {
    specialties,
    currentHospital,
    bookTicket,
  } = useTickets(hospitalId);

  const selectedDay = days.find((d) => d.id === selectedDayId) || days[0];
  const totalAvailable = specialties.reduce((acc, curr) => acc + curr.availableSlots, 0);

  const handleOpenBooking = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setIsModalOpen(true);
  };

  const handleBookingSuccess = (ticket: MedicalTicket) => {
    setActiveTicket(ticket);
  };

  return (
    <div
      className="container"
      style={{ paddingTop: "20px", paddingBottom: "56px" }}
      suppressHydrationWarning
    >
      {/* Si el paciente acaba de sacar una ficha, mostramos su Pase Digital inmediatamente */}
      {activeTicket ? (
        <div style={{ marginTop: "12px" }}>
          <DigitalPass ticket={activeTicket} onClose={() => setActiveTicket(null)} />
        </div>
      ) : (
        <>
          {/* Selector de Hospital de Referencia */}
          <HospitalSelector selectedId={hospitalId} onSelect={setHospitalId} />

          {/* Banner Principal de Certeza y Semáforo de Cupos */}
          <LiveQuotaBanner
            hospital={currentHospital}
            totalAvailable={totalAvailable}
            selectedDayLabel={selectedDay?.label || "Hoy"}
          />

          {/* Selector de Días Disponibles (Must Have del Documento) */}
          {days.length > 0 && (
            <DaySelector
              days={days}
              selectedDayId={selectedDayId}
              onSelectDay={setSelectedDayId}
            />
          )}

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
        selectedDayLabel={selectedDay?.label}
        selectedDayFormatted={selectedDay?.dateFormatted}
      />
    </div>
  );
}
