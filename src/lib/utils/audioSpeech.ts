/**
 * Utilidad de síntesis de voz accesible en español (Bolivia / Latinoamérica)
 * para adultos mayores y personas con dificultades de lectura.
 */

export function speakMessage(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  // Cancelar locuciones previas si las hay
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-419"; // Español Latinoamericano
  utterance.rate = 0.92; // Velocidad pausada y clara para adultos mayores
  utterance.pitch = 1.0;

  // Buscar voz en español disponible en el navegador
  const voices = window.speechSynthesis.getVoices();
  const spanishVoice = voices.find(
    (v) => v.lang.startsWith("es") || v.lang.includes("BO") || v.lang.includes("ES")
  );
  if (spanishVoice) {
    utterance.voice = spanishVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
