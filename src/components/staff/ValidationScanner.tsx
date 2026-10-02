"use client";

import React, { useState } from "react";
import { MedicalTicket } from "@/types/ticket";
import { Badge } from "@/components/common/Badge";
import styles from "./ValidationScanner.module.css";

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

  const filteredTickets = tickets.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      t.ci.toLowerCase().includes(q) ||
      t.patientName.toLowerCase().includes(q) ||
      t.tokenCode.toLowerCase().includes(q) ||
      t.specialtyName.toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.wrapper}>
      {/* Cabecera del Módulo */}
      <div className={styles.header}>
        <div>
          <span className={styles.badge}>MÓDULO DE ADMISIÓN Y VENTANILLA</span>
          <h2 className={styles.title}>Control de Asistencia y Validación de Fichas</h2>
          <p className={styles.subtitle}>
            Verifica el Carnet de Identidad del paciente al llegar para derivarlo al consultorio.
          </p>
        </div>

        <button className={styles.resetButton} onClick={onResetData} title="Reiniciar datos de prueba">
          🔄 Reiniciar Simulación
        </button>
      </div>

      {feedback && (
        <div className={`${styles.feedback} ${styles[feedback.type]}`}>
          {feedback.type === "success" ? "✅" : "⚠️"} {feedback.text}
        </div>
      )}

      {/* Buscador Rápido por Carnet o Código */}
      <div className={styles.searchSection}>
        <label className={styles.searchLabel}>Digita el C.I. o Código del Ticket:</label>
        <div className={styles.searchRow}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Ej. 6849201 o BOL-8912..."
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
          <h3>Fichas Emitidas para Hoy ({filteredTickets.length})</h3>
          <span className={styles.hint}>Ordenadas por hora estimada</span>
        </div>

        {filteredTickets.length > 0 ? (
          <div className={styles.ticketList}>
            {filteredTickets.map((t) => (
              <div key={t.id} className={`${styles.ticketRow} ${t.status === "checked_in" ? styles.checkedRow : ""}`}>
                <div className={styles.colSlot}>
                  <span className={styles.slotTag}>Turno #{t.slotNumber}</span>
                  <span className={styles.timeTag}>{t.estimatedArrival}</span>
                </div>

                <div className={styles.colPatient}>
                  <div className={styles.patientName}>{t.patientName}</div>
                  <div className={styles.patientMeta}>
                    <span>CI: <strong>{t.ci}</strong></span>
                    <span>·</span>
                    <span>Cód: <code>{t.tokenCode}</code></span>
                  </div>
                </div>

                <div className={styles.colSpecialty}>
                  <span className={styles.specName}>{t.specialtyName}</span>
                  <span className={styles.doctorName}>{t.doctorName}</span>
                </div>

                <div className={styles.colStatus}>
                  <Badge variant={t.status === "checked_in" ? "info" : "success"}>
                    {t.status === "checked_in" ? "Ingresado" : "Confirmado"}
                  </Badge>
                </div>

                <div className={styles.colAction}>
                  {t.status !== "checked_in" ? (
                    <button className={styles.checkInBtn} onClick={() => handleVerify(t.id)}>
                      ✓ Marcar Ingreso
                    </button>
                  ) : (
                    <span className={styles.checkedInLabel}>✓ En Espera</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noTickets}>
            <p>No hay fichas que coincidan con la búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};
