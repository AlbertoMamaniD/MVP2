import React from "react";
import styles from "./LiveQuotaBanner.module.css";
import { Hospital } from "@/types/hospital";
import { AudioPlayerButton } from "@/components/common/AudioPlayerButton";
import { LocationIcon, ShieldCheckIcon } from "@/components/common/Icons";

interface LiveQuotaBannerProps {
  hospital: Hospital;
  totalAvailable: number;
  selectedDayLabel?: string;
}

export const LiveQuotaBanner: React.FC<LiveQuotaBannerProps> = ({
  hospital,
  totalAvailable,
  selectedDayLabel = "Hoy",
}) => {
  const audioExplanation = `Estimado paciente del ${hospital.name}: en Tarija y Bolivia no madrugue a las cuatro de la mañana en el frío. Con FichaYa, consulte los cupos libres en tiempo real, elija su especialidad y reserve con su carnet de identidad. Llegue quince minutos antes de su turno asignado directamente al consultorio.`;

  return (
    <section className={styles.banner}>
      <div className={styles.headerRow}>
        <div className={styles.hospitalMeta}>
          <div className={styles.badgeRow}>
            <span className={styles.hospitalBadge}>{hospital.level} · {hospital.city}</span>
            <span className={styles.systemPill}>{hospital.system} GRATUITO</span>
          </div>
          <h1 className={styles.hospitalName}>{hospital.name}</h1>
          <p className={styles.hospitalAddress}>
            <LocationIcon size={14} /> {hospital.address} · Atención: <strong>{hospital.openingHours}</strong>
          </p>
        </div>

        <div className={styles.quotaCounter}>
          <span className={styles.counterLabel}>Cupos Libres {selectedDayLabel}</span>
          <div className={styles.counterNumber}>
            <span className={styles.pulseDot} />
            <span>{totalAvailable}</span>
          </div>
          <span className={styles.counterSub}>En tiempo real · Cero filas</span>
        </div>
      </div>

      <div className={styles.alertNotice}>
        <div className={styles.alertIcon}>
          <ShieldCheckIcon size={24} color="#fef08a" />
        </div>
        <div className={styles.alertContent}>
          <div className={styles.alertTitleRow}>
            <strong>¡Tu derecho a la salud sin filas de madrugada ni frío!</strong>
            <AudioPlayerButton
              variant="banner"
              label="Escuchar en Voz Alta"
              messageToRead={audioExplanation}
            />
          </div>
          <p>
            Elige tu especialidad y reserva con tu Carnet de Identidad. El sistema te asignará una <strong>hora exacta sugerida de llegada</strong>. Solo debes presentarte 15 minutos antes directamente en consultorio.
          </p>
        </div>
      </div>
    </section>
  );
};
