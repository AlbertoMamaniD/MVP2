/**
 * Utilidades de formateo para fechas, horas y cédulas de identidad (Bolivia)
 */

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
