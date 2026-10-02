"use client";

import React, { useState, useMemo } from "react";
import { Specialty, QuotaStatus } from "@/types/specialty";
import { SpecialtyCard } from "./SpecialtyCard";
import { SearchIcon, CloseIcon } from "@/components/common/Icons";
import styles from "./SpecialtyList.module.css";

interface SpecialtyListProps {
  specialties: Specialty[];
  onBookSpecialty: (specialty: Specialty) => void;
}

type FilterType = "all" | QuotaStatus;

export const SpecialtyList: React.FC<SpecialtyListProps> = ({ specialties, onBookSpecialty }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredSpecialties = useMemo(() => {
    return specialties.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = activeFilter === "all" || s.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [specialties, searchTerm, activeFilter]);

  const counts = useMemo(() => {
    return {
      all: specialties.length,
      available: specialties.filter((s) => s.status === "available").length,
      few: specialties.filter((s) => s.status === "few").length,
      exhausted: specialties.filter((s) => s.status === "exhausted").length,
    };
  }, [specialties]);

  return (
    <section className={styles.wrapper} aria-labelledby="specialties-title">
      <div className={styles.sectionHeader}>
        <h2 id="specialties-title" className={styles.sectionTitle}>Especialidades</h2>
        <p className={styles.sectionSummary}>
          {counts.available + counts.few} de {counts.all} con cupos para reservar
        </p>
      </div>

      {/* Controles de Búsqueda y Filtros */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon} aria-hidden="true">
            <SearchIcon size={18} />
          </span>
          <input
            type="search"
            aria-label="Buscar especialidad o médico"
            className={styles.searchInput}
            placeholder="Buscar especialidad o médico (ej. Traumatología, Cardiología, Pediatría)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className={styles.clearSearch} onClick={() => setSearchTerm("")} aria-label="Limpiar búsqueda">
              <CloseIcon size={14} />
            </button>
          )}
        </div>

        <div className={styles.filterTabs} role="group" aria-label="Filtrar por disponibilidad">
          <button
            className={`${styles.filterTab} ${activeFilter === "all" ? styles.activeTab : ""}`}
            aria-pressed={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          >
            Todas ({counts.all})
          </button>
          <button
            className={`${styles.filterTab} ${styles.availableTab} ${activeFilter === "available" ? styles.activeTab : ""}`}
            aria-pressed={activeFilter === "available"}
            onClick={() => setActiveFilter("available")}
          >
            <span className={styles.statusDotAvailable} /> Disponibles ({counts.available})
          </button>
          <button
            className={`${styles.filterTab} ${styles.fewTab} ${activeFilter === "few" ? styles.activeTab : ""}`}
            aria-pressed={activeFilter === "few"}
            onClick={() => setActiveFilter("few")}
          >
            <span className={styles.statusDotFew} /> Últimos Cupos ({counts.few})
          </button>
          <button
            className={`${styles.filterTab} ${styles.exhaustedTab} ${activeFilter === "exhausted" ? styles.activeTab : ""}`}
            aria-pressed={activeFilter === "exhausted"}
            onClick={() => setActiveFilter("exhausted")}
          >
            <span className={styles.statusDotExhausted} /> Agotados ({counts.exhausted})
          </button>
        </div>
      </div>

      {/* Grilla de Especialidades */}
      {filteredSpecialties.length > 0 ? (
        <div className={styles.grid}>
          {filteredSpecialties.map((spec) => (
            <SpecialtyCard key={spec.id} specialty={spec} onBook={onBookSpecialty} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon} aria-hidden="true">
            <SearchIcon size={36} color="var(--text-muted)" />
          </span>
          <h4>No se encontraron especialidades</h4>
          <p>Intenta con otro término de búsqueda o cambia el filtro de disponibilidad.</p>
        </div>
      )}
    </section>
  );
};
