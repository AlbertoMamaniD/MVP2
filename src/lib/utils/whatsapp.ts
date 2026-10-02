import { MedicalTicket } from "@/types/ticket";

export function generateWhatsAppMessage(ticket: MedicalTicket): string {
  const text = `🏥 *PASE MÉDICO DIGITAL (NO MADRUGAR)* 🏥
━━━━━━━━━━━━━━━━━━━━
📌 *Hospital:* ${ticket.hospitalName}
🩺 *Especialidad:* ${ticket.specialtyName}
👨‍⚕️ *Médico:* ${ticket.doctorName}
📍 *Lugar:* ${ticket.roomNumber}
━━━━━━━━━━━━━━━━━━━━
🎟️ *Turno:* #${ticket.slotNumber.toString().padStart(2, "0")}
👤 *Paciente:* ${ticket.patientName} (CI: ${ticket.ci})
⏰ *Hora de Llegada:* ${ticket.estimatedArrival}
⏱️ *Hora Consulta:* ${ticket.estimatedConsultation}
🔐 *Código:* ${ticket.tokenCode}
━━━━━━━━━━━━━━━━━━━━
⚠️ *Tu ficha está reservada.* No hagas fila en la madrugada. Llega 15 minutos antes con tu Cédula de Identidad.`;

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
