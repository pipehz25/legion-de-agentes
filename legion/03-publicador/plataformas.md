# Plataformas del Publicador

Requisitos, límites y estilo de texto de cada plataforma. Las condiciones de las APIs cambian a menudo: lo que sigue es el punto de partida, y conviene confirmarlo en la documentación oficial al configurar cada una.

## 1. Cómo se activa una plataforma

1. Crear la app o las credenciales en la plataforma (secciones 3 a 6).
2. En una ventana propia de PowerShell (no desde Claude), desde la carpeta del proyecto:
   `powershell -NoProfile -ExecutionPolicy Bypass -File legion/03-publicador/publicar.ps1 autorizar -Plataforma <youtube|tiktok|instagram|facebook>`
3. Comprobar: `... publicar.ps1 estado` debe mostrar `"token": "valido"` y la cuenta correcta.
4. En `config.json`, poner `"activa": true` en esa plataforma.
5. Ejecutar `/publicador` con `"simulacion": true` y revisar `salidas/publicador/pendientes.md`.
6. Cuando todo esté bien, poner `"simulacion": false`.

Las credenciales quedan en `%USERPROFILE%\.legion\publicador\credenciales.json`, fuera del proyecto. No se suben a GitHub, no se pegan en el chat y el agente no las lee.

## 2. Resumen

| Plataforma | Qué hace falta | Privacidad sin auditoría | Notas |
|---|---|---|---|
| YouTube Shorts | Proyecto de Google Cloud con la YouTube Data API v3 y un cliente OAuth de escritorio | Privado | Cuota diaria por defecto: 10 000 unidades; cada subida gasta unas 1600 (unas 6 subidas al día) |
| TikTok | App en TikTok for Developers con Login Kit y Content Posting API | Solo `SELF_ONLY` en publicación directa | Por defecto se envía como borrador a la bandeja de la app |
| Instagram Reels | Cuenta profesional (empresa o creador) y app de Meta | Público (no hay borradores) | Límite de unas 50 publicaciones por API cada 24 h |
| Facebook Reels | Página de Facebook y token de página | Borrador o publicado | Reels de 3 a 90 s |
| X | — | — | No activada: subir video por API requiere un plan de pago |

## 3. YouTube

1. En https://console.cloud.google.com crea un proyecto y activa **YouTube Data API v3**.
2. **Pantalla de consentimiento OAuth:** tipo Externo. Añade tu cuenta como usuario de prueba y después pasa la app a **En producción**. En modo de prueba, el refresh token caduca a los 7 días y el loop dejaría de subir. Google mostrará el aviso de "app no verificada" al autorizar; es normal para uso propio.
3. **Credenciales → Crear ID de cliente OAuth → Aplicación de escritorio.** Copia el client_id y el client_secret.
4. Ejecuta `autorizar -Plataforma youtube`: pide los dos datos, abre el navegador y vuelve a `http://127.0.0.1:8765` (`puerto_oauth`).
5. Mientras el proyecto no pase la auditoría de la API (formulario de YouTube API Services), los videos subidos por API quedan **privados**. Se pueden hacer públicos a mano desde YouTube Studio.

Un video vertical de hasta 3 minutos se trata como Short automáticamente.

## 4. TikTok

Así quedó configurada el 2026-10-29 (organización *Legion de Agentes IA*, app *Legion Publicador*, en **sandbox**):

1. **Cuenta de developer** en https://developers.tiktok.com. Se crea con un correo y no es la cuenta de TikTok normal. Dentro, crea una organización y, en *Manage apps → Connect an app*, una app de tipo **Other**. El tipo no se puede cambiar después: *Mini game* no sirve.
2. **Sandbox:** pon el interruptor junto al nombre de la app en *Sandbox* y crea uno. No necesita la revisión de TikTok y sus credenciales empiezan por `sb`. Las de producción, que empiezan por `aw`, no sirven sin revisión.
3. **Ficha del sandbox.** Todos los campos son obligatorios. Si falta uno, no se guarda nada y la autorización falla con el error `client_key`.
   - Icono: `docs/icono.png`. Descripción, de 120 caracteres como máximo.
   - Términos: `https://github.com/pipehz25/legion-de-agentes/blob/main/docs/terminos.md`
   - Privacidad: `https://github.com/pipehz25/legion-de-agentes/blob/main/docs/privacidad.md`
   - Plataforma **Desktop**, no Web, con la URL `https://github.com/pipehz25/legion-de-agentes`.
