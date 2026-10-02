export type TicketStatus = "confirmed" | "checked_in" | "completed" | "cancelled" | "expired";

export interface MedicalTicket {
  id: string; // ej. "FICHA-2026-8912"
  tokenCode: string; // Código de seguridad corto ej. "C8912"
  hospitalId: string;
  hospitalName: string;
  specialtyId: string;
  specialtyName: string;
  doctorName: string;
  roomNumber: string;
  patientName: string;
  ci: string; // Cédula de Identidad con complemento ej. "6849201-LP"
  phone: string; // WhatsApp
  slotNumber: number; // Turno #04
  estimatedArrival: string; // "08:45 AM"
  estimatedConsultation: string; // "09:10 AM"
  status: TicketStatus;
  date: string; // "2026-10-03"
  createdAt: string; // ISO
  qrPayload: string; // Texto para codificar en QR de control
}

export interface BookingPayload {
  specialtyId: string;
  patientName: string;
  ci: string;
  phone: string;
}
