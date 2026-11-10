---
name: legion
description: Ejecuta la cadena completa de la Legión en orden, en la PC de Felipe - baja lo último de GitHub; 01 Cazador Urbano; 04 Cazador de Risas; 02 Clipero, que corta las fuentes de los dos; 03 Publicador, que reparte los clips entre las cuentas de cada línea; y sube todo a GitHub. Pensado para /loop, p. ej. `/loop 6h /legion`. Acepta un enfoque opcional que se pasa a los dos cazadores.
---

# Cadena de la Legión

Actúas como orquestador. Ejecuta los agentes **en orden, uno detrás de otro**, cada uno como subagente con la herramienta Agent. No hagas su trabajo en este contexto.

**0. Antes de empezar**
- Usa Bash para `git pull --rebase --autostash`. Si falla por un conflicto o un rebase a medias, para y explica el error.
- Si sigue trabajando un turno anterior, no lances nada y termina con un aviso corto. Se nota porque `salidas/clipero/clips.json` o `datos/clipero/estado.json` se modificaron hace menos de 15 min, o porque hay procesos `yt-dlp`, `ffmpeg` o `whisper-cli` activos.

**Pasos**

| Paso | `subagent_type` | `prompt` |
|------|-----------------|----------|
| 1 | `cazador-viral` | `Ejecuta un ciclo completo según tu procedimiento. Enfoque pedido por el usuario (puede estar vacío): $ARGUMENTS` |
| 2 | `cazador-risas` | `Ejecuta un ciclo completo según tu procedimiento. Enfoque pedido por el usuario (puede estar vacío): $ARGUMENTS` |
| 3 | `clipero` | `Ejecuta un ciclo completo según tu procedimiento. Los dos cazadores acaban de terminar: sus fuentes están en salidas/cazador-viral/oportunidades.json (línea urbano) y salidas/cazador-risas/oportunidades.json (línea risas).` |
| 4 | `publicador` | `Ejecuta un ciclo completo según tu procedimiento. El Clipero acaba de terminar su ciclo: sus clips están en salidas/clipero/clips.json. Instrucción del usuario: ninguna.` |

**5. Subir a GitHub**, con Bash:
- `git add datos/cazador-viral salidas/cazador-viral datos/cazador-risas salidas/cazador-risas datos/clipero salidas/clipero datos/publicador salidas/publicador`
- Commit con el mensaje `Legion: <lo más destacado del turno, en pocas palabras>` y el pie de coautoría de la sesión. Si no hay cambios, no hagas commit.
- `git push`. Si lo rechaza porque Santiago subió algo entretanto, `git pull --rebase --autostash` y `git push` otra vez. Si el rebase choca, `git rebase --abort`, no fuerces nada y avísalo.

**Reglas**
- No lances un paso hasta que el anterior haya terminado.
- Si falla un cazador, sigue con el siguiente paso: el Clipero trabajará con las últimas fuentes disponibles. Dilo en el resumen.
- Si el paso 3 falla, lanza igualmente el paso 4, que publicará lo que ya estaba aprobado.
- Si un tipo de subagente no está disponible, usa `general-purpose` con el prompt `Lee .claude/agents/<tipo>.md y actúa como ese agente: <prompt del paso>`.
- Al terminar, muestra un solo resumen en español:
  - Hasta 4 líneas por agente y la ruta de cada informe.
  - Los clips nuevos listos para subir, por línea (urbano y risas): id, puntaje, ventana y si sale el perfil en persona.
  - Lo que hay que escuchar o ver antes de publicar.
  - El comando para aprobar lo pendiente (`/publicador aprobar <clip-id>`).
  - Si el push salió bien.
