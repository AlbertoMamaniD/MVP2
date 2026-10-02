import React from "react";
import styles from "./Footer.module.css";
import { LockIcon, ClockIcon, ShieldCheckIcon } from "@/components/common/Icons";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.infoSection}>
          <div className={styles.badgeRow}>
            <span className={styles.tag}>Sistema Único de Salud (SUS)</span>
            <span className={styles.tag}>Bolivia</span>
          </div>
          <p className={styles.description}>
            Iniciativa cívica digital para eliminar las filas de madrugada y la reventa de fichas en hospitales públicos bolivianos. La atención en el SUS es 100% gratuita.
          </p>
        </div>

        <div className={styles.rulesSummary}>
          <div className={styles.ruleItem}>
            <span className={styles.ruleIcon}><LockIcon size={16} /></span>
            <span>1 ficha por Cédula de Identidad al día.</span>
          </div>
          <div className={styles.ruleItem}>
            <span className={styles.ruleIcon}><ClockIcon size={16} /></span>
            <span>Preséntate 15 minutos antes de tu hora con tu Carnet.</span>
          </div>
          <div className={styles.ruleItem}>
            <span className={styles.ruleIcon}><ShieldCheckIcon size={16} /></span>
            <span>Evita la compra de puestos callejeros y colados.</span>
          </div>
        </div>
      </div>
      <div className={styles.subFooter}>
        <p>
          <span>© {new Date().getFullYear()} FichaYa</span>
          <span>Transparencia y dignidad en la salud pública</span>
        </p>
      </div>
    </footer>
  );
};
