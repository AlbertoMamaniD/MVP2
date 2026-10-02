import React from "react";
import styles from "./Badge.module.css";

interface BadgeProps {
  variant: "success" | "warning" | "danger" | "neutral" | "info";
  children: React.ReactNode;
  /** Se mantiene por compatibilidad: el punto se muestra siempre. */
  pulse?: boolean;
}

/** Cada estado combina color, punto y palabra para no depender del color. */
export const Badge: React.FC<BadgeProps> = ({ variant, children }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </span>
  );
};
