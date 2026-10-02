"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MedicalTicket } from "@/types/ticket";
import { Badge } from "@/components/common/Badge";
import { AudioPlayerButton } from "@/components/common/AudioPlayerButton";
import { getWhatsAppShareUrl } from "@/lib/utils/whatsapp";
import {
  CheckIcon,
  CopyIcon,
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

// "2026-10-05" -> "Lun 5 oct"
const formatTicketDay = (isoDate: string): string => {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  const text = d
    .toLocaleDateString("es-BO", { weekday: "short", day: "numeric", month: "short" })
    .replace(/[.,]/g, "");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const DigitalPass: React.FC<DigitalPassProps> = ({ ticket, onClose }) => {
  const [copied, setCopied] = useState(false);
  const whatsappUrl = getWhatsAppShareUrl(ticket);
  const isCheckedIn = ticket.status === "checked_in";

  const passSpeechText = `Tu ficha está reservada, ${ticket.patientName}, carnet ${ticket.ci}. Tu turno es el número ${ticket.slotNumber} en ${ticket.specialtyName}, con ${ticket.doctorName}, en el ${ticket.roomNumber}. Llega a las ${ticket.estimatedArrival}. No necesitas madrugar a las 4 de la mañana en el frío. Preséntate quince minutos antes con tu carnet de identidad.`;

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
      {/* Confirmación, con audio para adultos mayores */}
      <div className={styles.confirm}>
        <span className={styles.confirmIcon} aria-hidden="true">
          <CheckIcon size={28} strokeWidth={3} />
        </span>
        <div className={styles.confirmText}>
          <h1>Tu ficha está reservada</h1>
          <p>No necesitas madrugar. Tu lugar está guardado con tu carnet.</p>
          <AudioPlayerButton
            variant="subtle"
            label="Escuchar Datos de Mi Ficha en Voz Alta"
            messageToRead={passSpeechText}
          />
        </div>
      </div>

      {/* Lo más importante primero: el código y guardarlo en WhatsApp */}
      <section className={styles.keyBlock} aria-labelledby="codigo-ficha">
        <span id="codigo-ficha" className={styles.keyLabel}>Tu código de ficha</span>
        <code className={styles.keyCode}>{ticket.tokenCode}</code>
        <span className={styles.keyHelp}>Muéstralo en ventanilla junto con tu carnet.</span>
        <button
          type="button"
          className={styles.copyBtn}
          onClick={handleCopyCode}
          aria-label="Copiar código de la ficha"
        >
          {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
          <span>{copied ? "Copiado" : "Copiar código"}</span>
        </button>
      </section>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn btn-primary ${styles.whatsappBtn}`}
      >
        <WhatsAppIcon size={24} />
        <span>Enviar o Guardar en WhatsApp</span>
      </a>

      {/* Ficha tipo boarding pass (componente FichaDigital) */}
      <article className={styles.ficha} id="printable-ticket" aria-label="Ficha digital">
        <header className={styles.head}>
          <div className={styles.headText}>
            <h2 className={styles.esp}>{ticket.specialtyName}</h2>
            <p className={styles.hosp}>{ticket.hospitalName}</p>
          </div>
          <div className={styles.turno}>
            <span className={styles.turnoLabel}>Turno</span>
            <span className={styles.turnoNumber}>{ticket.slotNumber}</span>
          </div>
        </header>

        <dl className={styles.grid}>
          <div>
            <dt className={styles.k}>Día</dt>
            <dd className={styles.v}>{formatTicketDay(ticket.date)}</dd>
          </div>
          <div>
            <dt className={styles.k}>Llega a las</dt>
            <dd className={`${styles.v} ${styles.arrival}`}>{ticket.estimatedArrival}</dd>
          </div>
          <div>
            <dt className={styles.k}>Paciente</dt>
            <dd className={styles.v}>{ticket.patientName}</dd>
          </div>
          <div>
            <dt className={styles.k}>Carnet</dt>
            <dd className={styles.v}>{ticket.ci}</dd>
          </div>
        </dl>

        <p className={styles.where}>
          Te atiende {ticket.doctorName} en {ticket.roomNumber}. Tu consulta es cerca de las {ticket.estimatedConsultation}.
        </p>

        {isCheckedIn && (
          <div className={styles.statusRow}>
            <Badge variant="info">En sala de espera</Badge>
          </div>
        )}

        <div className={styles.cut} aria-hidden="true" />

        <div className={styles.foot}>
          <svg className={styles.qr} viewBox="0 0 9 9" role="img" aria-label="Código QR de la ficha" shapeRendering="crispEdges">
            <rect width="9" height="9" fill="var(--surface)" />
            <g fill="var(--brand)">
              <path d="M0 0h3v3H0zM6 0h3v3H6zM0 6h3v3H0z" />
              <path d="M4 0h1v1H4zM4 2h1v2H4zM5 4h2v1H5zM3 4h1v1H3zM6 6h1v1H6zM8 6h1v1H8zM5 7h1v2H5zM7 8h2v1H7zM4 5h1v1H4z" />
            </g>
            <g fill="var(--surface)">
              <path d="M1 1h1v1H1zM7 1h1v1H7zM1 7h1v1H1z" />
            </g>
          </svg>
          <div className={styles.note}>
            <p>Preséntate 15 minutos antes.</p>
            <small>Muestra este código en ventanilla.</small>
            <div className={styles.tokenRow}>
              <code className={styles.tokenCode}>{ticket.tokenCode}</code>
            </div>
          </div>
        </div>

        <p className={styles.legal}>
          Tu ficha es gratuita y solo tuya. Lleva tu carnet físico al consultorio.
        </p>
      </article>

      {/* Otras opciones */}
      <div className={styles.actions}>
        <Link href="/personal" className="btn btn-secondary">
          <UserCheckIcon size={20} />
          <span>Ver Cómo Aparece en Ventanilla del Hospital</span>
          <ArrowRightIcon size={16} />
        </Link>

        <button type="button" className="btn btn-secondary" onClick={handlePrint}>
          <PrintIcon size={20} />
          <span>Imprimir o Guardar como PDF</span>
        </button>

        {onClose && (
          <button type="button" className={styles.backButton} onClick={onClose}>
            <ArrowLeftIcon size={16} />
            <span>Volver al Semáforo de Especialidades</span>
          </button>
        )}
      </div>
    </div>
  );
};
