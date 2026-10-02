/**
 * Utilidades de formateo para fechas, horas y cédulas de identidad (Bolivia)
 */

export interface AvailableDay {
  id: string; // "YYYY-MM-DD"
  label: string; // "Hoy", "Mañana", etc.
  dayName: string; // "Viernes"
  dateFormatted: string; // "Viernes, 02 de Octubre"
  shortDate: string; // "02/10"
  isToday: boolean;
}

export function getAvailableDays(): AvailableDay[] {
  const days: AvailableDay[] = [];
  const base = new Date();

  for (let i = 0; i < 4; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);

    // Si es domingo, saltar o marcar
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0) continue; // Los domingos no hay consulta regular en hospitales públicos

    let label = "";
    if (i === 0) label = "Hoy";
    else if (i === 1) label = "Mañana";
    else {
      const dayNames = ["Dom", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      label = dayNames[dayOfWeek];
    }

    const isoDate = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("es-BO", { weekday: "long" });
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    
    const dateFormatted = d.toLocaleDateString("es-BO", {
      weekday: "long",
      day: "2-digit",
      month: "short",
    });

    const shortDate = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;

    days.push({
      id: isoDate,
      label,
      dayName: capitalizedDay,
      dateFormatted,
      shortDate,
      isToday: i === 0,
    });

    if (days.length >= 3) break;
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
