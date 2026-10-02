import React, { useId } from "react";
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
  isOpen?: boolean;
  onToggle?: () => void;
  dayLabel?: string;
}

/** Fila del semáforo de cupos (componente SemaforoCupos) que se despliega con el detalle. */
export const SpecialtyCard: React.FC<SpecialtyCardProps> = ({
  specialty,
  onBook,
  isOpen = false,
  onToggle,
  dayLabel = "Hoy",
}) => {
  const panelId = useId();
  const statusDetails = getQuotaStatusDetails(specialty.status, specialty.availableSlots);
  const isAvailable = specialty.availableSlots > 0;
  const slotsText = isAvailable
    ? `${dayLabel}, ${specialty.availableSlots} ${specialty.availableSlots === 1 ? "cupo" : "cupos"}`
    : `${dayLabel}, sin cupos. Prueba otro día`;

  const handleOtherDays = () => {
    document.getElementById("elige-dia")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <article className={`${styles.row} ${!isAvailable ? styles.off : ""} ${isOpen ? styles.open : ""}`}>
      <h3 className={styles.heading}>
      <button
        type="button"
        className={styles.summary}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className={styles.titleBlock}>
          <span className={styles.name}>{specialty.name}</span>
          <span className={styles.sub}>{slotsText}</span>
        </span>
        <Badge variant={statusDetails.variant}>{statusDetails.badgeText}</Badge>
        <svg className={styles.chevron} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      </h3>

      <div id={panelId} className={styles.panel} hidden={!isOpen}>
        <dl className={styles.details}>
          <div className={styles.detailRow}>
            <dt><DoctorIcon size={16} /> Te atiende</dt>
            <dd>{specialty.doctorName}</dd>
          </div>
          <div className={styles.detailRow}>
            <dt><LocationIcon size={16} /> Dónde</dt>
            <dd>{specialty.roomNumber}</dd>
          </div>
          <div className={styles.detailRow}>
            <dt><ClockIcon size={16} /> Horario</dt>
            <dd>{specialty.consultationStart} a {specialty.consultationEnd}, turno {specialty.shift.toLowerCase()}</dd>
          </div>
        </dl>

        <div className={styles.requirements}>
          <h4 className={styles.requirementsTitle}>Lleva contigo</h4>
          <ul className={styles.requirementsList}>
            {specialty.requirements.map((req, idx) => (
              <li key={idx}>
                <span className={styles.reqCheck} aria-hidden="true"><CheckIcon size={16} color="var(--brand)" /></span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {isAvailable ? (
          <button type="button" className="btn btn-primary" onClick={() => onBook(specialty)}>
            <TicketIcon size={20} />
            <span>Reservar mi ficha</span>
          </button>
        ) : (
          <div className={styles.exhaustedBlock}>
            <p className={styles.exhaustedNotice}>
              <AlertTriangleIcon size={18} />
              <span>Cupos agotados hoy. No hagas fila presencial.</span>
            </p>
            <button type="button" className="btn btn-secondary" onClick={handleOtherDays}>
              Ver otros días
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
