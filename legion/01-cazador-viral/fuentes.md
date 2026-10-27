# Fuentes por plataforma

Leyenda: **[auto]** lo trae `recolectar.ps1` en cada ciclo · **[web]** lo busca o lee el agente con WebSearch/WebFetch · **[clave]** necesita una clave gratuita · **[pago]** opción no activada.

| Plataforma | Qué buscamos | Cómo | Límites |
|------------|--------------|------|---------|
| Google Trends | Temas en alza por país | [auto] RSS por país (`google-trends.json`) | Solo rangos de tráfico ("200+", "2000+") |
| X | Tendencias por país y cuánto duran | [auto] trends24.in, 24 snapshots horarios (`x-trends24.json`): `rank_actual`, `mejor_rank`, `horas_en_lista`, `estado` nueva/activa/salio | Sin métricas por publicación |
| Wikipedia | Curiosidad masiva: historia, famosos, ciencia | [auto] páginas más vistas del día anterior en es/en (`wikipedia.json`) | Un día de retraso |
| YouTube | Videos en tendencia con métricas reales; versiones de un formato y sus vistas | [auto][clave] YouTube Data API `mostPopular` por país (`youtube.json`, con `vistas_por_hora`). **Sin clave:** `legion/02-clipero/clipero.ps1 buscar` (vistas y duración reales de cada resultado; requiere `herramientas/instalar.ps1`) | La API no separa los Shorts |
| Twitch | Streams, categorías y **clips** (momentos virales) | [auto][clave] Helix API (`twitch.json`): streams top por idioma, categorías top y clips de las últimas 24 h | — |
| TikTok | Sonidos, hashtags, creadores y videos en alza, con su curva | [web] TikTok Creative Center (secciones de tendencias), búsquedas `site:tiktok.com` | Páginas pesadas en JavaScript. Si no cargan, usar listas semanales de terceros y marcarlas como **señal tardía** |
| Instagram | Audios de Reels en alza y formatos | [web] Búsquedas y listas semanales de audios en tendencia (señal tardía) | Sin API pública de tendencias |
| Facebook | Reels y memes que llegan a un público mayor | [web] | Cuando algo llega a Facebook, en TikTok suele estar ya en pico: es una señal útil para fechar la etapa |
| Kick | Streamers y momentos en alza | [web] kick.com/browse, Streams Charts | — |
| Reddit | Memes y formatos en su origen (semillas) | [web] Búsqueda web; la API bloquea sin sesión | — |
| Música | Canciones que suben | [web] kworb.net (rankings de Spotify y YouTube en HTML simple) | — |

## Activar las claves gratuitas (opcional; mejora mucho la precisión)

**YouTube:** Google Cloud Console → crear proyecto → habilitar "YouTube Data API v3" → Credenciales → Crear clave de API. La cuota gratuita es de 10.000 unidades al día y cada ciclo gasta 1 por región.

**Twitch:** dev.twitch.tv/console → Register Your Application → copiar el Client ID y generar un Client Secret.

Guárdalas como variables de entorno de usuario en PowerShell y luego reinicia VS Code:

```powershell
[Environment]::SetEnvironmentVariable('YOUTUBE_API_KEY', '<clave>', 'User')
[Environment]::SetEnvironmentVariable('TWITCH_CLIENT_ID', '<client id>', 'User')
[Environment]::SetEnvironmentVariable('TWITCH_CLIENT_SECRET', '<secret>', 'User')
```

## Opciones de pago (no activadas)

Para tener métricas exactas de TikTok, Instagram y Facebook (vistas, número de videos por sonido, réplicas) haría falta un proveedor de scraping (Apify u otro) o una API oficial de investigación (la de TikTok exige aprobación académica). Se añadiría como un bloque más en `recolectar.ps1`.

## Reglas de uso

- Solo APIs oficiales y páginas públicas: nada de iniciar sesión de forma automática ni de saltarse bloqueos.
- Frecuencia baja: un ciclo cada pocas horas.
- Si una fuente falla, se anota en el informe y el ciclo sigue.
