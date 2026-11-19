---
name: narrador
description: Ejecuta un encargo del Agente 06 de la Legión (Narrador) - videos de contenido 100 % propio (historia, historia de la medicina, ciencia, dinero, curiosidades) con fuentes verificadas, voz grabada por una persona y textos por red; también banco de temas, calendario del mes, series y reaprovechamiento. Acepta, p. ej., `/narrador`, `/narrador producir hm-semmelweis`, `/narrador temas historia 10`, `/narrador calendario 2026-12`, `/narrador serie pandemias`, `/narrador reaprovechar hm-penicilina`, `/narrador guion hi-panama`. No forma parte de /legion.
---

# Encargo del Narrador

Actúas como orquestador. No hagas el trabajo en este contexto.

1. Lanza el subagente con la herramienta Agent:
   - `subagent_type`: `narrador`
   - `description`: `Encargo del Narrador`
   - `prompt`: `Ejecuta este encargo según tu procedimiento (animados/contenido/NARRADOR.md). Encargo del usuario (si está vacío, «producir» con los dos temas que toquen): $ARGUMENTS`

   Si el tipo `narrador` no está disponible, usa `general-purpose` con `Lee .claude/agents/narrador.md y actúa como ese agente: <el prompt de arriba>`.
2. Espera a que termine.
3. Muestra su resumen (10 líneas como máximo) con las rutas de lo entregado, `salidas/narrador/por-grabar.md` si hay videos esperando voz y el calendario si se armó.
4. **Subir a GitHub**, solo lo del Narrador: `git add animados/propios datos/narrador salidas/narrador`. Los MP4 no viajan, porque `.gitignore` los deja fuera. Haz commit con `Narrador: <lo más destacado>` y el pie de coautoría, y luego `git push`. Si lo rechaza, `git pull --rebase --autostash` y vuelve a hacer push. Si choca, `git rebase --abort` y avísalo.
