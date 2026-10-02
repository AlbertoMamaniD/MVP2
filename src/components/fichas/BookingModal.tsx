"use client";

import React, { useState } from "react";
import { Specialty } from "@/types/specialty";
import { Modal } from "@/components/common/Modal";
import { AudioPlayerButton } from "@/components/common/AudioPlayerButton";
import { BookingPayload, MedicalTicket } from "@/types/ticket";
import {
  CalendarIcon,
  BoltIcon,
  AlertTriangleIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
} from "@/components/common/Icons";
import styles from "./BookingModal.module.css";

interface BookingModalProps {
  specialty: Specialty | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (ticket: MedicalTicket) => void;
  onBook: (payload: BookingPayload) => { success: boolean; ticket?: MedicalTicket; error?: string };
  selectedDayLabel?: string;
  selectedDayFormatted?: string;
  selectedDayId?: string;
}

const DEPARTAMENTOS_BOLIVIA = ["TJ (Tarija)", "LP (La Paz)", "SC (Santa Cruz)", "CB (Cochabamba)", "OR (Oruro)", "PT (Potosí)", "CH (Chuquisaca)", "BE (Beni)", "PA (Pando)"];

// "TJ (Tarija)" -> "Tarija"
const depName = (dep: string) => dep.replace(/^\w+\s*\((.*)\)$/, "$1");

type Step = 0 | 1 | 2 | 3;
const QUESTION_STEPS = 3;

/**
 * Reserva paso a paso: una pregunta por pantalla, con letra grande y audio,
 * pensada para adultos mayores. El último paso revisa los datos.
 */
