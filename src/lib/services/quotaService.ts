import { QuotaStatus, Specialty } from "@/types/specialty";

export function calculateQuotaStatus(available: number): QuotaStatus {
  if (available <= 0) return "exhausted";
  if (available <= 3) return "few";
  return "available";
}

export function getQuotaStatusDetails(status: QuotaStatus, available: number) {
  switch (status) {
    case "available":
      return {
        label: `${available} cupos disponibles`,
        badgeText: "DISPONIBLE",
        variant: "success" as const,
        description: "Hay fichas libres para hoy. Puedes reservar tu hora sin madrugar.",
      };
    case "few":
      return {
        label: `¡Solo quedan ${available} cupo${available === 1 ? "" : "s"}!`,
        badgeText: "ÚLTIMOS CUPOS",
        variant: "warning" as const,
        description: "Alta demanda en esta especialidad. Reserva antes de que se agote.",
      };
    case "exhausted":
      return {
        label: "Cupos agotados por hoy",
        badgeText: "AGOTADO",
        variant: "danger" as const,
        description: "No madrugues ni te traslades al hospital; no habrá atención presencial adicional hoy.",
      };
  }
}
