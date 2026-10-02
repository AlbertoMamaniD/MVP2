export type QuotaStatus = "available" | "few" | "exhausted";

export interface Specialty {
  id: string;
  hospitalId: string;
  name: string; // ej. "Cardiología"
  code: string; // "CARD-01"
  doctorName: string;
  roomNumber: string; // "Consultorio 14"
  shift: "Mañana" | "Tarde";
  consultationStart: string; // "08:30"
  consultationEnd: string; // "12:30"
  slotDurationMinutes: number; // 20
  totalSlots: number; // ej. 15
  availableSlots: number; // ej. 3
  status: QuotaStatus;
  requirements: string[]; // ["Carnet de Identidad vigente", "Formulario de Referencia de Posta", "Carnet SUS"]
}
