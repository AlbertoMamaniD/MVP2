"use client";

import React from "react";
import { AvailableDay } from "@/lib/utils/formatters";
import { CalendarIcon } from "@/components/common/Icons";
import styles from "./DaySelector.module.css";

interface DaySelectorProps {
  days: AvailableDay[];
  selectedDayId: string;
  onSelectDay: (dayId: string) => void;
  availableCountMap?: Record<string, number>;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  days,
  selectedDayId,
  onSelectDay,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.label}>
          <CalendarIcon size={16} /> Selecciona el día de tu atención
        </span>
        <span className={styles.subtext}>Cupos limitados por jornada</span>
      </div>

      <div className={styles.dayGrid} role="radiogroup" aria-label="Día de atención">
        {days.map((day) => {
          const isSelected = day.id === selectedDayId;
          return (
            <button
              key={day.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`${styles.dayCard} ${isSelected ? styles.selected : ""}`}
              onClick={() => onSelectDay(day.id)}
            >
              <div className={styles.dayHeader}>
                <span className={styles.dayBadge}>{day.label}</span>
                <span className={styles.dayDate}>{day.shortDate}</span>
              </div>
              <span className={styles.dayFullName}>{day.dayName}</span>
              <div className={styles.indicatorRow}>
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.statusText}>Cupos habilitados</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
