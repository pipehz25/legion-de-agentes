---
name: turno-cazador
description: Turno de la PC que corre el Agente 01 (Cazador Viral) cuando la Legión se reparte entre dos PCs - baja lo último de GitHub, ejecuta un ciclo del Cazador Viral y sube a GitHub solo sus carpetas, para que la otra PC corra el Clipero y el Publicador con las oportunidades nuevas. Pensado para /loop, p. ej. `/loop 6h /turno-cazador`. Acepta un enfoque opcional que se pasa al Cazador Viral.
---

# Turno del Cazador Viral

Actúas como orquestador. No hagas el análisis en este contexto. La otra PC corre `/turno-clips` (Clipero y Publicador) y lee lo que subas aquí.

1. **Bajar lo último.** `git pull --rebase --autostash`. Si falla (sin red, conflicto o rebase a medias), no sigas: explica el error y para. Correr el Cazador sobre una memoria vieja haría que su push choque después.
2. **Ciclo.** Lanza el subagente con la herramienta Agent:
   - `subagent_type`: `cazador-viral`
   - `description`: `Ciclo cazador viral`
   - `prompt`: `Ejecuta un ciclo completo según tu procedimiento. Enfoque pedido por el usuario (puede estar vacío): $ARGUMENTS`

   Si el tipo `cazador-viral` no está disponible, usa `general-purpose` con este prompt: `Lee .claude/agents/cazador-viral.md y actúa como ese agente: ejecuta un ciclo completo según su procedimiento. Enfoque pedido por el usuario (puede estar vacío): $ARGUMENTS`

   Espera a que termine. Si falla, no subas nada y salta al paso 4.
3. **Subir.** Solo las carpetas del Cazador, nunca las de otro agente:
   - `git add datos/cazador-viral salidas/cazador-viral`
   - `git commit -m "Cazador: ciclo <N> (<lo más destacado, en pocas palabras>)"`, con `<N>` el campo `ciclo` de `datos/cazador-viral/patrones.json`. Si no hay cambios, no hagas commit.
   - `git push`. Si lo rechaza porque la otra PC subió algo entretanto, `git pull --rebase --autostash` y `git push` otra vez. Si el rebase choca en archivos del Cazador, otra PC está corriendo el Cazador: `git rebase --abort`, no fuerces nada y avísalo.
4. **Resumen** para el usuario: el resumen del subagente tal cual (10 líneas como máximo), la ruta del informe y si el push salió bien. No reintentes el ciclo en este mismo disparo.
