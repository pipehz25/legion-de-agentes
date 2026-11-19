# Mission Control

App de la Legión para Santiago y Felipe: prioridades del día, tareas, cuentas, estado del pipeline y decisiones.

- **Dirección:** https://legion-mission-control.vercel.app
- **Hospedaje:** Vercel, en el equipo «impulxn8n's projects» de Santiago, proyecto `legion-mission-control`. Plan Hobby, gratis.
- **Datos:** Postgres en Neon (plan gratis `free_v3`), conectado desde Vercel. Tablas `mc_docs` (documentos por colección) y `mc_audit` (quién cambió qué y cuándo).
- **Código:** Next.js 16 + React 19 + Tailwind 4. La API está en `app/api/`, la interfaz en `components/` y las reglas compartidas en `lib/model.ts`.

## Entrar

Cada socio entra con su usuario (Santiago o Felipe) y su contraseña.

**Poner o recuperar una contraseña.** En tu propia terminal, dentro de esta carpeta y con la sesión de Vercel iniciada:

```
npm run password
```

Pregunta el usuario y la contraseña (no se ve al escribir) y la guarda en la base, como hash. No hace falta volver a desplegar. Después, cada uno la cambia desde la app: menú de arriba a la derecha → Cambiar contraseña.

## Cómo escriben los agentes

Claude, desde cada PC, usa la API de agentes con el token `MC_AGENT_TOKEN`. El token está guardado en Vercel y en el `.env.local` de la PC (nunca en GitHub):

```
PUT   /api/agent/pipeline/<espacio>   { "data": { ... } }   reemplaza el estado de un espacio
PATCH /api/agent/tareas/<id>          { "data": { ... } }   cambia campos de una tarea
```

Cabecera: `Authorization: Bearer <MC_AGENT_TOKEN>`. Colecciones: `tareas`, `cuentas`, `decisiones` y `pipeline`.

## Trabajar en local

1. `npm install`
2. Crear `.env.local` con `MC_DEV_OPEN=1`. Sin `DATABASE_URL`, los datos van a `.data/mc.json` y se entra con cualquier contraseña. Solo en desarrollo.
3. `npm run dev` y abrir http://localhost:3000

Para cargar datos exportados: `node scripts/seed.mjs <carpeta> <url>`. Usa `MC_AGENT_TOKEN` del `.env.local`.

## Desplegar

```
vercel deploy --prod
```

Desde esta carpeta, con la sesión de Vercel de Santiago. El proyecto no está conectado a GitHub, porque el repositorio es de Felipe; si Felipe le da acceso a Vercel, se puede conectar para desplegar con cada push.

## Variables (en Vercel)

| Variable | Qué es |
|---|---|
| `DATABASE_URL` (y las `PG*` y `POSTGRES_*`) | Conexión a Neon. La pone la integración |
| `MC_SECRET` | Firma de las sesiones |
| `MC_AGENT_TOKEN` | Token de los agentes |
| `MC_PASS_SANTIAGO`, `MC_PASS_FELIPE` | Opcional: contraseña inicial como hash. La de la base tiene prioridad |
