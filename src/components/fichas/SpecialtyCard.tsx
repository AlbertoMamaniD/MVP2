import React from "react";
import { Specialty } from "@/types/specialty";
import { Badge } from "@/components/common/Badge";
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
  const occupiedSlots = specialty.totalSlots - specialty.availableSlots;
  const occupancyPercentage = Math.round((occupiedSlots / specialty.totalSlots) * 100);

  return (
    <article className={`${styles.card} ${styles[specialty.status]}`}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <span className={styles.codeTag}>{specialty.code}</span>
          <h3 className={styles.specialtyName}>{specialty.name}</h3>
        </div>
        <Badge variant={statusDetails.variant} pulse={specialty.status !== "exhausted"}>
          {statusDetails.badgeText}
        </Badge>
      </div>

      <div className={styles.doctorInfo}>
        <div className={styles.infoRow}>
          <span className={styles.infoIcon}><DoctorIcon size={15} /></span>
          <span className={styles.doctorName}>{specialty.doctorName}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoIcon}><LocationIcon size={15} /></span>
          <span>{specialty.roomNumber} · Turno {specialty.shift}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoIcon}><ClockIcon size={15} /></span>
          <span>Horario de atención: {specialty.consultationStart} - {specialty.consultationEnd}</span>
        </div>
      </div>

      {/* Barra de progreso de cupos */}
      <div className={styles.quotaSection}>
        <div className={styles.quotaLabelRow}>
          <span className={styles.quotaStatusText}>{statusDetails.label}</span>
          <span className={styles.quotaFraction}>
            {specialty.availableSlots} de {specialty.totalSlots} cupos
          </span>
        </div>
        <div className={styles.progressBarBg}>
          <div
            className={`${styles.progressBarFill} ${styles[`fill_${specialty.status}`]}`}
            style={{ width: `${occupancyPercentage}%` }}
          />
        </div>
      </div>

      {/* Requisitos mínimos */}
      <div className={styles.requirementsArea}>
        <span className={styles.requirementsTitle}>Requisitos obligatorios:</span>
        <ul className={styles.requirementsList}>
          {specialty.requirements.map((req, idx) => (
            <li key={idx}>
              <span className={styles.reqCheck}><CheckIcon size={12} color="var(--primary-600)" /></span>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Primario */}
      <div className={styles.actionArea}>
        {isAvailable ? (
          <button
            className={`${styles.bookButton} ${specialty.status === "few" ? styles.fewButton : ""}`}
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
      </div>
    </article>
  );
};
