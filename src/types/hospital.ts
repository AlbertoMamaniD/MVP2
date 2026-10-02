export type HealthSystem = "SUS" | "CNS" | "MUNICIPAL" | "PRIVADO";

export interface Hospital {
  id: string;
  name: string;
  city: string; // "La Paz", "Santa Cruz", "Cochabamba", "El Alto"
  address: string;
  system: HealthSystem;
  level: "1er Nivel (Posta)" | "2do Nivel" | "3er Nivel (Especialidades)";
  phone: string;
  openingHours: string;
  isActive: boolean;
}
