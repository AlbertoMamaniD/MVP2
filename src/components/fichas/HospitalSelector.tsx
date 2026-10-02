import React from "react";
import { Hospital } from "@/types/hospital";
import { MOCK_HOSPITALS } from "@/lib/data/mockHospitals";
import styles from "./HospitalSelector.module.css";

interface HospitalSelectorProps {
  selectedId: string;
  onSelect: (hospitalId: string) => void;
}

export const HospitalSelector: React.FC<HospitalSelectorProps> = ({ selectedId, onSelect }) => {
  return (
    <div className={styles.selectorWrapper}>
      <label htmlFor="hospital-select" className={styles.label}>
        🏥 Centro de Salud / Hospital:
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
              {h.name} — {h.city} ({h.level})
            </option>
          ))}
        </select>
        <span className={styles.arrowIcon}>▼</span>
      </div>
    </div>
  );
};
