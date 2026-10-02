import { MedicalTicket } from "@/types/ticket";

export function generateWhatsAppMessage(ticket: MedicalTicket): string {
  const text = `*SISTEMA ÚNICO DE SALUD (SUS) · BOLIVIA*
*COMPROBANTE OFICIAL DE FICHA MÉDICA*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Hospital: ${ticket.hospitalName}
• Especialidad: ${ticket.specialtyName}
• Médico: ${ticket.doctorName}
• Consultorio: ${ticket.roomNumber}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• TURNO ASIGNADO: #${ticket.slotNumber.toString().padStart(2, "0")}
• Paciente: ${ticket.patientName} (CI: ${ticket.ci})
• HORA SUGERIDA DE LLEGADA: ${ticket.estimatedArrival}
• Hora Estimada Consulta: ${ticket.estimatedConsultation}
• Código de Validación: ${ticket.tokenCode}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*AVISO OFICIAL:* Su turno está reservado en el sistema hospitalario. No madrugue a las 4:00 AM en el frío. Preséntese 15 minutos antes directamente en el consultorio portando su Carnet de Identidad físico.`;

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
