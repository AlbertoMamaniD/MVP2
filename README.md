# FichaYa Bolivia · Sistema de Turnos y Semáforo de Fichas Hospitalarias

> **Solución MVP contra las filas de madrugada en hospitales públicos de Bolivia (SUS, Cajas de Salud y Hospitales de 2do y 3er Nivel).**

---

## 🎯 El Problema que Resolvemos
En Bolivia (Hospital de Clínicas, Viedma, San Juan de Dios, Hospital del Norte), cientos de personas de escasos recursos madrugan a las **3:00 - 4:00 AM** soportando frío intenso y peligro de asaltos para conseguir una "ficha médica".

La incertidumbre es total: los cupos para especialidades son muy limitados e invisibles. La gente se entera de que ya no hay cupos recién tras 4 o 5 horas en la fila al llegar a ventanilla, desatando peleas, frustración y mafias de venta de puestos en la calle.

---

## 💡 La Solución
1. **Semáforo de Cupos en Vivo:** El paciente o familiar puede revisar desde su casa antes de salir si hay cupos disponibles (`🟢 Disponible`, `🟡 Últimos Cupos`, `🔴 Agotado`).
2. **Reserva Directa con Carnet de Identidad (CI):** Sin registros complejos ni contraseñas. El cupo queda vinculado al CI para evitar reventa o acaparamiento (máximo 1 ficha por carnet al día).
3. **Pase Médico Digital Anti-Madrugadas:** El paciente recibe un ticket digital con su hora estimada de llegada sugerida (ej. *08:45 AM*). Solo debe presentarse 15 minutos antes.
4. **Compartir por WhatsApp:** Envío inmediato del ticket con código de verificación por WhatsApp.
5. **Panel de Control de Ventanilla:** Módulo para el personal médico y de admisión para validar carnets y marcar el ingreso del paciente a sala de espera.

---

## 📁 Arquitectura Limpia y Modular

El proyecto está diseñado desacoplando completamente la lógica de negocio, los estilos y la interfaz para máxima versatilidad y facilidad de mantenimiento:

```
src/
├── types/                       # 1. Definición estricta de tipos de dominio (TypeScript)
│   ├── hospital.ts              # Red de hospitales y centros de salud
│   ├── specialty.ts             # Especialidades, médicos, consultorios y estados de cupo
│   └── ticket.ts                # Ficha médica, paciente, estado y payload
│
├── lib/                         # 2. Capa de Lógica de Negocio (Separada de la UI)
│   ├── data/
│   │   ├── mockHospitals.ts     # Hospitales de La Paz, Santa Cruz, Cochabamba y El Alto
│   │   └── mockSpecialties.ts   # Datos iniciales con cupos reales y médicos
│   ├── services/
│   │   ├── ticketService.ts     # Reglas anti-reventa, decremento de cupos, persistencia
│   │   └── quotaService.ts      # Cálculo de semáforo de disponibilidad
│   ├── utils/
│   │   ├── formatters.ts        # Cálculo de hora estimada de llegada y normalización de CI
│   │   └── whatsapp.ts          # Generador de enlaces y mensajes oficiales de WhatsApp
│   └── hooks/
│       └── useTickets.ts        # Hook reactivo para sincronizar estado en tiempo real
│
├── components/                  # 3. Componentes de UI Modulares
│   ├── common/                  # Componentes reutilizables
│   │   ├── Header.tsx           # Barra superior con fecha y enlaces
│   │   ├── Footer.tsx           # Pie de página informativo del SUS
│   │   ├── Badge.tsx            # Etiquetas de estado de cupos
│   │   └── Modal.tsx            # Diálogos accesibles
│   ├── fichas/                  # Dominio de Fichas para Pacientes
│   │   ├── HospitalSelector.tsx # Selector de hospital
│   │   ├── LiveQuotaBanner.tsx  # Banner de concientización y contador de cupos
│   │   ├── SpecialtyList.tsx    # Búsqueda y filtrado de especialidades
│   │   ├── SpecialtyCard.tsx    # Tarjeta de especialidad con semáforo y CTA
│   │   ├── BookingModal.tsx     # Formulario de reserva con Carnet de Identidad
│   │   └── DigitalPass.tsx      # Pase médico estilo boarding pass con QR
│   └── staff/                   # Dominio para Personal de Salud
│       └── ValidationScanner.tsx# Buscador de carnets y confirmación de ingreso
│
├── styles/                      # 4. Sistema de Diseño (CSS Puro y CSS Modules)
│   ├── tokens.css               # Variables de color (alto contraste), sombras y radios
│   ├── globals.css              # Reset, fuentes modernas y animaciones suaves
│   └── *.module.css             # Estilos encapsulados por componente
│
└── app/                         # 5. Next.js App Router
    ├── layout.tsx               # Layout global
    ├── page.tsx                 # Semáforo en vivo y flujo de reserva
    ├── ticket/[id]/page.tsx     # Vista directa para compartir o imprimir ticket
    └── personal/page.tsx        # Módulo de ventanilla / admisión hospitalaria
```

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

```bash
# 1. Instalar dependencias (si no se han instalado)
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir en el navegador
# http://localhost:3000 -> Semáforo de Fichas (Paciente)
# http://localhost:3000/personal -> Panel de Admisión (Personal de Salud)
```

---

## 📤 Para Subir al Repositorio (Git)

```bash
git add .
git commit -m "feat: arquitectura limpia para sistema de fichas medicas en Next.js"
git remote add origin <URL_DE_TU_REPOSITORIO>
git branch -M main
git push -u origin main
```
