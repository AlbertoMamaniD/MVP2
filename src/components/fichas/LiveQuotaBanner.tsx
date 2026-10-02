import React from "react";
import styles from "./LiveQuotaBanner.module.css";
import { Hospital } from "@/types/hospital";
import { AudioPlayerButton } from "@/components/common/AudioPlayerButton";
import { calculateQuotaStatus, getQuotaStatusDetails } from "@/lib/services/quotaService";

interface LiveQuotaBannerProps {
  hospital: Hospital;
  totalAvailable: number;
  selectedDayLabel?: string;
}

/** Introducción de la web: qué es Sinfi y, a la derecha, cómo se ve la ficha que obtienes. */
export const LiveQuotaBanner: React.FC<LiveQuotaBannerProps> = ({
  hospital,
  totalAvailable,
  selectedDayLabel = "Hoy",
}) => {
  const audioExplanation = `Hola. Con Sinfi sacas tu ficha médica sin madrugar. En el ${hospital.name} miras los cupos libres antes de salir de casa, eliges tu especialidad y reservas con tu carnet de identidad. Te damos una hora de llegada: preséntate quince minutos antes, directo al consultorio.`;

  const status = calculateQuotaStatus(totalAvailable);
  const statusDetails = getQuotaStatusDetails(status, totalAvailable);
  const dayText = selectedDayLabel.toLowerCase();
  const dayPhrase = dayText === "hoy" || dayText === "mañana" ? dayText : `el ${dayText}`;

  const goToSpecialties = () => {
    document.getElementById("elige-especialidad")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <h1 id="hero-title" className={styles.title}>Tu ficha médica, sin madrugar.</h1>
        <p className={styles.promise}>
          Mira los cupos antes de salir de casa, reserva con tu carnet y llega a la hora que te damos.
          Nadie te quita tu lugar.
        </p>

        <div className={styles.ctaRow}>
          <button type="button" className={styles.cta} onClick={goToSpecialties}>
            Ver cupos de hoy
          </button>
          <AudioPlayerButton
            variant="banner"
            label="Escuchar en Voz Alta"
            messageToRead={audioExplanation}
          />
        </div>

        <p className={`${styles.live} ${styles[`live_${status}`]}`} aria-live="polite">
          <span className={styles.liveDot} aria-hidden="true" />
          <span>
            <strong>{totalAvailable}</strong> {totalAvailable === 1 ? "cupo libre" : "cupos libres"} {dayPhrase}
            <span className="visually-hidden">, {statusDetails.badgeText}</span>
          </span>
        </p>
      </div>

      {/* Ficha de ejemplo: muestra el resultado antes de empezar */}
      <figure className={styles.sample} aria-label="Ejemplo de ficha digital">
        <div className={styles.ticket}>
          <div className={styles.ticketHead}>
            <div>
              <span className={styles.ticketEsp}>Pediatría</span>
              <span className={styles.ticketHosp}>{hospital.city}</span>
            </div>
            <div className={styles.ticketTurno}>
              <span>Turno</span>
              <strong>14</strong>
            </div>
          </div>

          <div className={styles.ticketBody}>
            <span className={styles.ticketKey}>Llega a las</span>
            <span className={styles.ticketTime}>08:45</span>
          </div>

          <div className={styles.ticketCut} aria-hidden="true" />

          <div className={styles.ticketFoot}>
            <svg className={styles.ticketQr} viewBox="0 0 9 9" aria-hidden="true" shapeRendering="crispEdges">
              <rect width="9" height="9" fill="var(--surface)" />
              <g fill="var(--brand)">
                <path d="M0 0h3v3H0zM6 0h3v3H6zM0 6h3v3H0z" />
                <path d="M4 0h1v1H4zM4 2h1v2H4zM5 4h2v1H5zM3 4h1v1H3zM6 6h1v1H6zM8 6h1v1H8zM5 7h1v2H5zM7 8h2v1H7zM4 5h1v1H4z" />
              </g>
              <g fill="var(--surface)">
                <path d="M1 1h1v1H1zM7 1h1v1H7zM1 7h1v1H1z" />
              </g>
            </svg>
            <span className={styles.ticketNote}>Preséntate 15 minutos antes.</span>
          </div>
        </div>
        <figcaption className={styles.caption}>Así se ve tu ficha</figcaption>
      </figure>
    </section>
  );
};
