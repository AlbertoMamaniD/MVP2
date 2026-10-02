"use client";

import React, { useState } from "react";
import { Specialty } from "@/types/specialty";
import { Modal } from "@/components/common/Modal";
import { BookingPayload, MedicalTicket } from "@/types/ticket";
import styles from "./BookingModal.module.css";

interface BookingModalProps {
  specialty: Specialty | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (ticket: MedicalTicket) => void;
  onBook: (payload: BookingPayload) => { success: boolean; ticket?: MedicalTicket; error?: string };
  selectedDayLabel?: string;
  selectedDayFormatted?: string;
}

const DEPARTAMENTOS_BOLIVIA = ["TJ (Tarija)", "LP (La Paz)", "SC (Santa Cruz)", "CB (Cochabamba)", "OR (Oruro)", "PT (Potosí)", "CH (Chuquisaca)", "BE (Beni)", "PA (Pando)"];

export const BookingModal: React.FC<BookingModalProps> = ({
  specialty,
  isOpen,
  onClose,
  onSuccess,
  onBook,
  selectedDayLabel = "Hoy",
  selectedDayFormatted,
}) => {
  const [ciNumber, setCiNumber] = useState("");
  const [ciExtension, setCiExtension] = useState("TJ (Tarija)");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!specialty) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const extCode = ciExtension.split(" ")[0];
    const fullCI = `${ciNumber.trim()}-${extCode}`;

    if (!ciNumber.trim() || ciNumber.trim().length < 5) {
      setErrorMsg("Por favor ingresa un número de Carnet de Identidad válido (mínimo 5 dígitos).");
      return;
    }

    if (!patientName.trim() || patientName.trim().length < 3) {
      setErrorMsg("Por favor ingresa el nombre y apellido completo del paciente.");
      return;
    }

    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg("Por favor ingresa un número de celular boliviano válido (8 dígitos).");
      return;
    }

    setIsSubmitting(true);

    const res = onBook({
      specialtyId: specialty.id,
      patientName: patientName.trim(),
      ci: fullCI,
      phone: phone.trim(),
    });

    setIsSubmitting(false);

    if (res.success && res.ticket) {
      onSuccess(res.ticket);
      // Limpiar formulario
      setCiNumber("");
      setPatientName("");
      setPhone("");
      onClose();
    } else {
      setErrorMsg(res.error || "Ocurrió un error al reservar el cupo.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Sacar Ficha · ${specialty.name}`}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Resumen del turno */}
        <div className={styles.summaryBox}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Fecha de Consulta:</span>
            <span className={styles.summaryValueHighlight}>
              📅 {selectedDayLabel} {selectedDayFormatted ? `(${selectedDayFormatted})` : ""}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Médico:</span>
            <span className={styles.summaryValue}>{specialty.doctorName}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Consultorio:</span>
            <span className={styles.summaryValue}>{specialty.roomNumber}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Cupos disponibles:</span>
            <span className={styles.summaryValueHighlight}>{specialty.availableSlots} cupos restantes</span>
          </div>
        </div>

        {errorMsg && (
          <div className={styles.errorAlert}>
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        {/* Input Cédula de Identidad */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Cédula de Identidad (CI) del Paciente: <span className={styles.required}>*</span>
          </label>
          <div className={styles.ciRow}>
            <input
              type="text"
              className={styles.input}
              placeholder="Ej. 6849201"
              value={ciNumber}
              onChange={(e) => setCiNumber(e.target.value.replace(/\D/g, ""))}
              required
              autoFocus
            />
            <select
              className={styles.extensionSelect}
              value={ciExtension}
              onChange={(e) => setCiExtension(e.target.value)}
            >
              {DEPARTAMENTOS_BOLIVIA.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>
          <span className={styles.helperText}>
            El cupo queda registrado estrictamente a este número de carnet para evitar reventa.
          </span>
        </div>

        {/* Input Nombre Paciente */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Nombre y Apellido Completo: <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="Ej. Maria Elena Quispe Mamani"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />
        </div>

        {/* Input WhatsApp / Celular */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Número de WhatsApp (para recibir el pase): <span className={styles.required}>*</span>
          </label>
          <div className={styles.phoneInputWrapper}>
            <span className={styles.phonePrefix}>🇧🇴 +591</span>
            <input
              type="tel"
              className={`${styles.input} ${styles.phoneInput}`}
              placeholder="Ej. 77218940"
              maxLength={8}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              required
            />
          </div>
          <span className={styles.helperText}>Te enviaremos el ticket digital con tu hora exacta por WhatsApp.</span>
        </div>

        {/* Regla y Compromiso */}
        <div className={styles.noticeBox}>
          <span className={styles.noticeIcon}>🛡️</span>
          <p>
            Al confirmar, te comprometes a presentarte <strong>15 minutos antes</strong> de tu turno. No necesitas hacer fila en la madrugada.
          </p>
        </div>

        {/* Botones de acción */}
        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? "Asignando Cupo..." : "Confirmar mi Ficha Médica"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
