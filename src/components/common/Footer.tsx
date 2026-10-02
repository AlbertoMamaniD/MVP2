import React from "react";
import styles from "./Footer.module.css";
import { Logo } from "@/components/common/Logo";
import { LockIcon, ClockIcon, ShieldCheckIcon } from "@/components/common/Icons";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brandBlock}>
          <Logo variant="inverse" size={30} />
          <p className={styles.slogan}>Sin filas. Atiende a tiempo.</p>
          <p className={styles.description}>
            Nadie debería pasar la madrugada en una fila para que lo atiendan. Con Sinfi ves tu cupo antes de salir,
            tienes una hora de llegada y nadie te quita tu lugar. La atención en el SUS es gratuita.
          </p>
        </div>

        <ul className={styles.rules}>
          <li>
            <LockIcon size={18} />
            <span>Una ficha por carnet al día.</span>
          </li>
          <li>
            <ClockIcon size={18} />
            <span>Llega 15 minutos antes con tu carnet.</span>
          </li>
          <li>
            <ShieldCheckIcon size={18} />
            <span>No compres puestos en la fila: tu ficha es gratis y es tuya.</span>
          </li>
        </ul>
      </div>
      <div className={styles.bottom}>
        <p className="container">© {new Date().getFullYear()} Sinfi, Bolivia</p>
      </div>
    </footer>
  );
};
