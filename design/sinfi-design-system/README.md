# Sinfi

Sinfi es una web móvil para reservar la ficha médica desde el celular y atenderse a tiempo en hospitales públicos de Bolivia. Propuesta de valor: **Atender a tiempo**. Slogan: **Sin filas**.

Este sistema de diseño cubre el MVP: semáforo de cupos, reserva con carnet, ficha digital con QR y panel de ventanilla. Quien usa la app es un adulto mayor, una madre con niños o un trabajador, con celular y WhatsApp pero poca habilidad digital. Su prueba de éxito: sacar la ficha sin ayuda en menos de 2 minutos.

## Fundamentos de contenido

La marca habla en cuatro pasos: nombra el dolor, lo valida, se hace cargo y entrega la solución con su razón.

1. Nombra el dolor: "3 de la mañana. Frío. Una fila donde no sabes si te va a alcanzar."
2. Lo valida: "Eso no está bien. Nadie debería pasar por eso para que lo atiendan."
3. Se hace cargo: "Lo anotamos: cada madrugada perdida es un problema nuestro."
4. Solución y por qué: "Por eso existe Sinfi: ves tu cupo antes de salir, tienes una hora de llegada y nadie te quita tu lugar."

Reglas de escritura en la app y en los mensajes:

- Tuteo siempre ("Elige tu especialidad", no "Seleccione").
- Frases cortas. Una instrucción por pantalla.
- Cero jerga digital: "ficha", no "ticket"; "carnet", no "ID".
- Empática al abrir, directa al cerrar.
- El paciente nunca paga ni ve precios.

## Fundamentos visuales

- **Dos colores y nada más:** azul marino `brand` (#000080) y blanco azulado `bg` (#F0F4F8). El contraste entre ambos supera 14:1.
- **Semáforo solo como señal:** verde, amarillo y rojo (`state-*`) aparecen únicamente para decir cuántos cupos quedan. Nunca decoran, y siempre llevan texto al lado ("Disponible", "Últimos cupos", "Agotado"), para que no dependan del color.
- **Tipografía:** Plus Jakarta Sans para títulos, Inter para texto. El texto base es de 17px, más grande que lo habitual.
- **Botones grandes:** alto mínimo de 52px y ancho completo en el celular. Un botón principal por pantalla.
- **Formas:** esquinas redondeadas (`radius-md` y `radius-lg`) y la muesca de ficha como único motivo.

## Iconografía y logo

El logo es una ficha con muesca, tipo boarding pass, con un check adentro, y la palabra "sinfi" en minúsculas. Hay tres versiones: principal (azul sobre claro), invertida (claro sobre azul) e ícono solo, para favicon y foto de WhatsApp. Ver el componente Logo y el grupo de assets Logos.

Íconos: trazo simple de 2px, sin relleno, con esquinas redondeadas. El check es el ícono principal.

## Componentes

- **Logo:** las tres versiones.
- **Boton:** principal, secundario y deshabilitado.
- **SemaforoCupos:** cupos por especialidad y día.
- **FichaDigital:** turno, día, hora de llegada y código QR.

## Reglas de uso

- Texto sobre `bg` o `surface`: `ink`. Sobre `brand`: `on-brand`.
- Cada pantalla tiene una sola acción principal, en `brand`.
- No introducir más colores de marca. El azul y el blanco azulado son la marca.
- Los estados del semáforo siempre combinan color, punto y palabra.

## Pendiente

- Faltan la versión invertida oficial y archivos con fondo transparente (SVG o PNG). El logo principal y el ícono ya son los oficiales (JPG).
- Panel de ventanilla: validar carnet y marcar ingreso. Aún sin componente.
