import React from "react";
import styles from "./Logo.module.css";

interface LogoProps {
  /** "main": azul sobre claro. "inverse": claro sobre azul. */
  variant?: "main" | "inverse";
  /** Alto de la palabra en px. El ícono escala en proporción. */
  size?: number;
  /** Muestra solo el ícono de la ficha, sin la palabra. */
  iconOnly?: boolean;
}

/**
 * Logo de Sinfi: una ficha con muesca y un check adentro, junto a la palabra
 * "sinfi" en minúsculas. Reconstruido en SVG desde assets/Logos/sinfi-logo.jpg.
 */
export const Logo: React.FC<LogoProps> = ({ variant = "main", size = 28, iconOnly = false }) => {
  const iconWidth = Math.round(size * 1.1);
  const iconHeight = Math.round(iconWidth * (28 / 36));

  return (
    <span
      className={`${styles.logo} ${styles[variant]}`}
      style={{ "--logo-size": `${size}px` } as React.CSSProperties}
      role="img"
      aria-label="Sinfi"
    >
      <svg width={iconWidth} height={iconHeight} viewBox="0 0 36 28" aria-hidden="true">
        <path
          className={styles.ticket}
          d="M6 0H30a6 6 0 0 1 6 6V10a4 4 0 0 0 0 8V22a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V18a4 4 0 0 0 0-8V6a6 6 0 0 1 6-6Z"
        />
        <path className={styles.check} d="M11 14.5l5 5 9-10.5" />
      </svg>
      {!iconOnly && <span className={styles.word} aria-hidden="true">sinfi</span>}
    </span>
  );
};
