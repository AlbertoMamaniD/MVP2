import React from "react";
import styles from "./Footer.module.css";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.infoSection}>
          <div className={styles.badgeRow}>
            <span className={styles.tag}>SUS · Sistema Único de Salud</span>
            <span className={styles.tag}>Bolivia</span>
          </div>
          <p className={styles.description}>
            Iniciativa cívica digital para eliminar las filas de madrugada y la reventa de fichas en hospitales públicos bolivianos. La atención en el SUS es 100% gratuita.
          </p>
        </div>

        <div className={styles.rulesSummary}>
          <div className={styles.ruleItem}>
            <span className={styles.ruleIcon}>🔒</span>
            <span>1 ficha por Cédula de Identidad al día.</span>
          </div>
          <div className={styles.ruleItem}>
            <span className={styles.ruleIcon}>⏰</span>
            <span>Preséntate 15 minutos antes de tu hora con tu Carnet.</span>
          </div>
          <div className={styles.ruleItem}>
            <span className={styles.ruleIcon}>🚫</span>
            <span>Evita la compra de puestos callejeros.</span>
          </div>
        </div>
      </div>
      <div className={styles.subFooter}>
        <p>© {new Date().getFullYear()} FichaYa · Transparencia y Dignidad en la Salud Pública</p>
      </div>
    </footer>
  );
};
