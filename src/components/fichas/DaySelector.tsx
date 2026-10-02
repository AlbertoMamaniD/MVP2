"use client";

import React, { useMemo, useState } from "react";
import { AvailableDay, toLocalIsoDate } from "@/lib/utils/formatters";
import { CalendarIcon } from "@/components/common/Icons";
import styles from "./DaySelector.module.css";

interface DaySelectorProps {
  days: AvailableDay[];
  selectedDayId: string;
  onSelectDay: (dayId: string) => void;
  availableCountMap?: Record<string, number>;
}

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const WEEKDAYS_LONG = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const parseIso = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/** Calendario de mes: muestra qué días se pueden elegir y cuál está elegido. */
export const DaySelector: React.FC<DaySelectorProps> = ({
  days,
  selectedDayId,
  onSelectDay,
}) => {
  const availableIds = useMemo(() => new Set(days.map((d) => d.id)), [days]);
  const selectedDay = days.find((d) => d.id === selectedDayId) || days[0];
  const todayId = toLocalIsoDate(new Date());

  const initial = parseIso(selectedDay?.id || todayId);
  const [view, setView] = useState({ year: initial.getFullYear(), month: initial.getMonth() });

  // Meses que tienen al menos un día disponible: limitan la navegación
  const monthKeys = useMemo(
    () => Array.from(new Set(days.map((d) => d.id.slice(0, 7)))).sort(),
    [days]
  );
  const viewKey = `${view.year}-${(view.month + 1).toString().padStart(2, "0")}`;
  const viewIndex = monthKeys.indexOf(viewKey);
  const canPrev = viewIndex > 0;
  const canNext = viewIndex !== -1 && viewIndex < monthKeys.length - 1;

  const moveMonth = (delta: number) => {
    const key = monthKeys[viewIndex + delta];
    if (!key) return;
    const [y, m] = key.split("-").map(Number);
    setView({ year: y, month: m - 1 });
  };

  // Celdas del mes, empezando la semana en lunes
  const cells = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const leading = (first.getDay() + 6) % 7;
    const total = new Date(view.year, view.month + 1, 0).getDate();
    const list: (Date | null)[] = Array.from({ length: leading }, () => null);
    for (let d = 1; d <= total; d++) list.push(new Date(view.year, view.month, d));
    while (list.length % 7 !== 0) list.push(null);
    return list;
  }, [view]);

  return (
    <div className={styles.calendar}>
      <div className={styles.chosen} aria-live="polite">
        <CalendarIcon size={24} />
        <div>
          <span className={styles.chosenLabel}>Elegiste</span>
          <span className={styles.chosenDate}>
            {selectedDay ? capitalize(selectedDay.dateFormatted) : "Ningún día"}
            {selectedDay?.isToday && <span className={styles.todayTag}>Hoy</span>}
          </span>
        </div>
      </div>

      <div className={styles.monthBar}>
        <button
          type="button"
          className={styles.monthNav}
          onClick={() => moveMonth(-1)}
          disabled={!canPrev}
          aria-label="Mes anterior"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <h3 className={styles.monthTitle}>
          {MONTHS[view.month]} {view.year}
        </h3>
        <button
          type="button"
          className={styles.monthNav}
          onClick={() => moveMonth(1)}
          disabled={!canNext}
          aria-label="Mes siguiente"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>

      <div className={styles.grid} role="group" aria-label={`Días de ${MONTHS[view.month]}`}>
        {WEEKDAYS.map((w) => (
          <span key={w} className={styles.weekday} aria-hidden="true">{w}</span>
        ))}

        {cells.map((date, i) => {
          if (!date) return <span key={`empty-${i}`} className={styles.empty} aria-hidden="true" />;

          const id = toLocalIsoDate(date);
          const isAvailable = availableIds.has(id);
          const isSelected = id === selectedDay?.id;
          const isToday = id === todayId;
          const isSunday = date.getDay() === 0;
          const weekdayLong = WEEKDAYS_LONG[(date.getDay() + 6) % 7];

          let reason = "no disponible";
          if (isSunday) reason = "domingo, no hay consulta";
          else if (id < todayId) reason = "ya pasó";

          return (
            <button
              key={id}
              type="button"
              className={[
                styles.day,
                isAvailable ? styles.available : styles.unavailable,
                isSelected ? styles.selected : "",
                isToday ? styles.today : "",
              ].join(" ")}
              disabled={!isAvailable}
              aria-pressed={isAvailable ? isSelected : undefined}
              aria-label={`${weekdayLong} ${date.getDate()}${isToday ? ", hoy" : ""}${isAvailable ? "" : `, ${reason}`}`}
              onClick={() => onSelectDay(id)}
            >
              <span className={styles.dayNumber}>{date.getDate()}</span>
              {isToday && <span className={styles.dayHint}>Hoy</span>}
            </button>
          );
        })}
      </div>

      <ul className={styles.legend} aria-label="Cómo leer el calendario">
        <li><span className={`${styles.swatch} ${styles.swatchAvailable}`} aria-hidden="true" />Puedes elegir</li>
        <li><span className={`${styles.swatch} ${styles.swatchSelected}`} aria-hidden="true" />Tu día</li>
        <li><span className={`${styles.swatch} ${styles.swatchOff}`} aria-hidden="true" />Domingo o sin atención</li>
      </ul>
    </div>
  );
};
