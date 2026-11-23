# Pendientes de aprobación: Publicador, espacio gta

Actualizado: 2026-11-23T09:32:00-05:00 (ciclo 3)

Hay 1 clip pendiente de aprobación y 1 aprobado en espera. Además, hay una tarea para el usuario en YouTube Studio: borrar 2 videos atascados. TikTok, Instagram y Facebook no tienen entradas porque todas sus cuentas de este espacio están apagadas y sin autorizar.

En este ciclo solo se subieron los 5 clips de `gta-us` en la calidad nueva que aprobó el usuario a las 09:22 (ver `informes/2026-11-23_0931.md`). Los demás clips nuevos del Clipero (`beach-camp-afterparty`, `crypto-fence-fight` y los `2026-11-23-*`) se prepararán en otro ciclo, cuando terminen de renderizarse.

---

## Tarea: borrar en YouTube Studio los dos videos atascados

Son dos subidas que se cortaron con HTTP 0. YouTube creó el video, pero no recibió el archivo entero: se quedarán en `uploaded` para siempre. Los dos tienen programada una hora de publicación, así que conviene borrarlos cuanto antes.

| Borrar | Canal | Clip | Programado | Enlace | El bueno (conservar) |
|---|---|---|---|---|---|
| `bAD25fkBebw` | gta-us (Getaway Kings) | lifeguard-truck-rampage | 23-nov 13:30 | https://studio.youtube.com/video/bAD25fkBebw/edit | `Myp5QF9bTq0` (https://www.youtube.com/shorts/Myp5QF9bTq0), privado, procesado, publishAt 23-nov 13:30 (-05:00) |
| `v_dUK0qkUzQ` | gta-chases (Getaway Kings Chases) | clone-or-smash | 24-nov 10:00 | https://studio.youtube.com/video/v_dUK0qkUzQ/edit | `Fzy80cb_LoQ` (https://www.youtube.com/shorts/Fzy80cb_LoQ), privado, procesado, publishAt 24-nov 10:00 (-05:00) |

Ojo: cada atascado tiene el mismo título que su versión buena. Antes de borrar, comprueba el id en la dirección de Studio.

---

## 2026-11-21-gta6-underwater-hideout

- **Gancho:** Getaway Files #5: the underwater hideout
- **Puntaje:** 79
- **Derechos:** autorizado (Fox - No Copyright Gameplay, licencia Creative Commons Attribution, comprobada el 2026-11-21)
- **Ventana hasta:** 2026-11-28
- **Video:** [narrado.mp4](../clipero/clips/2026-11-21-gta6-underwater-hideout/narrado.mp4) (18,5 s)
- **Ficha:** [ficha.md](../clipero/clips/2026-11-21-gta6-underwater-hideout/ficha.md)
- **Simulación:** válida (título, descripción, etiquetas y duración dentro de los límites).

> **Revisar antes de aprobar:** la narración dice que la policía lo persigue («Cops on your tail»), pero en la imagen no se ven estrellas de búsqueda. La ficha también lo advierte: puede que ya hubiera perdido a la policía antes del corte. Si se aprueba tal cual, el título promete algo que el clip no enseña con claridad. Además, está en la calidad anterior: conviene que el Clipero lo renderice en 1440x2560 antes de subirlo.

### YouTube, cuenta `gta-chases` (Getaway Kings Chases)

**Título:**

```
Getaway Files #5: hiding from the cops under a dock in GTA 6 #shorts
```

**Descripción:**

```
The game says hide or leave the search area, so he dives into a Key Lento canal and waits under the dock. Next to a sunken bike, of course.

Gameplay: Fox - No Copyright Gameplay (free to use) - https://www.youtube.com/watch?v=e5x7k8fBqHM&t=2598s
Narration, script and edit: Getaway Kings
#GTA6 #GTAVI #PoliceChase #Getaway #GrandTheftAuto6 #Shorts
```

**Etiquetas:** GTA6, GTAVI, PoliceChase, Getaway, GrandTheftAuto6, Shorts

**Hora:** el envío todavía no tiene hora programada. Si lo apruebas, di también a qué hora debe salir (por ejemplo, «programado 2026-11-24T13:00:00-05:00»). Si no la das, se sube con la privacidad de `config.json`, que es `public`, y sale al momento. En `gta-chases` el 24-nov ya tiene 1 de 5 (clone-or-smash a las 10:00).

---

## Aprobado, en espera (no se sube)

| Clip | Cuenta | Programado | Por qué está en espera |
|---|---|---|---|
| 2026-11-21-gta6-jason-hoops | gta-us | 2026-11-24T09:00:00-05:00 (vencerá) | **En espera por decisión del usuario (2026-11-23):** cambió la temática a humor y caos, y los «Leonida Daily» tranquilos van en 0 vistas. Sigue aprobado, pero el Publicador no lo sube hasta que el usuario lo pida. Su hora coincide ahora con `broken-bridge-jump` (24-nov, 09:00): si se reactiva, necesita otra; si no, recházalo. |

---

## Comandos

- `/publicador aprobar 2026-11-21-gta6-underwater-hideout`
- `/publicador aprobar 2026-11-21-gta6-underwater-hideout:youtube`
- `/publicador aprobar todo`
- `/publicador rechazar 2026-11-21-gta6-underwater-hideout <motivo>`
- `/publicador rechazar 2026-11-21-gta6-jason-hoops cambio de temática a humor y caos`
