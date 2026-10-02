"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MedicalTicket } from "@/types/ticket";
import { Badge } from "@/components/common/Badge";
import { AudioPlayerButton } from "@/components/common/AudioPlayerButton";
import { getWhatsAppShareUrl } from "@/lib/utils/whatsapp";
import {
  ClockIcon,
  ShieldCheckIcon,
  CopyIcon,
  CheckIcon,
  AlertTriangleIcon,
  WhatsAppIcon,
  UserCheckIcon,
  PrintIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@/components/common/Icons";
import styles from "./DigitalPass.module.css";

interface DigitalPassProps {
  ticket: MedicalTicket;
  onClose?: () => void;
}

export const DigitalPass: React.FC<DigitalPassProps> = ({ ticket, onClose }) => {
  const [copied, setCopied] = useState(false);
  const whatsappUrl = getWhatsAppShareUrl(ticket);

  const passSpeechText = `Ficha médica confirmada para ${ticket.patientName}, carnet de identidad ${ticket.ci}. Su turno es el número ${ticket.slotNumber} para la especialidad de ${ticket.specialtyName} con el médico ${ticket.doctorName} en el ${ticket.roomNumber}. Su hora sugerida de llegada es a las ${ticket.estimatedArrival}. No madrugue a las 4 de la mañana en el frío. Preséntese quince minutos antes con su cédula de identidad original.`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ticket.tokenCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.wrapper}>
      {/* Mensaje de certeza / Anti-madrugada con Audio para Adultos Mayores */}
      <div className={styles.heroAlert}>
        <span className={styles.heroIcon}>
          <ShieldCheckIcon size={32} color="#ffffff" />
        </span>
        <div className={styles.heroText}>
          <h2>¡Tu Ficha Médica está Asegurada!</h2>
          <p>
            No tienes que madrugar ni exponerte al frío de las 4:00 AM. Tu cupo está registrado a tu nombre y carnet de identidad.
          </p>
          <div style={{ marginTop: "10px" }}>
            <AudioPlayerButton
              variant="banner"
              label="Escuchar Datos de Mi Ficha en Voz Alta"
              messageToRead={passSpeechText}
            />
          </div>
        </div>
      </div>

      {/* Tarjeta del Ticket (Diseño estilo tarjeta de embarque / pasaporte médico) */}
      <div className={styles.ticketCard} id="printable-ticket">
        {/* Cabecera del Ticket */}
        <div className={styles.ticketHeader}>
          <div className={styles.headerTitles}>
            <span className={styles.systemTag}>Sistema Único de Salud (SUS), Bolivia</span>
            <h3 className={styles.hospitalTitle}>{ticket.hospitalName}</h3>
          </div>
          <Badge variant={ticket.status === "checked_in" ? "info" : "success"}>
            {ticket.status === "checked_in" ? "En sala de espera" : "Ficha confirmada"}
          </Badge>
        </div>

        {/* Sección de Horario y Turno Grande */}
        <div className={styles.scheduleHighlight}>
          <div className={styles.timeBlock}>
            <span className={styles.timeBlockLabel}>
              <ClockIcon size={13} /> Hora sugerida de llegada
            </span>
            <span className={styles.timeBlockValue}>{ticket.estimatedArrival}</span>
            <span className={styles.timeBlockHint}>Llega 15 min antes con tu Cédula de Identidad</span>
          </div>

          <div className={styles.slotBlock}>
            <span className={styles.slotBlockLabel}>Turno</span>
            <span className={styles.slotBlockNumber}>#{ticket.slotNumber.toString().padStart(2, "0")}</span>
          </div>
        </div>

        {/* Detalles Médicos */}
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Especialidad</span>
            <span className={styles.detailValueBold}>{ticket.specialtyName}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Médico asignado</span>
            <span className={styles.detailValue}>{ticket.doctorName}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Consultorio</span>
            <span className={styles.detailValue}>{ticket.roomNumber}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Hora estimada de consulta</span>
            <span className={styles.detailValue}>{ticket.estimatedConsultation}</span>
          </div>
        </div>

        {/* Línea perforada decorativa */}
        <div className={styles.perforatedLine} aria-hidden="true">
          <span className={styles.notchLeft} />
          <span className={styles.dashedLine} />
          <span className={styles.notchRight} />
        </div>

        {/* Datos del Paciente y Código de Seguridad */}
        <div className={styles.patientFooter}>
          <div className={styles.patientInfo}>
            <span className={styles.patientTag}>Paciente titular</span>
            <span className={styles.patientName}>{ticket.patientName}</span>
            <span className={styles.patientCI}>
              Cédula de Identidad: <strong>{ticket.ci}</strong>
            </span>
            <div className={styles.tokenRow}>
              <span className={styles.tokenLabel}>Código</span>
              <code className={styles.tokenCode}>{ticket.tokenCode}</code>
              <button
                type="button"
                className={styles.copyBtn}
                onClick={handleCopyCode}
                title="Copiar código de ficha"
              >
                {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
                <span>{copied ? "Copiado" : "Copiar"}</span>
              </button>
            </div>
          </div>

          <div className={styles.qrArea}>
            <div className={styles.qrBox}>
              <svg width="84" height="84" viewBox="0 0 100 100" fill="none" role="img" aria-label="Código QR de la ficha">
                <rect width="100" height="100" fill="#ffffff" rx="8" />
                <rect x="10" y="10" width="25" height="25" stroke="#0f172a" strokeWidth="5" fill="none" />
                <rect x="17" y="17" width="11" height="11" fill="#0f172a" />
                
                <rect x="65" y="10" width="25" height="25" stroke="#0f172a" strokeWidth="5" fill="none" />
                <rect x="72" y="17" width="11" height="11" fill="#0f172a" />
                
                <rect x="10" y="65" width="25" height="25" stroke="#0f172a" strokeWidth="5" fill="none" />
                <rect x="17" y="72" width="11" height="11" fill="#0f172a" />
                
                <rect x="42" y="15" width="6" height="15" fill="#0f172a" />
                <rect x="42" y="38" width="16" height="6" fill="#0f172a" />
                <rect x="15" y="42" width="15" height="6" fill="#0f172a" />
                <rect x="42" y="70" width="8" height="16" fill="#0f172a" />
                <rect x="65" y="45" width="20" height="6" fill="#0f172a" />
                <rect x="65" y="60" width="10" height="15" fill="#0f172a" />
                <rect x="80" y="75" width="10" height="10" fill="#0f172a" />
              </svg>
            </div>
            <span className={styles.qrHint}>Escanear en ventanilla</span>
          </div>
        </div>

        {/* Nota legal / Dignidad */}
        <div className={styles.ticketLegalNotice}>
          <AlertTriangleIcon size={14} />
          <span>Ficha intransferible. Presenta tu Carnet físico en el consultorio. La atención es gratuita y respaldada por el SUS.</span>
        </div>
      </div>

      {/* Botones de acción primarios */}
      <div className={styles.actionButtons}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsappButton}
        >
          <WhatsAppIcon size={18} />
          <span>Enviar o Guardar en WhatsApp</span>
        </a>

        <Link href="/personal" className={styles.staffViewButton}>
          <UserCheckIcon size={18} />
          <span>Ver Cómo Aparece en Ventanilla del Hospital</span>
          <ArrowRightIcon size={14} />
        </Link>

        <button className={styles.printButton} onClick={handlePrint}>
          <PrintIcon size={17} />
          <span>Imprimir o Guardar como PDF</span>
        </button>

        {onClose && (
          <button className={styles.backButton} onClick={onClose}>
            <ArrowLeftIcon size={14} />
            <span>Volver al Semáforo de Especialidades</span>
          </button>
        )}
      </div>
    </div>
  );
};
