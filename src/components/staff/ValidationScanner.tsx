"use client";

import React, { useState } from "react";
import { MedicalTicket } from "@/types/ticket";
import { Badge } from "@/components/common/Badge";
import { RefreshIcon, CheckIcon, AlertTriangleIcon } from "@/components/common/Icons";
import styles from "./ValidationScanner.module.css";

// Convierte "08:45 AM" en minutos desde medianoche para ordenar por hora de llegada
const arrivalToMinutes = (time: string): number => {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return Number.MAX_SAFE_INTEGER;
  const [, h, m, period] = match;
  const hours = (Number(h) % 12) + (period.toUpperCase() === "PM" ? 12 : 0);
  return hours * 60 + Number(m);
};

// "2026-10-06" -> "Mar 6 oct"
const formatDay = (iso: string): string => {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const text = d.toLocaleDateString("es-BO", { weekday: "short", day: "numeric", month: "short" }).replace(/[.,]/g, "");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

interface ValidationScannerProps {
  tickets: MedicalTicket[];
  onCheckIn: (ticketId: string) => { success: boolean; message: string };
  onResetData: () => void;
}

export const ValidationScanner: React.FC<ValidationScannerProps> = ({
  tickets,
  onCheckIn,
  onResetData,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleVerify = (ticketId: string) => {
    const res = onCheckIn(ticketId);
    if (res.success) {
      setFeedback({ type: "success", text: res.message });
    } else {
      setFeedback({ type: "error", text: res.message });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const filteredTickets = tickets
    .filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        t.ci.toLowerCase().includes(q) ||
        t.patientName.toLowerCase().includes(q) ||
        t.tokenCode.toLowerCase().includes(q) ||
        t.specialtyName.toLowerCase().includes(q)
      );
    })
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        arrivalToMinutes(a.estimatedArrival) - arrivalToMinutes(b.estimatedArrival)
    );

  return (
    <div className={styles.wrapper}>
      {/* Cabecera del Módulo */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Ventanilla</h1>
          <p className={styles.subtitle}>
            Pide el carnet al paciente, búscalo aquí y marca su ingreso para que pase a la sala de espera.
          </p>
        </div>

        <button className={styles.resetButton} onClick={onResetData} title="Reiniciar datos de prueba">
          <RefreshIcon size={16} />
          <span>Reiniciar Simulación</span>
        </button>
      </div>

      {feedback && (
        <div className={`${styles.feedback} ${styles[feedback.type]}`} role="status">
          {feedback.type === "success" ? <CheckIcon size={18} /> : <AlertTriangleIcon size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Buscador Rápido por Carnet o Código */}
      <div className={styles.searchSection}>
        <label htmlFor="staff-search" className={styles.searchLabel}>Carnet o código de la ficha</label>
        <div className={styles.searchRow}>
          <input
            id="staff-search"
            type="text"
            autoComplete="off"
            className={styles.searchInput}
            placeholder="Ej. 6849201 o BOL-8912"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className={styles.clearBtn} onClick={() => setSearchQuery("")}>
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Lista de Fichas Emitidas */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2>Fichas reservadas ({filteredTickets.length})</h2>
          <span className={styles.hint}>Ordenadas por día y hora de llegada</span>
        </div>

        {filteredTickets.length > 0 ? (
          <div className={styles.ticketList}>
            {filteredTickets.map((t) => (
              <div key={t.id} className={`${styles.ticketRow} ${t.status === "checked_in" ? styles.checkedRow : ""}`}>
                <div className={styles.colSlot}>
                  <span className={styles.slotTag}>Turno {t.slotNumber}</span>
                  <span className={styles.timeTag}>{formatDay(t.date)}, {t.estimatedArrival}</span>
                </div>

                <div className={styles.colPatient}>
                  <div className={styles.patientName}>{t.patientName}</div>
                  <div className={styles.patientMeta}>
                    <span>Carnet <strong>{t.ci}</strong></span>
                    <span>Código <code>{t.tokenCode}</code></span>
                  </div>
                </div>

                <div className={styles.colSpecialty}>
                  <span className={styles.specName}>{t.specialtyName}</span>
                  <span className={styles.doctorName}>{t.doctorName}</span>
                </div>

                <div className={styles.colStatus}>
                  <Badge variant={t.status === "checked_in" ? "info" : "neutral"}>
                    {t.status === "checked_in" ? "En sala" : "Por llegar"}
                  </Badge>
                </div>

                <div className={styles.colAction}>
                  {t.status !== "checked_in" ? (
                    <button className={`btn btn-primary ${styles.checkInBtn}`} onClick={() => handleVerify(t.id)}>
                      <CheckIcon size={18} />
                      <span>Marcar Ingreso</span>
                    </button>
                  ) : (
                    <span className={styles.checkedInLabel}>
                      <CheckIcon size={16} /> En Espera
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noTickets}>
            <p>No hay fichas con ese carnet o código. Revisa el número o limpia la búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};
