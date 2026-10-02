import React from "react";
import { Hospital } from "@/types/hospital";
import { MOCK_HOSPITALS } from "@/lib/data/mockHospitals";
import { HospitalIcon } from "@/components/common/Icons";
import styles from "./HospitalSelector.module.css";

interface HospitalSelectorProps {
  selectedId: string;
  onSelect: (hospitalId: string) => void;
}

export const HospitalSelector: React.FC<HospitalSelectorProps> = ({ selectedId, onSelect }) => {
  return (
    <div className={styles.selectorWrapper}>
      <label htmlFor="hospital-select" className={styles.label}>
        <HospitalIcon size={16} /> Centro de Salud / Hospital de Referencia:
      </label>
      <div className={styles.selectContainer}>
        <select
          id="hospital-select"
          className={styles.select}
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
        >
          {MOCK_HOSPITALS.map((h: Hospital) => (
            <option key={h.id} value={h.id}>
              {h.name}, {h.city} ({h.level})
            </option>
          ))}
        </select>
        <svg className={styles.arrowIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
};
