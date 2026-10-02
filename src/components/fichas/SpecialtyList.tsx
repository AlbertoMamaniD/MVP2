"use client";

import React, { useState, useMemo } from "react";
import { Specialty, QuotaStatus } from "@/types/specialty";
import { SpecialtyCard } from "./SpecialtyCard";
import { SearchIcon, CloseIcon } from "@/components/common/Icons";
import styles from "./SpecialtyList.module.css";

interface SpecialtyListProps {
  specialties: Specialty[];
  onBookSpecialty: (specialty: Specialty) => void;
  dayLabel?: string;
}

type FilterType = "all" | QuotaStatus;

const FILTERS: { id: FilterType; label: string; dot?: string }[] = [
  { id: "all", label: "Todas" },
  { id: "available", label: "Disponibles", dot: "ok" },
  { id: "few", label: "Últimos cupos", dot: "warn" },
  { id: "exhausted", label: "Agotadas", dot: "danger" },
];

export const SpecialtyList: React.FC<SpecialtyListProps> = ({ specialties, onBookSpecialty, dayLabel = "Hoy" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [openId, setOpenId] = useState<string | null>(null);

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
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon} aria-hidden="true">
            <SearchIcon size={20} />
          </span>
          <input
            type="search"
            aria-label="Buscar especialidad o médico"
            className={styles.searchInput}
            placeholder="Busca tu especialidad o médico"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className={styles.clearSearch} onClick={() => setSearchTerm("")} aria-label="Limpiar búsqueda">
              <CloseIcon size={16} />
            </button>
          )}
        </div>

        <div className={styles.filterTabs} role="group" aria-label="Filtrar por disponibilidad">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={activeFilter === f.id}
              className={`${styles.filterTab} ${activeFilter === f.id ? styles.activeTab : ""}`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.dot && <span className={`${styles.dot} ${styles[f.dot]}`} aria-hidden="true" />}
              {f.label} ({counts[f.id]})
            </button>
          ))}
        </div>
      </div>

      <p className={styles.summary}>
        {counts.available + counts.few} de {counts.all} especialidades tienen cupos. Toca una para ver el detalle.
      </p>

      {filteredSpecialties.length > 0 ? (
        <div className={styles.list}>
          {filteredSpecialties.map((spec) => (
            <SpecialtyCard
              key={spec.id}
              specialty={spec}
              onBook={onBookSpecialty}
              dayLabel={dayLabel}
              isOpen={openId === spec.id}
              onToggle={() => setOpenId(openId === spec.id ? null : spec.id)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <SearchIcon size={32} color="var(--brand)" />
          <h4>No encontramos esa especialidad</h4>
          <p>Prueba con otra palabra o cambia el filtro.</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setSearchTerm("");
              setActiveFilter("all");
            }}
          >
            Ver todas las especialidades
          </button>
        </div>
      )}
    </div>
  );
};
