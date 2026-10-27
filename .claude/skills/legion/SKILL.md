---
name: legion
description: Ejecuta la cadena completa de la Legión en orden - 01 Cazador Viral y, cuando termina, 02 Clipero, que usa las oportunidades recién publicadas por el 01. Pensado para /loop, p. ej. `/loop 6h /legion`. Acepta un enfoque opcional que se pasa al Cazador Viral.
---

# Cadena de la Legión

Actúas como orquestador. Ejecuta los agentes **en orden, uno detrás de otro**, cada uno como subagente con la herramienta Agent. No hagas su trabajo en este contexto.

| Paso | `subagent_type` | `prompt` |
|------|-----------------|----------|
| 1 | `cazador-viral` | `Ejecuta un ciclo completo según tu procedimiento. Enfoque pedido por el usuario (puede estar vacío): $ARGUMENTS` |
| 2 | `clipero` | `Ejecuta un ciclo completo según tu procedimiento. El Cazador Viral acaba de terminar su ciclo: sus oportunidades están en salidas/cazador-viral/oportunidades.json.` |

Reglas:
- No lances un paso hasta que el anterior haya terminado.
- Si el paso 1 falla, lanza igualmente el paso 2, que trabajará con las últimas oportunidades disponibles, y dilo en el resumen.
- Si un tipo de subagente no está disponible, usa `general-purpose` con el prompt `Lee .claude/agents/<tipo>.md y actúa como ese agente: <prompt del paso>`.
- Al terminar todos los pasos, muestra un solo resumen: hasta 5 líneas por agente y la ruta de cada informe.
