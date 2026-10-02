import { MedicalTicket, BookingPayload } from "@/types/ticket";
import { Specialty } from "@/types/specialty";
import { Hospital } from "@/types/hospital";
import { MOCK_SPECIALTIES } from "@/lib/data/mockSpecialties";
import { MOCK_HOSPITALS } from "@/lib/data/mockHospitals";
import { calculateEstimatedArrival, normalizeCI } from "@/lib/utils/formatters";
import { calculateQuotaStatus } from "@/lib/services/quotaService";

const STORAGE_KEYS = {
  TICKETS: "fichaya_tickets_v1",
  SPECIALTIES: "fichaya_specialties_v1",
};

export class TicketService {
  // Obtener especialidades actuales (desde localStorage o mock inicial)
  static getSpecialties(hospitalId?: string): Specialty[] {
    if (typeof window === "undefined") {
      return hospitalId ? MOCK_SPECIALTIES.filter((s) => s.hospitalId === hospitalId) : MOCK_SPECIALTIES;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SPECIALTIES);
      let list: Specialty[] = stored ? JSON.parse(stored) : MOCK_SPECIALTIES;
      if (hospitalId) {
        list = list.filter((s) => s.hospitalId === hospitalId);
      }
      return list;
    } catch {
      return MOCK_SPECIALTIES;
    }
  }

  // Guardar especialidades actualizadas
  private static saveSpecialties(specialties: Specialty[]) {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.SPECIALTIES, JSON.stringify(specialties));
      } catch (e) {
        console.error("Error guardando especialidades:", e);
      }
    }
  }

  // Obtener todos los tickets
  static getAllTickets(): MedicalTicket[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TICKETS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Obtener ticket por ID o por token code
  static getTicketById(id: string): MedicalTicket | null {
    const tickets = this.getAllTickets();
    return tickets.find((t) => t.id === id || t.tokenCode.toUpperCase() === id.toUpperCase()) || null;
  }

  // Buscar tickets por Cédula de Identidad (CI)
  static getTicketsByCI(ci: string): MedicalTicket[] {
    const norm = normalizeCI(ci);
    return this.getAllTickets().filter((t) => normalizeCI(t.ci) === norm);
  }

  // Regla de Negocio: 1 ficha por CI por especialidad por día
  static hasActiveBooking(ci: string, specialtyId: string): boolean {
    const today = new Date().toISOString().split("T")[0];
    const norm = normalizeCI(ci);
    const tickets = this.getAllTickets();
    return tickets.some(
      (t) => normalizeCI(t.ci) === norm && t.specialtyId === specialtyId && t.date === today && t.status !== "cancelled"
    );
  }

  // Crear una nueva reserva / Ficha médica
  static createBooking(payload: BookingPayload): { success: boolean; ticket?: MedicalTicket; error?: string } {
    const normCI = normalizeCI(payload.ci);

    if (!normCI || normCI.length < 5) {
      return { success: false, error: "Por favor ingresa un Carnet de Identidad válido." };
    }

    if (!payload.patientName || payload.patientName.trim().length < 3) {
      return { success: false, error: "Por favor ingresa el nombre completo del paciente." };
    }

    // Regla anti-reventa: Un carnet no puede sacar 2 turnos para la misma especialidad el mismo día
    if (this.hasActiveBooking(normCI, payload.specialtyId)) {
      return {
        success: false,
        error: `El carnet ${normCI} ya tiene una ficha reservada hoy para esta especialidad. Cada paciente tiene derecho a 1 cupo por día.`,
      };
    }

    // Obtener y actualizar cupo
    const specialties = this.getSpecialties();
    const specIndex = specialties.findIndex((s) => s.id === payload.specialtyId);

    if (specIndex === -1) {
      return { success: false, error: "Especialidad no encontrada." };
    }

    const specialty = specialties[specIndex];
    if (specialty.availableSlots <= 0) {
      return {
        success: false,
        error: "Los cupos para esta especialidad se acaban de agotar. No madrugues ni te traslades hoy.",
      };
    }

    // Reducir cupo atómicamente
    specialty.availableSlots -= 1;
    specialty.status = calculateQuotaStatus(specialty.availableSlots);
    specialties[specIndex] = specialty;
    this.saveSpecialties(specialties);

    // Calcular turno y hora estimada
    const hospital = MOCK_HOSPITALS.find((h) => h.id === specialty.hospitalId) || MOCK_HOSPITALS[0];
    const slotNumber = specialty.totalSlots - specialty.availableSlots;
    const { arrival, consultation } = calculateEstimatedArrival(
      specialty.consultationStart,
      slotNumber,
      specialty.slotDurationMinutes
    );

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `FICHA-${new Date().getFullYear()}-${randomSuffix}`;
    const tokenCode = `BOL-${randomSuffix}`;

    const newTicket: MedicalTicket = {
      id: ticketId,
      tokenCode,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      specialtyId: specialty.id,
      specialtyName: specialty.name,
      doctorName: specialty.doctorName,
      roomNumber: specialty.roomNumber,
      patientName: payload.patientName.trim(),
      ci: normCI,
      phone: payload.phone.trim(),
      slotNumber,
      estimatedArrival: arrival,
      estimatedConsultation: consultation,
      status: "confirmed",
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      qrPayload: `FICHAYA|${ticketId}|${normCI}|${specialty.code}|${arrival}|${tokenCode}`,
    };

    // Guardar ticket
    const allTickets = this.getAllTickets();
    allTickets.unshift(newTicket);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(allTickets));
    }

    return { success: true, ticket: newTicket };
  }

  // Personal de Salud: Validar y marcar check-in de paciente
  static checkInTicket(ticketId: string): { success: boolean; ticket?: MedicalTicket; message: string } {
    const tickets = this.getAllTickets();
    const idx = tickets.findIndex((t) => t.id === ticketId || t.tokenCode === ticketId);

    if (idx === -1) {
      return { success: false, message: "Ficha médica no encontrada en el sistema." };
    }

    tickets[idx].status = "checked_in";
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    }

    return { success: true, ticket: tickets[idx], message: "Ingreso confirmado. Paciente derivado a sala de espera." };
  }

  // Reiniciar datos de prueba a su estado original
  static resetToDefault() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.TICKETS);
      localStorage.removeItem(STORAGE_KEYS.SPECIALTIES);
    }
  }
}