4. **Productos:** **Login Kit**, con el redirect URI de Desktop igual a `config.json` → `tiktok.redirect_uri` (`http://localhost:8765/callback/`), y **Content Posting API**, con *Direct Post* activado. *Verify domains* no hace falta, porque se sube el archivo y no una URL.
5. **Scopes:** `user.info.basic`, `video.upload` y `video.publish`.
6. **Target users:** añade la cuenta de TikTok donde se publica, iniciando sesión con ella. Si falta, la autorización da `non_sandbox_target`.
7. **Autorizar:** `autorizar -Plataforma tiktok` pide el client_key, el client_secret y tu usuario (sin @). En el navegador se entra con la cuenta de TikTok normal, no con la de developer. Para lanzarlo sin preguntas, por ejemplo desde Claude, pasa los datos en las variables de entorno `LEGION_CLIENT_KEY`, `LEGION_CLIENT_SECRET` y `LEGION_USUARIO`.
8. **Destino:**
   - `borrador` (por defecto): el video llega a la bandeja de TikTok y se termina de publicar desde la app (sonido, portada y texto). Es lo recomendado mientras la app no esté auditada.
   - `directo`: publica con la privacidad de `config.json`. Sin auditoría, TikTok solo admite `SELF_ONLY` (solo yo). Después de la auditoría se puede usar `PUBLIC_TO_EVERYONE`.

**Límites:**
- Cada cuenta admite como máximo **5 borradores pendientes por API en 24 horas**; si se pasa, TikTok devuelve `spam_risk_too_many_pending_share`. Por eso `max_por_dia` está en 4, y conviene publicar o descartar los borradores antes del siguiente ciclo.
- El endpoint de subida admite 6 llamadas por minuto.
- En modo `borrador` la API solo recibe el video: el texto y los hashtags se pegan en la app desde `salidas/publicador/pendientes.md`.
- En modo `directo`, mientras la app no pase la auditoría, TikTok solo publica en **cuentas privadas** (`unaudited_client_can_only_post_to_private_accounts`) y los videos quedan en "solo yo". Para publicar en público con el texto automático hay que pedir la auditoría de la app en producción.

El `code_challenge` del PKCE va en hexadecimal: TikTok lo pide así en escritorio.

## 5. Instagram

Requisito: cuenta **profesional** (empresa o creador).

**Opción recomendada (`"api": "instagram"`): API de Instagram con inicio de sesión de Instagram.** No necesita página de Facebook.
1. En https://developers.facebook.com crea una app de tipo Empresa y añade el producto **Instagram** (API con inicio de sesión de Instagram).
2. Permisos: `instagram_business_basic` e `instagram_business_content_publish`.
3. En el panel, añade tu cuenta y pulsa **Generar token** (token de larga duración, 60 días).
4. Ejecuta `autorizar -Plataforma instagram` y pega el token. El script obtiene el ID de la cuenta y renueva el token cada 20 días.

**Opción alternativa (`"api": "facebook"`):** la cuenta de Instagram vinculada a una página de Facebook, con un token de larga duración que tenga `instagram_basic`, `instagram_content_publish` y `pages_read_engagement`, más el ID `instagram_business_account`.

Instagram **no admite borradores por API**: lo aprobado se publica al momento.

## 6. Facebook

1. En la misma app de Meta, con los permisos `pages_show_list`, `pages_read_engagement` y `pages_manage_posts`.
2. En el Explorador de la API Graph, genera un token de usuario, cámbialo por uno de larga duración y pide `me/accounts`. El `access_token` de la página que aparece ahí no caduca.
3. Ejecuta `autorizar -Plataforma facebook`: pide el ID de la página y ese token.
4. `config.json` → `facebook.estado`: `DRAFT` (borrador en la página) o `PUBLISHED`.

## 7. Límites de texto (los valida el script)

| Campo | YouTube | TikTok | Instagram | Facebook |
|---|---|---|---|---|
| Título | 100 caracteres, sin `<` ni `>` | — | — | — |
| Texto | Descripción de 5000 bytes | 2200 caracteres | 2200 caracteres y 30 hashtags | Sin límite práctico |
| Etiquetas | 500 caracteres en total | — | — | — |
| Duración | Short hasta 3 min | 3 s mínimo | 3 s a 15 min | 3 a 90 s |

## 8. Estilo de texto por plataforma

- **YouTube Shorts.** Título: el gancho con la palabra clave al principio, idealmente menos de 70 caracteres. Descripción: una o dos frases de contexto, el crédito y de 3 a 5 hashtags. Etiquetas: de 5 a 10, sin `#`.
- **TikTok.** Gancho corto (se ven unos 150 caracteres sin desplegar), una pregunta para los comentarios si encaja, el crédito y de 3 a 5 hashtags (mezcla de nicho y amplios).
- **Instagram Reels.** La primera línea es el gancho (se cortan unos 125 caracteres antes de "más"). Después, el contexto, el crédito y de 3 a 5 hashtags.
- **Facebook.** Una o dos frases, el crédito y de 1 a 3 hashtags.

En todas: el título y el texto no pueden afirmar nada que el clip no muestre, ni atribuir a alguien palabras que no dijo.

## 9. Derechos

- `propio` y `autorizado`: se pueden publicar en modo automático.
- `sin_verificar`: contenido de terceros sin permiso confirmado. Solo se publica con aprobación expresa, siempre con crédito a la fuente. Riesgos: reclamaciones de Content ID (los ingresos pasan al titular), bloqueo del video o avisos por derechos de autor que pueden llevar al cierre de la cuenta.
