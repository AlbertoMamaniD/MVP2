"use client";

import React from "react";
import Link from "next/link";
import { formatCurrentDate } from "@/lib/utils/formatters";
import styles from "./Header.module.css";

interface HeaderProps {
  activeTab?: "home" | "my-tickets" | "staff";
}

export const Header: React.FC<HeaderProps> = ({ activeTab = "home" }) => {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link href="/" className={styles.brand}>
          <div className={styles.logoIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>FichaYa <span className={styles.boliviaTag}>BOLIVIA</span></span>
            <span className={styles.brandSubtitle}>Cero Filas de Madrugada · SUS & Salud Pública</span>
          </div>
        </Link>

        <div className={styles.rightNav}>
          <div className={styles.liveClock}>
            <span className={styles.liveDot} />
            <span className={styles.dateText}>{formatCurrentDate()}</span>
          </div>

          <nav className={styles.navLinks}>
            <Link
              href="/"
              className={`${styles.navLink} ${activeTab === "home" ? styles.active : ""}`}
            >
              Semáforo en Vivo
            </Link>
            <Link
              href="/personal"
              className={`${styles.navLink} ${activeTab === "staff" ? styles.active : ""}`}
            >
              Control Ventanilla
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
