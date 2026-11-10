---
name: cazador-risas
description: Ejecuta un ciclo del Agente 04 de la Legión (Cazador de Risas) - rastrea comedia, stand-up, humoristas y momentos graciosos de la política colombiana y publica fuentes para clips de la línea "risas". Normalmente corre dentro de /legion, después del Cazador Urbano. Acepta un enfoque opcional, p. ej. `/cazador-risas solo stand-up`.
---

Lanza el subagente con la herramienta Agent:
- `subagent_type`: `cazador-risas`
- `description`: `Ciclo cazador de risas`
- `prompt`: `Ejecuta un ciclo completo según tu procedimiento. Enfoque pedido por el usuario (puede estar vacío): $ARGUMENTS`

Si el tipo no está disponible, usa `general-purpose` con `Lee .claude/agents/cazador-risas.md y actúa como ese agente: <el prompt de arriba>`.

No hagas su trabajo en este contexto. Al terminar, muestra su respuesta final tal cual (10 líneas como máximo) y la ruta del informe.
