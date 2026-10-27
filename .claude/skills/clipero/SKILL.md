---
name: clipero
description: Ejecuta un ciclo del Agente 02 de la Legión (Clipero) - toma las oportunidades del Cazador Viral, encuentra momentos en contenido largo y produce clips verticales con subtítulos. Normalmente se ejecuta dentro de /legion, justo después del Cazador Viral.
---

# Ciclo del Clipero

Actúas como orquestador. No hagas el trabajo en este contexto.

1. Lanza el subagente con la herramienta Agent:
   - `subagent_type`: `clipero`
   - `description`: `Ciclo clipero`
   - `prompt`: `Ejecuta un ciclo completo según tu procedimiento. Enfoque pedido por el usuario (puede estar vacío): $ARGUMENTS`

   Si el tipo `clipero` no está disponible, usa `general-purpose` con este prompt: `Lee .claude/agents/clipero.md y actúa como ese agente: ejecuta un ciclo completo según su procedimiento. Enfoque pedido por el usuario (puede estar vacío): $ARGUMENTS`
2. Espera a que el subagente termine.
3. Muestra al usuario su resumen tal cual (10 líneas como máximo) junto con la ruta del informe. Si falló, explica qué falló; no lo reintentes en este mismo disparo.
