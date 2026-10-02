import { MedicalTicket } from "@/types/ticket";

export function generateWhatsAppMessage(ticket: MedicalTicket): string {
  const text = `*Tu ficha Sinfi está reservada*

*${ticket.specialtyName}*
${ticket.hospitalName}

Turno: *${ticket.slotNumber}*
Llega a las: *${ticket.estimatedArrival}*
Consulta cerca de las: ${ticket.estimatedConsultation}
Te atiende: ${ticket.doctorName}
Dónde: ${ticket.roomNumber}

Paciente: ${ticket.patientName}
Carnet: ${ticket.ci}
Código: *${ticket.tokenCode}*

No necesitas madrugar. Preséntate 15 minutos antes con tu carnet y muestra este código en ventanilla.`;

  return encodeURIComponent(text);
}

export function getWhatsAppShareUrl(ticket: MedicalTicket, customPhone?: string): string {
  const encoded = generateWhatsAppMessage(ticket);
  if (customPhone) {
    const cleanPhone = customPhone.replace(/\D/g, "");
    const fullPhone = cleanPhone.startsWith("591") ? cleanPhone : `591${cleanPhone}`;
    return `https://wa.me/${fullPhone}?text=${encoded}`;
  }
  return `https://api.whatsapp.com/send?text=${encoded}`;
}
