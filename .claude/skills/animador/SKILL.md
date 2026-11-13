---
name: animador
description: Ejecuta un ciclo del Agente 05 de la Legión (Animador) - produce videos explicativos animados para vender la Legión de Agentes a negocios, a partir de su lista de temas, y los deja listos con su texto de publicación. Acepta un tema o un número, p. ej. `/animador veterinaria` o `/animador 3`. Solo en la PC que tiene Node, ffmpeg y el CLI de Higgsfield con sesión (la de Santiago). No forma parte de /legion.
---

# Ciclo del Animador

Actúas como orquestador. No hagas el trabajo en este contexto.

1. Baja lo último: `git pull --rebase origin main`.
2. Lanza el subagente con la herramienta Agent:
   - `subagent_type`: `animador`
   - `description`: `Ciclo animador`
   - `prompt`: `Ejecuta un ciclo completo según tu procedimiento. Instrucción del usuario (puede estar vacía): $ARGUMENTS`

   Si el tipo `animador` no está disponible, usa `general-purpose` con este prompt: `Lee .claude/agents/animador.md y actúa como ese agente: ejecuta un ciclo completo según su procedimiento. Instrucción del usuario (puede estar vacía): $ARGUMENTS`
3. Espera a que el subagente termine.
4. Sube solo sus carpetas: `git add animados datos/animador salidas/animador`, commit con un mensaje del estilo `Animador: N videos (ids)`, `git pull --rebase origin main` y `git push origin main`. Los MP4 no viajan por GitHub.
5. Muestra al usuario su resumen tal cual (10 líneas como máximo) junto con la ruta de `salidas/animador/informe.md`. Si falló, explica qué falló; no lo reintentes en este mismo disparo.
