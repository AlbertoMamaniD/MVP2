"use client";

import React, { useState } from "react";
import { Modal } from "./Modal";
import { TargetIcon, TicketIcon, AlertTriangleIcon, ClockIcon } from "@/components/common/Icons";
import styles from "./SprintBadge.module.css";

export const SprintBadge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={styles.floatingTrigger}>
        <button
          type="button"
          className={styles.triggerButton}
          onClick={() => setIsOpen(true)}
          title="Ver Ficha Técnica del Experimento AI MVP Sprint"
        >
          <span className={styles.icon}><TargetIcon size={16} /></span>
          <span className={styles.text}>Ficha del Sprint (150 min)</span>
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Ficha Técnica del Experimento MVP">
        <div className={styles.content}>
          <div className={styles.section}>
            <span className={styles.sectionTag}>CASO DE ESTUDIO</span>
            <p className={styles.sectionBody}>
              <strong>Hospital Regional San Juan de Dios (Tarija, Bolivia)</strong> y red de hospitales de 3er nivel.
            </p>
          </div>

          <div className={styles.grid}>
            <div className={styles.card}>
              <span className={styles.cardTitle}>
                <AlertTriangleIcon size={14} color="#b45309" /> Riskiest Assumption
              </span>
              <p className={styles.cardBody}>
                Que las personas confíen en una ficha digital en su celular y estén dispuestas a <strong>dejar de madrugar a las 4:00 AM</strong> para hacer fila física.
              </p>
            </div>

            <div className={styles.card}>
              <span className={styles.cardTitle}>
                <ClockIcon size={14} color="var(--brand)" /> Success Metric
              </span>
              <p className={styles.cardBody}>
                Un usuario nuevo completa la reserva de principio a fin en <strong>menos de 2 minutos</strong> y sin requerir asistencia.
              </p>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionTag}>CORE USER FLOW (3 PANTALLAS)</span>
            <ol className={styles.flowList}>
              <li>1. Consulta días y cupos en tiempo real por especialidad (sin salir de casa).</li>
              <li>2. Ingresa solo 3 datos esenciales: Nombre, Cédula de Identidad y Celular.</li>
              <li>3. Recibe su Pase Digital con hora estimada sugerida de llegada y QR.</li>
            </ol>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionTag}>OUT OF SCOPE DEL EXPERIMENTO</span>
            <p className={styles.scopeNotice}>
              Pagos, contraseñas, historiales complejos y trámites burocráticos fueron excluidos para validar primero la confianza del usuario.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};
