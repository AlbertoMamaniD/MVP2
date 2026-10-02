"use client";

import React, { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { MedicalTicket } from "@/types/ticket";
import { TicketService } from "@/lib/services/ticketService";
import { ClockIcon, AlertTriangleIcon, ArrowRightIcon } from "@/components/common/Icons";
import styles from "./SearchExistingTicketModal.module.css";

interface SearchExistingTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTicket: (ticket: MedicalTicket) => void;
}

export const SearchExistingTicketModal: React.FC<SearchExistingTicketModalProps> = ({
  isOpen,
  onClose,
  onSelectTicket,
}) => {
  const [ciInput, setCiInput] = useState("");
  const [searchResults, setSearchResults] = useState<MedicalTicket[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ciInput.trim()) return;

    const tickets = TicketService.getTicketsByCI(ciInput.trim());
    setSearchResults(tickets);
    setSearched(true);
  };

  const handleReset = () => {
    setCiInput("");
    setSearchResults(null);
    setSearched(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buscar Mi Ficha Médica">
      <div className={styles.container}>
        <p className={styles.intro}>
          Ingresa el Carnet de Identidad con el que reservaste para recuperar tu Pase Médico Digital.
        </p>

        <form onSubmit={handleSearch} className={styles.form}>
          <div className={styles.searchRow}>
            <input
              type="text"
              className={styles.input}
              placeholder="Ej. 6849201"
              value={ciInput}
              onChange={(e) => setCiInput(e.target.value)}
              autoFocus
            />
            <button type="submit" className={styles.searchButton}>
              Buscar
            </button>
          </div>
        </form>

        {searched && searchResults && (
          <div className={styles.resultsArea}>
            {searchResults.length > 0 ? (
              <div className={styles.resultsList}>
                <span className={styles.resultsCount}>
                  Se encontraron {searchResults.length} ficha(s) activa(s):
                </span>
                {searchResults.map((t) => (
                  <div key={t.id} className={styles.ticketResultCard}>
                    <div className={styles.ticketResultMeta}>
                      <span className={styles.specName}>{t.specialtyName}</span>
                      <span className={styles.hospitalName}>{t.hospitalName}</span>
                      <span className={styles.timeHighlight}>
                        <ClockIcon size={13} /> Hora sugerida: <strong>{t.estimatedArrival}</strong> (Turno #{t.slotNumber})
                      </span>
                    </div>
                    <button
                      className={styles.viewButton}
                      onClick={() => {
                        onSelectTicket(t);
                        onClose();
                        handleReset();
                      }}
                    >
                      <span>Ver Pase Digital</span>
                      <ArrowRightIcon size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.notFound}>
                <span className={styles.notFoundIcon}>
                  <AlertTriangleIcon size={24} color="var(--text-muted)" />
                </span>
                <p>
                  No se encontraron fichas registradas para el carnet <strong>{ciInput}</strong> hoy.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
