Fila por especialidad que muestra, antes de salir de casa, si quedan cupos.

- **Disponible:** `state-ok` sobre `state-ok-bg`.
- **Últimos cupos:** `state-warn` sobre `state-warn-bg`.
- **Agotado:** `state-danger` sobre `state-danger-bg`. La fila pasa a texto `muted` y sugiere otro día.

Cada estado combina color, punto y palabra, así que no depende de distinguir colores. El semáforo es la única parte de la app que usa verde, amarillo y rojo. Quien lo usa aporta la especialidad, el día y el número de cupos; en el MVP son datos de ejemplo, no conexión real con un hospital.
