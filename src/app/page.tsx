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
import styles from "./page.module.css";

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
    window.scrollTo({ top: 0 });
  };

  return (
    <div className={`container ${styles.page}`} suppressHydrationWarning>
      {/* Si el paciente acaba de sacar una ficha, mostramos su ficha digital */}
      {activeTicket ? (
        <DigitalPass ticket={activeTicket} onClose={() => setActiveTicket(null)} />
      ) : (
        <>
          <LiveQuotaBanner
            hospital={currentHospital}
            totalAvailable={totalAvailable}
            selectedDayLabel={selectedDay?.label || "Hoy"}
          />

          <section className={styles.step} aria-labelledby="paso-hospital">
            <h2 id="paso-hospital" className={styles.stepTitle}>
              <span className={styles.stepNumber} aria-hidden="true">1</span>
              Elige tu hospital
            </h2>
            <HospitalSelector selectedId={hospitalId} onSelect={setHospitalId} />
          </section>

          {days.length > 0 && (
            <section className={styles.step} id="elige-dia" aria-labelledby="paso-dia">
              <h2 id="paso-dia" className={styles.stepTitle}>
                <span className={styles.stepNumber} aria-hidden="true">2</span>
                Elige el día
              </h2>
              <DaySelector
                days={days}
                selectedDayId={selectedDayId}
                onSelectDay={setSelectedDayId}
              />
            </section>
          )}

          <section className={styles.step} id="elige-especialidad" aria-labelledby="paso-especialidad">
            <h2 id="paso-especialidad" className={styles.stepTitle}>
              <span className={styles.stepNumber} aria-hidden="true">3</span>
              Elige tu especialidad
            </h2>
            <SpecialtyList
              specialties={specialties}
              onBookSpecialty={handleOpenBooking}
              dayLabel={selectedDay?.label || "Hoy"}
            />
          </section>
        </>
      )}

      <BookingModal
        isOpen={isModalOpen}
        specialty={selectedSpecialty}
        onClose={() => setIsModalOpen(false)}
        onBook={bookTicket}
        onSuccess={handleBookingSuccess}
        selectedDayLabel={selectedDay?.label}
        selectedDayFormatted={selectedDay?.dateFormatted}
        selectedDayId={selectedDay?.id}
      />
    </div>
  );
}
