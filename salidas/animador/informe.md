# Animador — informe del ciclo del 2026-11-12

Seis videos, uno por tipo de negocio. Se rehicieron el mismo día porque Santiago pidió que **cada video fuera distinto**: ahora cada uno tiene su formato, su gancho, su dibujo y su color de fondo. Todos son verticales (1080×1920), con la voz «Bram» de Higgsfield y subtítulos.

| Video | Formato | Gancho | Color | Duración | Volumen |
|---|---|---|---|---|---|
| `restaurante` | un día | Así es un día en tu restaurante con una legión de agentes. | vino | 27,5 s | −15,3 LUFS |
| `consultorio` | antes y después | Tu consultorio, antes y después de tener agentes. | azul | 30,9 s | −15,4 LUFS |
| `inmobiliaria` | mensajes sin responder | ¿Cuántos clientes se van porque nadie les respondió a tiempo? | verde | 27,2 s | −15,3 LUFS |
| `tienda` | mientras duermes | ¿Y si tu tienda vendiera mientras duermes? | morado | 32,8 s | −15,4 LUFS |
| `gimnasio` | tres agentes | Tres agentes que todo gimnasio necesita. | naranja | 25,4 s | −15,3 LUFS |
| `salon` | tú a lo tuyo | Tú, a las tijeras. Los agentes, a todo lo demás. | magenta | 27,1 s | −15,8 LUFS |

Cada uno quedó en `salidas/animador/<video>/` con su MP4, `portada.jpg` y `publicacion.txt`.

## Qué se comprobó

- La revisión de HyperFrames pasó sin errores ni avisos en los seis.
- Se miraron capturas o cuadros del video final de todas las escenas de los seis.
- La voz se transcribió con whisper frase por frase al generarla; ninguna quedó en la lista «para revisar de oído».
- **«Agendar».** Santiago pidió verificarla. Medida en el audio: cuando era la primera palabra de una frase, la voz la decía con «g» inglesa (ruido corto y agudo, unos 40 ms centrados en 4.900 Hz). Se corrigió con `animados/pronunciacion.json` (a la voz se le escribe «ajend…») y se quitaron las listas que empezaban con ese verbo. En el audio final, las cuatro veces que se dice «agenda» la consonante mide como jota española (de 60 a 150 ms, centrada entre 1.900 y 2.500 Hz).

## Qué no se pudo comprobar

- **Nadie ha oído los videos.** Las comprobaciones de la voz son por transcripción y por medición del sonido: dicen que se entiende lo que pide el guion y que la jota suena a jota, no que el acento o el tono gusten.
- Los videos no tienen música ni efectos de sonido.

## Gasto

Entre las dos versiones de la tanda, las pruebas de voz y las frases regeneradas se gastaron cerca de 17 créditos de Higgsfield. Quedaban 602,0 al terminar.

## Temas pendientes (10)

veterinaria, taller, hotel, academia, agencia-viajes, ferreteria, optica, panaderia, oficina-contable, spa. Para varios hay que dibujar el objeto del negocio en `animados/plantillas/heroes.json`.
