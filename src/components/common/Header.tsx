"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SearchExistingTicketModal } from "@/components/fichas/SearchExistingTicketModal";
import { Logo } from "@/components/common/Logo";
import { SearchIcon } from "@/components/common/Icons";
import { MedicalTicket } from "@/types/ticket";
import styles from "./Header.module.css";

interface HeaderProps {
  activeTab?: "home" | "my-tickets" | "staff";
}

export const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentTab =
    activeTab ??
    (pathname?.startsWith("/personal") ? "staff" : pathname?.startsWith("/ticket") ? "my-tickets" : "home");

  const handleSelectTicket = (ticket: MedicalTicket) => {
    router.push(`/ticket/${ticket.id}`);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.bar}`}>
          <Link href="/" className={styles.brand} aria-label="Sinfi, ir al inicio">
            <Logo size={26} />
          </Link>

          <nav className={styles.nav} aria-label="Principal">
            <Link
              href="/"
              className={`${styles.navItem} ${currentTab === "home" ? styles.active : ""}`}
              aria-current={currentTab === "home" ? "page" : undefined}
            >
              Cupos
            </Link>
            <button
              type="button"
              className={`${styles.navItem} ${currentTab === "my-tickets" ? styles.active : ""}`}
              onClick={() => setIsSearchOpen(true)}
            >
              <SearchIcon size={16} />
              <span>Mi ficha</span>
            </button>
            <Link
              href="/personal"
              className={`${styles.navItem} ${currentTab === "staff" ? styles.active : ""}`}
              aria-current={currentTab === "staff" ? "page" : undefined}
            >
              Ventanilla
            </Link>
          </nav>
        </div>
      </header>

      <SearchExistingTicketModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTicket={handleSelectTicket}
      />
    </>
  );
};
