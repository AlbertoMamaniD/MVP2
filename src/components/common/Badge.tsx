import React from "react";
import styles from "./Badge.module.css";

interface BadgeProps {
  variant: "success" | "warning" | "danger" | "neutral" | "info";
  children: React.ReactNode;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, pulse = false }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {pulse && <span className={styles.dot} />}
      {children}
    </span>
  );
};
