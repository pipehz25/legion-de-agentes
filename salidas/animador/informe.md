# Animador — informe del ciclo del 2026-11-12

Primera tanda de la serie «mientras duermes»: seis videos, uno por tipo de negocio. Todos son verticales (1080×1920), con la voz «Bram» de Higgsfield y subtítulos.

| Video | Título | Duración | Volumen | Avisos de revisión |
|---|---|---|---|---|
| `restaurante` | ¿Y si tu restaurante tomara reservas mientras duermes? | 33,6 s | −15,3 LUFS | 0 |
| `consultorio` | ¿Y si tu consultorio agendara citas mientras duermes? | 36,3 s | −15,5 LUFS | 0 |
| `inmobiliaria` | ¿Y si tu inmobiliaria atendiera clientes mientras duermes? | 35,3 s | −15,4 LUFS | 0 |
| `tienda` | ¿Y si tu tienda vendiera mientras duermes? | 32,9 s | −15,4 LUFS | 0 |
| `gimnasio` | ¿Y si tu gimnasio inscribiera socios mientras duermes? | 35,4 s | −15,2 LUFS | 0 |
| `salon` | ¿Y si tu salón llenara la agenda mientras duermes? | 34,9 s | −15,4 LUFS | 0 |

Cada uno quedó en `salidas/animador/<video>/` con su MP4, `portada.jpg` y `publicacion.txt`.

## Qué se comprobó

- La revisión de HyperFrames pasó sin errores ni avisos en los seis.
- Se miraron capturas de todas las escenas de los seis videos.
- La voz se transcribió con whisper frase por frase y se comparó con el guion. Tres frases se regeneraron; la del problema de la inmobiliaria se reescribió («Mensajes, llamadas, visitas, anuncios») porque a la voz se le perdía la «r» final de «Responder, filtrar».

## Qué no se pudo comprobar

- **Nadie ha oído los videos.** La comprobación de la voz es por transcripción: confirma que se entiende lo que dice el guion, no que el acento o el tono gusten.
- Los videos no tienen música ni efectos de sonido.

## Gasto

La voz de los seis videos, con las pruebas y las frases regeneradas, costó cerca de 11 créditos de Higgsfield. Quedaban 607,7 al terminar.

## Temas pendientes (10)

veterinaria, taller, hotel, academia, agencia-viajes, ferreteria, optica, panaderia, oficina-contable, spa.
