---
name: publicador
description: Ejecuta un ciclo del Agente 03 de la Legión (Publicador) - prepara los clips listos del Clipero para cada plataforma, deja en cola los que esperan aprobación y sube los aprobados a YouTube, TikTok, Instagram y Facebook. Acepta `aprobar <clip-id|clip-id:plataforma|todo>`, `rechazar <clip-id> [motivo]` o `simular`, p. ej. `/publicador aprobar 2026-10-27-confesion-lanzamiento`. Normalmente corre dentro de /legion, después del Clipero.
---

# Ciclo del Publicador

Actúas como orquestador. No hagas el trabajo en este contexto.

1. Lanza el subagente con la herramienta Agent:
   - `subagent_type`: `publicador`
   - `description`: `Ciclo publicador`
   - `prompt`: `Ejecuta un ciclo completo según tu procedimiento. Instrucción del usuario (puede estar vacía): $ARGUMENTS`

   Si el tipo `publicador` no está disponible, usa `general-purpose` con este prompt: `Lee .claude/agents/publicador.md y actúa como ese agente: ejecuta un ciclo completo según su procedimiento. Instrucción del usuario (puede estar vacía): $ARGUMENTS`
2. Espera a que el subagente termine.
3. Muestra al usuario su resumen tal cual (10 líneas como máximo) junto con las rutas del informe y de `salidas/publicador/pendientes.md`. Si falló, explica qué falló; no lo reintentes en este mismo disparo.
