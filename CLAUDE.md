# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

FichaYa Bolivia: an MVP for booking hospital appointment slots ("fichas") in Bolivian public hospitals so patients don't queue at dawn. Patients check a live quota "traffic light", book with their Carnet de Identidad (CI), and get a digital pass. Staff validate CIs and check patients in at `/personal`. All UI text, comments and domain names are in Spanish; keep new user-facing copy in Spanish (`es-BO` locale).

Stack: Next.js 16 (App Router), React 19, TypeScript (strict), plain CSS Modules. No Tailwind, no other runtime dependencies, no test framework.

## Commands

```bash
npm install
npm run dev      # http://localhost:3000 (patient view), /personal (staff panel)
npm run build    # production build; also the type check
npm run lint     # eslint (flat config, next core-web-vitals + typescript)
```

There are no tests.

## Architecture

**There is no backend.** All state lives in the browser's `localStorage`, accessed only through the static class `TicketService` (`src/lib/services/ticketService.ts`):
- `fichaya_specialties_v1`: the specialty list with live `availableSlots`. It is seeded from `MOCK_SPECIALTIES` and only read from storage after the first booking writes it. Once written, edits to `src/lib/data/mockSpecialties.ts` won't appear until storage is cleared (the "reset" action in `/personal` calls `resetToDefault()`), or until you bump the key version.
- `fichaya_tickets_v1`: every booked `MedicalTicket`, newest first.

Data flow: page → `useTickets(hospitalId)` hook (`src/lib/hooks/useTickets.ts`) → `TicketService` → localStorage. The hook re-reads everything through `refreshData()` after each mutation. Nothing syncs across tabs or devices, so the "live" quotas only exist on one browser.

Because state comes from `localStorage`, every page is a `"use client"` component and guards rendering with a `mounted` flag or a loading state to avoid hydration mismatches. Keep that pattern when you add pages that read service data.

Domain rules live in the services, not in components:
- `ticketService.createBooking`: validates the CI (normalized with `normalizeCI`, length ≥ 5) and the patient name, and enforces the anti-resale rule of one active ticket per CI per specialty per day (`hasActiveBooking`). It then decrements the slot count, derives `slotNumber` as `totalSlots - availableSlots`, and computes arrival time as consultation time minus 15 minutes (`calculateEstimatedArrival` in `src/lib/utils/formatters.ts`). Finally it builds the ticket ID (`FICHA-YYYY-NNNN`), the token (`BOL-NNNN`) and a pipe-delimited `qrPayload`.
- `quotaService.calculateQuotaStatus`: maps slot counts to the traffic light: `exhausted` at ≤ 0, `few` at ≤ 3, otherwise `available`. `getQuotaStatusDetails` supplies the labels and badge variants.
- Tickets can be looked up by `id` or by `tokenCode` (`/ticket/[id]` accepts either).

Known quirks to be aware of:
- `getSpecialties(hospitalId)` falls back to cloning *all* specialties with the requested `hospitalId` when a hospital has no specialties of its own, but `createBooking` looks up the unfiltered list. A ticket booked at such a hospital therefore gets the original specialty's hospital.
- The calendar (`DaySelector`) offers the next 14 days from `getAvailableDays()`, without Sundays. The chosen date travels in `BookingPayload.date` and is stamped on the ticket, but quotas are not tracked per day: every day shows the same `availableSlots`. Dates are built with `toLocalIsoDate` because `toISOString()` is UTC and shifts the day in Bolivia (UTC-4).
- The default hospital is `hrsjdd-tarija` on the home page but `hosp-clinicas-lp` in `useTickets`. The staff panel calls `useTickets()` with no argument.

## Code layout conventions

- Path alias `@/*` → `src/*`.
- Domain types live in `src/types/` (`hospital`, `specialty`, `ticket`); mock seed data lives in `src/lib/data/`.
- Components are grouped by audience: `common/` (Header, Footer, Badge, Modal), `fichas/` (patient flow) and `staff/` (validation scanner). Each component has a sibling `*.module.css`.
- **Design system: Sinfi** (`design/sinfi-design-system/`, source of truth: `tokens.json` and each component `README.md`). Tokens are mirrored in `src/styles/tokens.css`: `--bg`, `--surface`, `--brand` (#000080), `--on-brand`, `--ink`, `--muted`, `--line`, `--state-*`, the `--type-*` font shorthands, `--space-*`, `--radius-*` and `--shadow-card`. Rules: only navy and bluish white as brand colors; green, amber and red (`--state-*`) only for the quota traffic light, always with a dot and a word; 17px base text; buttons 52px tall, one primary action per screen (global `.btn .btn-primary` / `.btn-secondary` in `globals.css`); the notched ticket is the only graphic motif. Copy uses tuteo, short sentences, "ficha" not "ticket". The old token names (`--primary-*`, `--text-*`, `--border-*`) remain only as aliases for older components.
- Fonts (Plus Jakarta Sans for headings, Inter for body) are loaded with `next/font` in `src/app/layout.tsx`, which sets `--font-heading` and `--font-sans` on `<html>`. In CSS, use `--font-display` and `--font-text` from `tokens.css`. Never redefine `--font-sans` or `--font-heading` in terms of themselves: a self-referencing custom property is invalid and the page falls back to serif.
- The logo is the `Logo` component (`src/components/common/Logo.tsx`, SVG rebuilt from the official JPG). The favicon is `src/app/icon.jpg` / `apple-icon.jpg`.
- WhatsApp sharing links are built in `src/lib/utils/whatsapp.ts`: `wa.me/<phone>` when a phone number is present, otherwise `api.whatsapp.com/send`.
