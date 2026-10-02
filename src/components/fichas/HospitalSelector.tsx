import React from "react";
import { Hospital } from "@/types/hospital";
import { MOCK_HOSPITALS } from "@/lib/data/mockHospitals";
import { HospitalIcon, LocationIcon, ClockIcon, ShieldCheckIcon } from "@/components/common/Icons";
import styles from "./HospitalSelector.module.css";

interface HospitalSelectorProps {
  selectedId: string;
  onSelect: (hospitalId: string) => void;
}

export const HospitalSelector: React.FC<HospitalSelectorProps> = ({ selectedId, onSelect }) => {
  const selected = MOCK_HOSPITALS.find((h) => h.id === selectedId) || MOCK_HOSPITALS[0];

  return (
    <div className={styles.selectorWrapper}>
      <label htmlFor="hospital-select" className="visually-hidden">
        Centro de Salud / Hospital de Referencia
      </label>
      <div className={styles.selectContainer}>
        <HospitalIcon size={20} className={styles.leadIcon} />
        <select
          id="hospital-select"
          className={styles.select}
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
        >
          {MOCK_HOSPITALS.map((h: Hospital) => (
            <option key={h.id} value={h.id}>
              {h.name}, {h.city}
            </option>
          ))}
        </select>
        <svg className={styles.arrowIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      <dl className={styles.info}>
        <div>
          <dt className="visually-hidden">Dirección</dt>
          <dd><LocationIcon size={16} /> {selected.address}, {selected.city}</dd>
        </div>
        <div>
          <dt className="visually-hidden">Horario de atención</dt>
          <dd><ClockIcon size={16} /> Atiende de {selected.openingHours}</dd>
        </div>
        <div>
          <dt className="visually-hidden">Nivel</dt>
          <dd><ShieldCheckIcon size={16} /> {selected.level}. Atención gratuita por el {selected.system}.</dd>
        </div>
      </dl>
    </div>
  );
};