export const BookingModal: React.FC<BookingModalProps> = ({
  specialty,
  isOpen,
  onClose,
  onSuccess,
  onBook,
  selectedDayLabel = "Hoy",
  selectedDayFormatted,
  selectedDayId,
}) => {
  const [step, setStep] = useState<Step>(0);
  const [ciNumber, setCiNumber] = useState("");
  const [ciExtension, setCiExtension] = useState("TJ (Tarija)");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!specialty) return null;

  const valid = {
    ci: ciNumber.trim().length >= 5,
    name: patientName.trim().length >= 3,
    phone: phone.trim().length === 8,
  };

  const resetForm = () => {
    setStep(0);
    setCiNumber("");
    setPatientName("");
    setPhone("");
    setErrorMsg(null);
  };

  const handleClose = () => {
    setStep(0);
    setErrorMsg(null);
    onClose();
  };

  const goNext = () => setStep((s) => Math.min(s + 1, 3) as Step);
  const goBack = () => setStep((s) => Math.max(s - 1, 0) as Step);

  const handleBook = () => {
    setErrorMsg(null);
    if (!valid.ci || !valid.name || !valid.phone) return;

    const extCode = ciExtension.split(" ")[0];
    const fullCI = `${ciNumber.trim()}-${extCode}`;

    setIsSubmitting(true);
    const res = onBook({
      specialtyId: specialty.id,
      patientName: patientName.trim(),
      ci: fullCI,
      phone: phone.trim(),
      date: selectedDayId,
    });
    setIsSubmitting(false);

    if (res.success && res.ticket) {
      onSuccess(res.ticket);
      resetForm();
      onClose();
    } else {
      setErrorMsg(res.error || "No pudimos reservar tu ficha. Inténtalo de nuevo.");
    }
  };

  // Enter avanza al siguiente paso si el dato está completo
  const submitStep = (e: React.FormEvent, isValid: boolean) => {
    e.preventDefault();
    if (isValid) goNext();
  };

  const rawDay = selectedDayFormatted || selectedDayLabel;
  const dayText = rawDay.charAt(0).toUpperCase() + rawDay.slice(1);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reserva tu ficha">
      <div className={styles.wizard}>
        {/* Qué se está reservando */}
        <p className={styles.context}>
          <strong>{specialty.name}</strong>
          <span>
            <CalendarIcon size={16} /> {dayText}
          </span>
        </p>

        {/* Progreso */}
        {step < QUESTION_STEPS ? (
          <div className={styles.progress}>
            <span className={styles.progressText}>Paso {step + 1} de {QUESTION_STEPS}</span>
            <div className={styles.progressTrack} aria-hidden="true">
              {Array.from({ length: QUESTION_STEPS }, (_, i) => (
                <span key={i} className={`${styles.progressSeg} ${i <= step ? styles.progressOn : ""}`} />
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.progress}>
            <span className={styles.progressText}>Último paso</span>
            <div className={styles.progressTrack} aria-hidden="true">
              {Array.from({ length: QUESTION_STEPS }, (_, i) => (
                <span key={i} className={`${styles.progressSeg} ${styles.progressOn}`} />
              ))}
            </div>
          </div>
        )}

        {step === 0 && (
          <button
            type="button"
            className={styles.demoFillBtn}
            onClick={() => {
              setCiNumber("7123456");
              setCiExtension("TJ (Tarija)");
              setPatientName("Roberto Cardozo Vaca");
              setPhone("71829304");
              setErrorMsg(null);
              setStep(3);
            }}
          >
            <BoltIcon size={16} />
            <span>Llenar Datos de Prueba (Demo Tarija)</span>
          </button>
        )}

        {/* Paso 1: carnet */}
        {step === 0 && (
          <form className={styles.stepForm} onSubmit={(e) => submitStep(e, valid.ci)}>
            <label htmlFor="booking-ci" className={styles.question}>¿Cuál es tu número de carnet?</label>
            <p className={styles.help}>Solo los números. Lo encuentras en tu cédula de identidad.</p>
            <input
              id="booking-ci"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              className={styles.bigInput}
              placeholder="6849201"
              value={ciNumber}
              onChange={(e) => setCiNumber(e.target.value.replace(/\D/g, ""))}
              autoFocus
            />

            <fieldset className={styles.depFieldset}>
              <legend className={styles.subQuestion}>¿Dónde sacaste tu carnet?</legend>
              <div className={styles.depGrid}>
                {DEPARTAMENTOS_BOLIVIA.map((dep) => (
                  <button
                    key={dep}
                    type="button"
                    className={`${styles.depOption} ${ciExtension === dep ? styles.depSelected : ""}`}
                    aria-pressed={ciExtension === dep}
                    onClick={() => setCiExtension(dep)}
                  >
                    {depName(dep)}
                  </button>
                ))}
              </div>
            </fieldset>

            <AudioPlayerButton
              variant="subtle"
              label="Escuchar la pregunta"
              messageToRead="¿Cuál es tu número de carnet? Escribe solo los números de tu cédula de identidad. Después toca el departamento donde sacaste tu carnet."
            />

            <div className={styles.actions}>
              <button type="submit" className="btn btn-primary" disabled={!valid.ci}>
                Siguiente
              </button>
            </div>
          </form>
        )}

        {/* Paso 2: nombre */}
        {step === 1 && (
          <form className={styles.stepForm} onSubmit={(e) => submitStep(e, valid.name)}>
            <label htmlFor="booking-name" className={styles.question}>¿Cuál es tu nombre completo?</label>
            <p className={styles.help}>Nombre y apellido de la persona que va a la consulta.</p>
            <input
              id="booking-name"
              type="text"
              autoComplete="name"
              autoCapitalize="words"
              className={styles.bigInput}
              placeholder="María Quispe Mamani"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              autoFocus
            />

            <AudioPlayerButton
              variant="subtle"
              label="Escuchar la pregunta"
              messageToRead="¿Cuál es tu nombre completo? Escribe el nombre y el apellido de la persona que va a la consulta."
            />

            <div className={styles.actions}>
              <button type="submit" className="btn btn-primary" disabled={!valid.name}>
                Siguiente
              </button>
              <button type="button" className={styles.backLink} onClick={goBack}>
                <ArrowLeftIcon size={16} /> Atrás
              </button>
            </div>
          </form>
        )}

        {/* Paso 3: celular */}
        {step === 2 && (
          <form className={styles.stepForm} onSubmit={(e) => submitStep(e, valid.phone)}>
            <label htmlFor="booking-phone" className={styles.question}>¿Cuál es tu celular con WhatsApp?</label>
            <p className={styles.help}>Ahí te mandamos tu ficha y tu hora de llegada. Son 8 números.</p>
            <div className={styles.phoneWrap}>
              <span className={styles.phonePrefix}>+591</span>
              <input
                id="booking-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                className={`${styles.bigInput} ${styles.phoneInput}`}
                placeholder="77218940"
                maxLength={8}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                autoFocus
              />
            </div>
            <p className={styles.counter} aria-live="polite">
              {phone.length} de 8 números
            </p>

            <AudioPlayerButton
              variant="subtle"
              label="Escuchar la pregunta"
              messageToRead="¿Cuál es tu celular con WhatsApp? Escribe los ocho números. Ahí te mandamos tu ficha y tu hora de llegada."
            />

            <div className={styles.actions}>
              <button type="submit" className="btn btn-primary" disabled={!valid.phone}>
                Siguiente
              </button>
              <button type="button" className={styles.backLink} onClick={goBack}>
                <ArrowLeftIcon size={16} /> Atrás
              </button>
            </div>
          </form>
        )}

        {/* Paso final: revisar y reservar */}
        {step === 3 && (
          <div className={styles.stepForm}>
            <h3 className={styles.question}>Revisa tus datos</h3>
            <p className={styles.help}>Si algo está mal, toca &quot;Cambiar&quot;.</p>

            <dl className={styles.review}>
              <div className={styles.reviewRow}>
                <div>
                  <dt>Carnet</dt>
                  <dd>{ciNumber} {ciExtension.split(" ")[0]}</dd>
                </div>
                <button type="button" className={styles.changeBtn} onClick={() => setStep(0)}>Cambiar</button>
              </div>
              <div className={styles.reviewRow}>
                <div>
                  <dt>Nombre</dt>
                  <dd>{patientName}</dd>
                </div>
                <button type="button" className={styles.changeBtn} onClick={() => setStep(1)}>Cambiar</button>
              </div>
              <div className={styles.reviewRow}>
                <div>
                  <dt>Celular</dt>
                  <dd>+591 {phone}</dd>
                </div>
                <button type="button" className={styles.changeBtn} onClick={() => setStep(2)}>Cambiar</button>
              </div>
              <div className={styles.reviewRow}>
                <div>
                  <dt>Te atiende</dt>
                  <dd>{specialty.doctorName}</dd>
                </div>
              </div>
            </dl>

            {errorMsg && (
              <div className={styles.errorAlert} role="alert">
                <AlertTriangleIcon size={20} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className={styles.noticeBox}>
              <ShieldCheckIcon size={22} color="var(--brand)" />
              <p>
                Llega <strong>15 minutos antes</strong> de tu hora. No necesitas hacer fila en la madrugada.
              </p>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleBook}
                disabled={isSubmitting || !valid.ci || !valid.name || !valid.phone}
              >
                {isSubmitting ? "Reservando..." : "Reservar mi ficha"}
              </button>
              <button type="button" className={styles.backLink} onClick={goBack}>
                <ArrowLeftIcon size={16} /> Atrás
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
