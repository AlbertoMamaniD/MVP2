/**
 * Utilidades de formateo para fechas, horas y cédulas de identidad (Bolivia)
 */

export interface AvailableDay {
  id: string; // "YYYY-MM-DD" en hora local
  label: string; // "Hoy", "Mañana", "Lunes 12"
  dayName: string; // "Viernes"
  dateFormatted: string; // "viernes 2 de octubre"
  shortDate: string; // "02/10"
  isToday: boolean;
}

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MONTH_NAMES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

/** "YYYY-MM-DD" con la fecha local (toISOString usa UTC y adelanta el día en la noche). */
export function toLocalIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Días en los que se puede reservar: desde hoy y durante `windowDays` días,
 * sin domingos (no hay consulta regular en hospitales públicos).
 */
export function getAvailableDays(windowDays: number = 14): AvailableDay[] {
  const days: AvailableDay[] = [];
  const base = new Date();

  for (let i = 0; i < windowDays; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);

    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0) continue;

    const dayName = DAY_NAMES[dayOfWeek];
    let label = `${dayName} ${d.getDate()}`;
    if (i === 0) label = "Hoy";
    else if (i === 1) label = "Mañana";

    days.push({
      id: toLocalIsoDate(d),
      label,
      dayName,
      dateFormatted: `${dayName.toLowerCase()} ${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}`,
      shortDate: `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`,
      isToday: i === 0,
    });
  }

  return days;
}

export function formatCurrentDate(): string {
  const now = new Date();
  return now.toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(dateStr?: string): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  return d.toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Calcula hora estimada de llegada restando minutos de tolerancia
 */
export function calculateEstimatedArrival(startTime: string, slotIndex: number, slotDurationMinutes: number): { arrival: string; consultation: string } {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const totalOffsetMinutes = (slotIndex - 1) * slotDurationMinutes;
  
  const consultDate = new Date();
  consultDate.setHours(startHour, startMin + totalOffsetMinutes, 0, 0);

  const arrivalDate = new Date(consultDate);
  arrivalDate.setMinutes(arrivalDate.getMinutes() - 15); // Debe llegar 15 min antes

  const formatTime = (d: Date) => {
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  };

  return {
    arrival: formatTime(arrivalDate),
    consultation: formatTime(consultDate),
  };
}

/**
 * Normaliza carnet de identidad boliviano (ej: 6849201 LP)
 */
export function normalizeCI(ci: string): string {
  return ci.trim().toUpperCase().replace(/\s+/g, " ");
}
