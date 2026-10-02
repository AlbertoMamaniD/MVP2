import React from "react";
import styles from "./LiveQuotaBanner.module.css";
import { Hospital } from "@/types/hospital";

interface LiveQuotaBannerProps {
  hospital: Hospital;
  totalAvailable: number;
}

export const LiveQuotaBanner: React.FC<LiveQuotaBannerProps> = ({ hospital, totalAvailable }) => {
  return (
    <section className={styles.banner}>
      <div className={styles.headerRow}>
        <div className={styles.hospitalMeta}>
          <span className={styles.hospitalBadge}>{hospital.level} · {hospital.city}</span>
          <h1 className={styles.hospitalName}>{hospital.name}</h1>
          <p className={styles.hospitalAddress}>📍 {hospital.address} · Atención de {hospital.openingHours}</p>
        </div>

        <div className={styles.quotaCounter}>
          <span className={styles.counterLabel}>Cupos Libres Hoy</span>
          <div className={styles.counterNumber}>
            <span className={styles.pulseDot} />
            <span>{totalAvailable}</span>
          </div>
          <span className={styles.counterSub}>En tiempo real</span>
        </div>
      </div>

      <div className={styles.alertNotice}>
        <div className={styles.alertIcon}>💡</div>
        <div className={styles.alertContent}>
          <strong>¡No madrugues a las 4:00 AM en el frío ni compres puestos!</strong>
          <p>
            Revisa abajo la especialidad que buscas. Si hay cupos disponibles, resérvala con tu Carnet de Identidad. Llegarás directamente a tu hora programada sin hacer fila en la calle.
          </p>
        </div>
      </div>
    </section>
  );
};
