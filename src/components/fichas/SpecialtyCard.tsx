import React from "react";
import { Specialty } from "@/types/specialty";
import { getQuotaStatusDetails } from "@/lib/services/quotaService";
import {
  DoctorIcon,
  LocationIcon,
  ClockIcon,
  CheckIcon,
  TicketIcon,
  AlertTriangleIcon,
} from "@/components/common/Icons";
import styles from "./SpecialtyCard.module.css";

interface SpecialtyCardProps {
  specialty: Specialty;
  onBook: (specialty: Specialty) => void;
}

export const SpecialtyCard: React.FC<SpecialtyCardProps> = ({ specialty, onBook }) => {
  const statusDetails = getQuotaStatusDetails(specialty.status, specialty.availableSlots);
  const isAvailable = specialty.availableSlots > 0;

  return (
    <article className={`${styles.card} ${styles[specialty.status]}`}>
      {/* 1. Especialidad y médico */}
      <header className={styles.header}>
        <h3 className={styles.specialtyName}>{specialty.name}</h3>
        <p className={styles.doctor}>
          <DoctorIcon size={15} />
          <span>{specialty.doctorName}</span>
        </p>
      </header>

      {/* 2. Contador de cupos: una celda por ficha, las libres primero */}
      <section className={styles.quota} aria-label={statusDetails.label}>
        <div className={styles.quotaTop}>
          <span className={styles.statusLabel}>
            <span className={styles.statusDot} aria-hidden="true" />
            {statusDetails.badgeText}
          </span>
          <span className={styles.quotaCount}>
            <strong>{specialty.availableSlots}</strong>
            <span>de {specialty.totalSlots} cupos</span>
          </span>
        </div>
        <div className={styles.slotTrack} aria-hidden="true">
          {Array.from({ length: specialty.totalSlots }, (_, i) => (
            <span
              key={i}
              className={`${styles.slot} ${i < specialty.availableSlots ? styles.slotFree : ""}`}
            />
          ))}
        </div>
      </section>

      {/* 3. Consultorio y horario */}
      <dl className={styles.details}>
        <div className={styles.detailRow}>
          <dt>
            <LocationIcon size={14} />
            Consultorio
          </dt>
          <dd>{specialty.roomNumber}</dd>
        </div>
        <div className={styles.detailRow}>
          <dt>
            <ClockIcon size={14} />
            Horario
          </dt>
          <dd>
            {specialty.consultationStart} a {specialty.consultationEnd}, turno {specialty.shift.toLowerCase()}
          </dd>
        </div>
      </dl>

      {/* 4. Requisitos */}
      <section className={styles.requirements}>
        <h4 className={styles.requirementsTitle}>Requisitos obligatorios</h4>
        <ul className={styles.requirementsList}>
          {specialty.requirements.map((req, idx) => (
            <li key={idx}>
              <span className={styles.reqCheck} aria-hidden="true"><CheckIcon size={12} color="var(--primary-600)" /></span>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Acción */}
      <footer className={styles.actionArea}>
        {isAvailable ? (
          <button
            className={styles.bookButton}
            onClick={() => onBook(specialty)}
          >
            <TicketIcon size={17} />
            <span>{specialty.status === "few" ? "Asegurar Último Cupo" : "Sacar Ficha Médica"}</span>
          </button>
        ) : (
          <div className={styles.exhaustedNotice}>
            <AlertTriangleIcon size={16} />
            <span>Cupos agotados hoy. No hagas fila presencial.</span>
          </div>
        )}
      </footer>
    </article>
  );
};
