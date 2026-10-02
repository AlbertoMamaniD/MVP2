"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrentDate } from "@/lib/utils/formatters";
import { SearchExistingTicketModal } from "@/components/fichas/SearchExistingTicketModal";
import { SearchIcon } from "@/components/common/Icons";
import { MedicalTicket } from "@/types/ticket";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Header.module.css";

interface HeaderProps {
  activeTab?: "home" | "my-tickets" | "staff";
}

export const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentTab = activeTab ?? (pathname?.startsWith("/personal") ? "staff" : "home");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectTicket = (ticket: MedicalTicket) => {
    router.push(`/ticket/${ticket.id}`);
  };

  return (
    <>
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
              <div className={styles.titleRow}>
                <span className={styles.brandTitle}>FichaYa</span>
                <span className={styles.boliviaBadge}>
                  <span className={styles.flagStripes}>
                    <span className={styles.stripeRed} />
                    <span className={styles.stripeYellow} />
                    <span className={styles.stripeGreen} />
                  </span>
                  Bolivia
                </span>
              </div>
              <span className={styles.brandSubtitle}>Fichas médicas sin filas de madrugada</span>
            </div>
          </Link>

          <div className={styles.rightNav}>
            {mounted && (
              <div className={styles.liveClock}>
                <span className={styles.liveDot} aria-hidden="true" />
                <span className={styles.dateText}>{formatCurrentDate()}</span>
              </div>
            )}

            <button
              type="button"
              className={styles.searchPill}
              onClick={() => setIsSearchOpen(true)}
              title="Buscar ficha guardada con Carnet de Identidad"
              aria-label="Ver Mi Ficha"
            >
              <SearchIcon size={14} />
              <span>Ver Mi Ficha</span>
            </button>

            <nav className={styles.navLinks} aria-label="Secciones">
              <Link
                href="/"
                className={`${styles.navLink} ${currentTab === "home" ? styles.active : ""}`}
              >
                Semáforo
              </Link>
              <Link
                href="/personal"
                className={`${styles.navLink} ${currentTab === "staff" ? styles.active : ""}`}
              >
                Ventanilla
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Modal para recuperar ficha por CI */}
      <SearchExistingTicketModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTicket={handleSelectTicket}
      />
    </>
  );
};
