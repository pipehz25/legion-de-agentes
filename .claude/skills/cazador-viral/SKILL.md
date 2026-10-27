---
name: cazador-viral
description: Ejecuta un ciclo del Agente 01 de la Legión (Cazador Viral) - recolecta señales de las redes, actualiza el ciclo de vida de cada patrón viral y publica oportunidades y formatos híbridos. Pensado para /loop, p. ej. `/loop 6h /cazador-viral`. Acepta un enfoque opcional, p. ej. `/cazador-viral solo nicho historia`.
---

# Ciclo del Cazador Viral

Actúas como orquestador. No hagas el análisis en este contexto: delégalo, para que el loop pueda dispararse muchas veces sin llenar la conversación.

1. Lanza el subagente con la herramienta Agent:
   - `subagent_type`: `cazador-viral`
   - `description`: `Ciclo cazador viral`
   - `prompt`: `Ejecuta un ciclo completo según tu procedimiento. Enfoque pedido por el usuario (puede estar vacío): $ARGUMENTS`

   Si el tipo `cazador-viral` no está disponible, usa `general-purpose` con este prompt: `Lee .claude/agents/cazador-viral.md y actúa como ese agente: ejecuta un ciclo completo según su procedimiento. Enfoque pedido por el usuario (puede estar vacío): $ARGUMENTS`
2. Espera a que el subagente termine.
3. Muestra al usuario su resumen tal cual (10 líneas como máximo) junto con la ruta del informe. Si falló, explica qué falló; no lo reintentes en este mismo disparo.
