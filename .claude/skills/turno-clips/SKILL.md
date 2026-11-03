---
name: turno-clips
description: Turno de la PC que corre los Agentes 02 (Clipero) y 03 (Publicador) cuando la Legión se reparte entre dos PCs - baja de GitHub las oportunidades que subió la PC del Cazador Viral, ejecuta el Clipero y después el Publicador, y sube a GitHub sus carpetas. Va en la PC que tiene los videos y las credenciales de las plataformas. Pensado para /loop, desfasado del `/turno-cazador` de la otra PC, p. ej. `/loop 6h /turno-clips`.
---

# Turno del Clipero y el Publicador

Actúas como orquestador. No hagas el trabajo en este contexto. El Cazador Viral corre en la otra PC (`/turno-cazador`): aquí no lo lances nunca, ni con `/legion`, o las dos PCs se pisan la memoria del Cazador.

1. **Bajar lo último.** `git pull --rebase --autostash`. Si falla por red, sigue con las oportunidades que ya haya y dilo en el resumen. Si falla por un conflicto o un rebase a medias, para y explica el error.
2. **Clipero.** Lanza el subagente con la herramienta Agent:
   - `subagent_type`: `clipero`
   - `description`: `Ciclo clipero`
   - `prompt`: `Ejecuta un ciclo completo según tu procedimiento. El Cazador Viral corre en otra PC: sus oportunidades más recientes están en salidas/cazador-viral/oportunidades.json.`

   Si el tipo no está disponible, usa `general-purpose` con `Lee .claude/agents/clipero.md y actúa como ese agente: <el prompt de arriba>`. Espera a que termine. Si falla, lanza igualmente el paso 3, que publicará lo que ya estaba aprobado.
3. **Publicador.** Lanza el subagente con la herramienta Agent:
   - `subagent_type`: `publicador`
   - `description`: `Ciclo publicador`
   - `prompt`: `Ejecuta un ciclo completo según tu procedimiento. El Clipero acaba de terminar su ciclo: sus clips están en salidas/clipero/clips.json. Instrucción del usuario: ninguna.`

   Si el tipo no está disponible, usa `general-purpose` con `Lee .claude/agents/publicador.md y actúa como ese agente: <el prompt de arriba>`. Espera a que termine.
4. **Subir.** Solo las carpetas de estos dos agentes:
   - `git add datos/clipero salidas/clipero datos/publicador salidas/publicador`
   - `git commit -m "Clipero y Publicador: <lo más destacado, en pocas palabras>"`. Si no hay cambios, no hagas commit.
   - `git push`. Si lo rechaza porque la otra PC subió algo entretanto, `git pull --rebase --autostash` y `git push` otra vez. Si el rebase choca, `git rebase --abort`, no fuerces nada y avísalo.
5. **Resumen** para el usuario: hasta 5 líneas por agente, la ruta de cada informe, el comando para aprobar lo que quedó pendiente (`/publicador aprobar <clip-id>`) y si el push salió bien.
