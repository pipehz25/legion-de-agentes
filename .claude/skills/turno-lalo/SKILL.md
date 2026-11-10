---
name: turno-lalo
description: Turno de la PC que lleva el espacio de Lalo Ocampo - baja lo último de GitHub, ejecuta el Clipero y después el Publicador dentro de `espacios/lalo/` (solo contenido de Lalo, solo sus cuentas) y sube a GitHub solo esa carpeta. Va en la PC que tiene `espacio.local.json` con el espacio `lalo` y las credenciales de las cuentas de Lalo. Pensado para /loop, p. ej. `/loop 6h /turno-lalo`. Acepta una indicación opcional para el Clipero, p. ej. `/turno-lalo solo la última canción`.
---

# Turno del espacio de Lalo

Actúas como orquestador. No hagas el trabajo en este contexto. Este turno no toca nada de la raíz (`datos/`, `salidas/`): eso es de la otra PC, que corre `/turno-clips` con el resto del contenido. Aquí tampoco se lanza el Cazador Viral.

1. **Comprobar el espacio.** Lee `espacio.local.json` en la raíz del proyecto. Si no existe o su `espacio` no es `lalo`, para y explícalo: esta PC no está puesta en el espacio de Lalo y el turno no debe correr aquí (CLAUDE.md, «Espacios»).
2. **Bajar lo último.** `git pull --rebase --autostash`. Si falla por red, sigue y dilo en el resumen. Si falla por un conflicto o un rebase a medias, para y explica el error.
3. **Clipero.** Lanza el subagente con la herramienta Agent:
   - `subagent_type`: `clipero`
   - `description`: `Ciclo clipero (Lalo)`
   - `prompt`: `Ejecuta un ciclo completo según tu procedimiento. Esta PC trabaja en el espacio lalo (espacio.local.json): tu configuración, tu memoria y tus salidas cuelgan de espacios/lalo/, y tu config.json trae enfoque_propio. Indicación del usuario (puede estar vacía): $ARGUMENTS`

   Si el tipo no está disponible, usa `general-purpose` con `Lee .claude/agents/clipero.md y actúa como ese agente: <el prompt de arriba>`. Espera a que termine. Si falla, lanza igualmente el paso 4, que publicará lo que ya estaba aprobado.
4. **Publicador.** Lanza el subagente con la herramienta Agent:
   - `subagent_type`: `publicador`
   - `description`: `Ciclo publicador (Lalo)`
   - `prompt`: `Ejecuta un ciclo completo según tu procedimiento. Esta PC trabaja en el espacio lalo (espacio.local.json): tu configuración, tu memoria y tus salidas cuelgan de espacios/lalo/. El Clipero acaba de terminar su ciclo: sus clips están en espacios/lalo/salidas/clipero/clips.json. Instrucción del usuario: ninguna.`

   Si el tipo no está disponible, usa `general-purpose` con `Lee .claude/agents/publicador.md y actúa como ese agente: <el prompt de arriba>`. Espera a que termine.
5. **Subir.** Solo la carpeta del espacio, nunca `datos/` ni `salidas/` de la raíz:
   - `git add espacios/lalo`
   - `git commit -m "Lalo: <lo más destacado, en pocas palabras>"`. Si no hay cambios, no hagas commit.
   - `git push`. Si lo rechaza porque la otra PC subió algo entretanto, `git pull --rebase --autostash` y `git push` otra vez. Si el rebase choca, `git rebase --abort`, no fuerces nada y avísalo.
6. **Resumen** para el usuario: hasta 5 líneas por agente, la ruta de cada informe, el comando para aprobar lo que quedó pendiente (`/publicador aprobar <clip-id>`, que en esta PC actúa sobre el espacio de Lalo), las cuentas de Lalo que siguen sin autorizar y si el push salió bien.
