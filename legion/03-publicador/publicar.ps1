# Herramienta del Publicador (Agente 03 de la Legion). Acciones:
#   estado
#       -> JSON con cada cuenta de cada plataforma: activa en config.json, credenciales, si el token funciona y su nombre
#   subir -Plataforma <p> -Datos <envio.json> [-Simular]
#       -> valida el envio y sube el clip a la cuenta que diga el envio ("cuenta"; sin ella, principal).
#          Con -Simular solo valida (no usa la red). Guarda <envio>.resultado.json junto al envio y nunca sube dos
#          veces el mismo envio, ni el mismo video a dos cuentas de la misma plataforma.
#   comprobar -Plataforma <p> -IdPublicacion <id> [-Cuenta <alias>]
#       -> estado del procesamiento en la plataforma (en Instagram publica el contenedor cuando ya esta listo)
#   panel [-SinRed]
#       -> lee las vistas de lo publicado (salvo con -SinRed), las guarda en datos/publicador/metricas.json y escribe
#          salidas/publicador/panel.html: por cada pieza, cuantas versiones tiene, donde se publico y cuanto trajo;
#          y el uso de cada cuenta.
#   autorizar -Plataforma <p> [-Cuenta <alias>]
#       -> SOLO LA EJECUTA EL USUARIO, en su propia ventana de PowerShell: pide los datos de la app,
#          abre el navegador si hace falta y guarda las credenciales fuera del proyecto.
# Plataformas: youtube, tiktok, instagram, facebook. Requisitos de cada una: legion/03-publicador/plataformas.md
# Cuentas: cada plataforma admite varias, declaradas en config.json -> plataformas.<p>.cuentas. "principal" es la de siempre.
# Uso: powershell -NoProfile -ExecutionPolicy Bypass -File legion/03-publicador/publicar.ps1 <accion> ...

param(
    [Parameter(Mandatory = $true, Position = 0)][ValidateSet('estado', 'subir', 'comprobar', 'panel', 'autorizar')][string]$Accion,
    [ValidateSet('youtube', 'tiktok', 'instagram', 'facebook')][string]$Plataforma,
    [string]$Datos,
    [string]$IdPublicacion,
    [string]$Cuenta,
    [switch]$Simular,
    [switch]$SinRed
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$raiz = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$utf8 = New-Object Text.UTF8Encoding $false
$cultura = [Globalization.CultureInfo]::InvariantCulture
$plataformas = 'youtube', 'tiktok', 'instagram', 'facebook'

function LeerJson([string]$ruta) { [IO.File]::ReadAllText($ruta, $utf8) | ConvertFrom-Json }
function EscribirJson([string]$ruta, $obj) { [IO.File]::WriteAllText($ruta, (ConvertTo-Json -InputObject $obj -Depth 8), $utf8) }
function Ahora { (Get-Date).ToString("yyyy-MM-dd'T'HH:mm:sszzz") }
function Campo($obj, [string]$nombre) { if ($obj -and $obj.PSObject.Properties[$nombre]) { $obj.$nombre } else { $null } }
function Salir($obj, [bool]$ok) {
    Write-Output (ConvertTo-Json -InputObject $obj -Depth 8)
    if ($ok) { exit 0 } else { exit 1 }
}

$config = LeerJson (Join-Path $PSScriptRoot 'config.json')
$rutaCred = [Environment]::ExpandEnvironmentVariables($config.credenciales)
$graph = $config.graph_version
$ffprobe = Join-Path $raiz 'herramientas\bin\ffprobe.exe'

# --- Cuentas: cada plataforma admite varias (config.json -> plataformas.<p>.cuentas). Sin esa lista hay una sola: principal ---
$cuentaAct = 'principal'
function CuentasDe([string]$p) {
    $lista = @(Campo $config.plataformas.$p 'cuentas' | Where-Object { $_ })
    if (-not $lista.Count) { $lista = @([pscustomobject]@{ alias = 'principal'; activa = $true }) }
    $lista
}
function CfgCuenta([string]$p, [string]$alias) { @(CuentasDe $p) | Where-Object { $_.alias -eq $alias } | Select-Object -First 1 }
function AliasDe($obj) { $a = Campo $obj 'cuenta'; if ($a) { [string]$a } else { 'principal' } }
# Fija la cuenta con la que trabajan las funciones de credenciales y de cada plataforma
function UsarCuenta([string]$p, [string]$alias) {
    if (-not $alias) { $alias = 'principal' }
    if ($alias -notmatch '^[a-z0-9][a-z0-9_-]{0,30}$') { throw "Alias de cuenta no valido: '$alias'. Solo minusculas, numeros, guion y guion bajo." }
    if (-not (CfgCuenta $p $alias)) { throw "La cuenta '$alias' no esta en config.json -> plataformas.$p.cuentas. Anadela ahi antes de usarla." }
    $script:cuentaAct = $alias
}
# Las credenciales de principal se guardan bajo el nombre de la plataforma (como siempre); las demas, bajo plataforma@alias
function ClaveCred([string]$p) { if ($script:cuentaAct -eq 'principal') { $p } else { "$p@$($script:cuentaAct)" } }

# --- Credenciales: viven fuera del proyecto y nunca se imprimen ---
function LeerCred { if (Test-Path -LiteralPath $rutaCred) { LeerJson $rutaCred } else { New-Object psobject } }
function GuardarPlataforma([string]$p, $datos) {
    $cred = LeerCred
    $cred | Add-Member -NotePropertyName (ClaveCred $p) -NotePropertyValue $datos -Force
    $dir = Split-Path $rutaCred
    if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Force $dir | Out-Null }
    EscribirJson $rutaCred $cred
}
function CredDe([string]$p) {
    $c = Campo (LeerCred) (ClaveCred $p)
    if (-not $c) { throw "No hay credenciales de $p (cuenta $($script:cuentaAct)). El usuario debe ejecutar en su PowerShell: powershell -NoProfile -ExecutionPolicy Bypass -File legion/03-publicador/publicar.ps1 autorizar -Plataforma $p -Cuenta $($script:cuentaAct)" }
    $c
}
# Tokens de acceso ya pedidos en esta ejecucion, por cuenta (panel consulta muchas publicaciones seguidas)
$cacheTok = @{}
function LeerSecreto([string]$texto) {
    $s = Read-Host $texto -AsSecureString
    $p = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
    try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($p) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($p) }
}
# autorizar sin preguntas: si existe LEGION_CLIENT_KEY, los datos salen de variables de entorno (vacios si faltan)
$sinPreguntas = [bool]$env:LEGION_CLIENT_KEY
function Dato([string]$texto, [string]$variable, [switch]$Secreto) {
    if ($sinPreguntas) { return ([string][Environment]::GetEnvironmentVariable($variable)).Trim() }
    if ($Secreto) { (LeerSecreto $texto).Trim() } else { (Read-Host $texto).Trim() }
}

# --- HTTP ---
function ErrorHttp($e) {
    $cuerpo = ''
    if ($e.ErrorDetails -and $e.ErrorDetails.Message) { $cuerpo = $e.ErrorDetails.Message }
    elseif ($e.Exception.Response) {
        try { $cuerpo = (New-Object IO.StreamReader($e.Exception.Response.GetResponseStream())).ReadToEnd() } catch { }
    }
    $codigo = if ($e.Exception.Response) { [int]$e.Exception.Response.StatusCode } else { 0 }
    (("HTTP $codigo. $($e.Exception.Message) $cuerpo" -replace 'access_token=[^&\s"]+', 'access_token=***') -replace '\s+', ' ').Trim()
}
function Api([string]$metodo, [string]$url, $cuerpo = $null, [hashtable]$cabeceras = @{}, [string]$tipo = 'application/json; charset=UTF-8') {
    $p = @{ Method = $metodo; Uri = $url; Headers = $cabeceras; TimeoutSec = 120 }
    if ($null -ne $cuerpo) {
        $texto = if ($cuerpo -is [string]) { $cuerpo } else { ConvertTo-Json -InputObject $cuerpo -Depth 8 -Compress }
        $p.Body = $utf8.GetBytes($texto)
        $p.ContentType = $tipo
    }
    try { Invoke-RestMethod @p } catch { throw (ErrorHttp $_) }
}
$tipoForm = 'application/x-www-form-urlencoded'
function Formulario($campos) {
    @($campos.GetEnumerator() | ForEach-Object { [Uri]::EscapeDataString([string]$_.Key) + '=' + [Uri]::EscapeDataString([string]$_.Value) }) -join '&'
}
function Cabecera($respuesta, [string]$nombre) {
    foreach ($k in $respuesta.Headers.Keys) { if ($k -ieq $nombre) { return $respuesta.Headers[$k] } }
    $null
}
# Subida reanudable de Meta (rupload.facebook.com): el archivo entero en una peticion
function SubirBinarioMeta([string]$url, [string]$archivo, [string]$token) {
    $tam = (Get-Item -LiteralPath $archivo).Length
    try {
        Invoke-RestMethod -Method Post -Uri $url -InFile $archivo -ContentType 'application/octet-stream' -TimeoutSec 1800 `
            -Headers @{ Authorization = "OAuth $token"; offset = '0'; file_size = "$tam" } | Out-Null
    } catch { throw (ErrorHttp $_) }
}

# --- OAuth para escritorio: el navegador vuelve a 127.0.0.1 o localhost y aqui se recoge el codigo ---
function Aleatorio([int]$n) {
    $abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
    $b = New-Object byte[] $n
    [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b)
    -join ($b | ForEach-Object { $abc[$_ % $abc.Length] })
}
function Sha256([string]$s) { [Security.Cryptography.SHA256]::Create().ComputeHash([Text.Encoding]::ASCII.GetBytes($s)) }
function Base64Url([byte[]]$b) { [Convert]::ToBase64String($b).TrimEnd('=').Replace('+', '-').Replace('/', '_') }
function Hex([byte[]]$b) { -join ($b | ForEach-Object { $_.ToString('x2') }) }
function PedirCodigo([string]$url, [string]$redir, [string]$estado) {
    $puerto = ([Uri]$redir).Port
    $escuchas = @()
    foreach ($ip in [Net.IPAddress]::Loopback, [Net.IPAddress]::IPv6Loopback) {
        try { $l = New-Object Net.Sockets.TcpListener($ip, $puerto); $l.Start(); $escuchas += $l } catch { }
    }
    if (-not $escuchas) { throw "No se pudo escuchar en el puerto $puerto. Cambia puerto_oauth (o redirect_uri de TikTok) en config.json." }
    Write-Host 'Se abre el navegador para autorizar la cuenta. Si no se abre, copia esta direccion:'
    Write-Host $url
    Start-Process $url
    $limite = (Get-Date).AddMinutes(5)
    try {
        while ((Get-Date) -lt $limite) {
            foreach ($l in $escuchas) {
                if (-not $l.Pending()) { continue }
                $cliente = $l.AcceptTcpClient()
                $q = @{}
                try {
                    $flujo = $cliente.GetStream()
                    $linea = (New-Object IO.StreamReader($flujo)).ReadLine()
                    $m = [regex]::Match([string]$linea, '^GET\s+[^?\s]*\?(\S*)')
                    if ($m.Success) {
                        foreach ($par in $m.Groups[1].Value -split '&') {
                            $kv = $par -split '=', 2
                            if ($kv.Count -eq 2) { $q[[Uri]::UnescapeDataString($kv[0])] = [Uri]::UnescapeDataString($kv[1].Replace('+', ' ')) }
                        }
                    }
                    $html = if ($q.ContainsKey('code') -or $q.ContainsKey('error')) { 'Listo. Ya puedes cerrar esta ventana y volver a PowerShell.' } else { '' }
                    $cuerpo = [Text.Encoding]::ASCII.GetBytes($html)
                    $cab = [Text.Encoding]::ASCII.GetBytes("HTTP/1.1 200 OK`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($cuerpo.Length)`r`nConnection: close`r`n`r`n")
                    $flujo.Write($cab, 0, $cab.Length)
                    $flujo.Write($cuerpo, 0, $cuerpo.Length)
                    $flujo.Flush()
                } finally { $cliente.Close() }
                if ($q.ContainsKey('error')) { throw "La plataforma rechazo la autorizacion: $($q['error']) $($q['error_description'])" }
                if ($q.ContainsKey('code')) {
                    if ($q['state'] -ne $estado) { throw 'El parametro state no coincide; se cancela por seguridad.' }
                    return $q['code']
                }
            }
            Start-Sleep -Milliseconds 200
        }
        throw 'No llego la autorizacion en 5 minutos.'
    } finally { foreach ($l in $escuchas) { $l.Stop() } }
}

# --- YouTube (Data API v3, subida reanudable) ---
function TokenYoutube {
    $k = ClaveCred 'youtube'
    if ($cacheTok[$k]) { return $cacheTok[$k] }
    $c = CredDe 'youtube'
    $tok = (Api Post 'https://oauth2.googleapis.com/token' (Formulario @{ client_id = $c.client_id; client_secret = $c.client_secret; refresh_token = $c.refresh_token; grant_type = 'refresh_token' }) @{} $tipoForm).access_token
    $cacheTok[$k] = $tok
    $tok
}
function SubirYoutube($envio, [string]$archivo) {
    $cfg = $config.plataformas.youtube
    $tok = TokenYoutube
    $priv = if ($envio.privacidad) { $envio.privacidad } else { $cfg.privacidad }
    $snippet = [ordered]@{ title = $envio.titulo; description = $envio.texto; categoryId = [string]$cfg.categoria; defaultLanguage = $cfg.idioma; defaultAudioLanguage = $cfg.idioma }
    $etiquetas = @($envio.etiquetas | Where-Object { $_ })
    if ($etiquetas.Count) { $snippet.tags = $etiquetas }
    $meta = [ordered]@{ snippet = $snippet; status = [ordered]@{ privacyStatus = $priv; selfDeclaredMadeForKids = $false } }
    $tam = (Get-Item -LiteralPath $archivo).Length
    try {
        $r = Invoke-WebRequest -UseBasicParsing -Method Post -TimeoutSec 120 `
            -Uri 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status' `
            -Headers @{ Authorization = "Bearer $tok"; 'X-Upload-Content-Length' = "$tam"; 'X-Upload-Content-Type' = 'video/mp4' } `
            -ContentType 'application/json; charset=UTF-8' -Body $utf8.GetBytes((ConvertTo-Json -InputObject $meta -Depth 6 -Compress))
    } catch { throw (ErrorHttp $_) }
    $destino = Cabecera $r 'Location'
    if (-not $destino) { throw 'YouTube no devolvio la direccion de subida' }
    try { $v = Invoke-RestMethod -Method Put -Uri $destino -InFile $archivo -ContentType 'video/mp4' -Headers @{ Authorization = "Bearer $tok" } -TimeoutSec 1800 }
    catch { throw (ErrorHttp $_) }
    [ordered]@{ id_publicacion = $v.id; url = "https://www.youtube.com/shorts/$($v.id)"; estado = 'publicado'; privacidad = $v.status.privacyStatus }
}
function MetricasYoutube([string]$id) {
    $r = Api Get "https://www.googleapis.com/youtube/v3/videos?part=statistics&id=$([Uri]::EscapeDataString($id))" $null @{ Authorization = "Bearer $(TokenYoutube)" }
    $v = @($r.items)[0]
    if (-not $v) { throw 'YouTube no encuentra el video (borrado o de otra cuenta)' }
    [ordered]@{ vistas = $v.statistics.viewCount; me_gusta = $v.statistics.likeCount; comentarios = $v.statistics.commentCount; compartidos = $null; detalle = '' }
}
function ComprobarYoutube([string]$id) {
    $r = Api Get "https://www.googleapis.com/youtube/v3/videos?part=status&id=$([Uri]::EscapeDataString($id))" $null @{ Authorization = "Bearer $(TokenYoutube)" }
    $v = @($r.items)[0]
    if (-not $v) { return [ordered]@{ estado = 'error'; detalle = 'YouTube no encuentra el video (borrado o de otra cuenta)' } }
    $estado = switch ($v.status.uploadStatus) { 'processed' { 'publicado' } 'uploaded' { 'procesando' } default { 'error' } }
    [ordered]@{ estado = $estado; url = "https://www.youtube.com/shorts/$id"; privacidad = $v.status.privacyStatus; detalle = "$($v.status.uploadStatus) $($v.status.rejectionReason) $($v.status.failureReason)".Trim() }
}

# --- TikTok (Content Posting API) ---
function TokenTiktok {
    $k = ClaveCred 'tiktok'
    if ($cacheTok[$k]) { return $cacheTok[$k] }
    $c = CredDe 'tiktok'
    $r = Api Post 'https://open.tiktokapis.com/v2/oauth/token/' (Formulario @{ client_key = $c.client_key; client_secret = $c.client_secret; grant_type = 'refresh_token'; refresh_token = $c.refresh_token }) @{} $tipoForm
    if (-not $r.access_token) { throw "TikTok no renovo el token: $($r.error) $($r.error_description)" }
    # TikTok puede entregar un refresh_token nuevo: se guarda para el proximo uso
    if ($r.refresh_token -and $r.refresh_token -ne $c.refresh_token) {
        $c.refresh_token = $r.refresh_token
        GuardarPlataforma 'tiktok' $c
    }
    $cacheTok[$k] = $r.access_token
    $r.access_token
}
# El usuario (sin @) solo sirve para armar enlaces; si no se dio al autorizar, se toma de config.json
# (el de la cuenta en "cuentas" y, para principal, tambien el general de la plataforma)
function UsuarioTiktok($c) {
    $u = Campo $c 'usuario'
    if (-not $u) { $u = Campo (CfgCuenta 'tiktok' $script:cuentaAct) 'usuario' }
    if (-not $u -and $script:cuentaAct -eq 'principal') { $u = Campo $config.plataformas.tiktok 'usuario' }
    $u
}
function RevisarTiktok($r) { if ($r.error -and $r.error.code -and $r.error.code -ne 'ok') { throw "TikTok: $($r.error.code). $($r.error.message)" } }
function SubirTiktok($envio, [string]$archivo) {
    $cfg = $config.plataformas.tiktok
    $h = @{ Authorization = "Bearer $(TokenTiktok)" }
    $tam = (Get-Item -LiteralPath $archivo).Length
    # Un solo trozo hasta 64 MB; si no, trozos de 10 MB y el ultimo lleva el resto
    $trozo = if ($tam -le 64MB) { $tam } else { 10MB }
    $nTrozos = [int][math]::Floor($tam / $trozo)
    $fuente = [ordered]@{ source = 'FILE_UPLOAD'; video_size = $tam; chunk_size = $trozo; total_chunk_count = $nTrozos }
    if ($cfg.destino -eq 'directo') {
        $info = Api Post 'https://open.tiktokapis.com/v2/post/publish/creator_info/query/' '{}' $h
        RevisarTiktok $info
        $priv = if ($envio.privacidad) { $envio.privacidad } else { $cfg.privacidad }
        $opciones = @($info.data.privacy_level_options)
        if ($opciones -notcontains $priv) { throw "TikTok no permite la privacidad $priv en esta cuenta. Opciones: $($opciones -join ', ')" }
        $post = [ordered]@{ title = $envio.texto; privacy_level = $priv; disable_duet = $false; disable_comment = $false; disable_stitch = $false; video_cover_timestamp_ms = 1000 }
        $r = Api Post 'https://open.tiktokapis.com/v2/post/publish/video/init/' ([ordered]@{ post_info = $post; source_info = $fuente }) $h
    } else {
        # Borrador: el video llega a la bandeja de TikTok y el usuario termina de publicarlo desde la app
        $priv = 'borrador'
        $r = Api Post 'https://open.tiktokapis.com/v2/post/publish/inbox/video/init/' ([ordered]@{ source_info = $fuente }) $h
    }
    RevisarTiktok $r
    $fs = [IO.File]::OpenRead($archivo)
    try {
        for ($k = 0; $k -lt $nTrozos; $k++) {
            $ini = [long]$k * $trozo
            $largo = if ($k -eq $nTrozos - 1) { $tam - $ini } else { $trozo }
            $buf = New-Object byte[] $largo
            $leidos = 0
            while ($leidos -lt $largo) {
                $n = $fs.Read($buf, $leidos, $largo - $leidos)
                if ($n -le 0) { throw 'Lectura incompleta del video' }
                $leidos += $n
            }
            try {
                Invoke-RestMethod -Method Put -Uri $r.data.upload_url -Body $buf -ContentType 'video/mp4' -TimeoutSec 900 `
                    -Headers @{ 'Content-Range' = "bytes $ini-$($ini + $largo - 1)/$tam" } | Out-Null
            } catch { throw (ErrorHttp $_) }
        }
    } finally { $fs.Close() }
    [ordered]@{ id_publicacion = $r.data.publish_id; url = $null; estado = 'procesando'; privacidad = $priv }
}
function ComprobarTiktok([string]$id) {
    $r = Api Post 'https://open.tiktokapis.com/v2/post/publish/status/fetch/' ([ordered]@{ publish_id = $id }) @{ Authorization = "Bearer $(TokenTiktok)" }
    RevisarTiktok $r
    $estado = switch ($r.data.status) {
        'PUBLISH_COMPLETE' { 'publicado' }
        'SEND_TO_USER_INBOX' { 'en_borradores' }
        'FAILED' { 'error' }
        default { 'procesando' }
    }
    # "publicaly" (sic): asi se llama el campo en la API
    $post = @($r.data.publicaly_available_post_id)[0]
    $usuario = UsuarioTiktok (CredDe 'tiktok')
    $url = if ($post -and $usuario) { "https://www.tiktok.com/@$usuario/video/$post" } else { $null }
    [ordered]@{ estado = $estado; url = $url; detalle = "$($r.data.status) $($r.data.fail_reason)".Trim() }
}
# Las vistas de TikTok piden el scope video.list, que la app no trae por defecto: solo con tiktok.leer_metricas = true
function MetricasTiktok([string]$id) {
    $h = @{ Authorization = "Bearer $(TokenTiktok)" }
    $s = Api Post 'https://open.tiktokapis.com/v2/post/publish/status/fetch/' ([ordered]@{ publish_id = $id }) $h
    RevisarTiktok $s
    $post = @($s.data.publicaly_available_post_id)[0]
    if (-not $post) { return [ordered]@{ vistas = $null; me_gusta = $null; comentarios = $null; compartidos = $null; detalle = "TikTok aun no da el id publico del video ($($s.data.status))" } }
    $r = Api Post 'https://open.tiktokapis.com/v2/video/query/?fields=id,view_count,like_count,comment_count,share_count' ([ordered]@{ filters = [ordered]@{ video_ids = @("$post") } }) $h
    RevisarTiktok $r
    $v = @($r.data.videos)[0]
    if (-not $v) { return [ordered]@{ vistas = $null; me_gusta = $null; comentarios = $null; compartidos = $null; detalle = 'TikTok no devuelve el video (borrado o privado)' } }
    [ordered]@{ vistas = $v.view_count; me_gusta = $v.like_count; comentarios = $v.comment_count; compartidos = $v.share_count; detalle = '' }
}

# --- Instagram (Reels; subida reanudable) ---
function BaseInstagram { if ($config.plataformas.instagram.api -eq 'facebook') { "https://graph.facebook.com/$graph" } else { "https://graph.instagram.com/$graph" } }
function CredInstagram {
    $c = CredDe 'instagram'
    # Los tokens largos de la API de Instagram con inicio de sesion de Instagram duran 60 dias: se renuevan cada 20
    if ($config.plataformas.instagram.api -ne 'facebook') {
        $renovado = Campo $c 'renovado'
        if (-not $renovado -or ((Get-Date) - [datetime]::Parse($renovado, $cultura)).TotalDays -gt 20) {
            $r = Api Get "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=$([Uri]::EscapeDataString($c.access_token))"
            $c.access_token = $r.access_token
            $c | Add-Member -NotePropertyName renovado -NotePropertyValue (Ahora) -Force
            GuardarPlataforma 'instagram' $c
        }
    }
    $c
}
# Instagram procesa el video antes de dejar publicarlo. Con $esperaSeg = 0 solo mira una vez.
function PublicarContenedor($c, [string]$id, [int]$esperaSeg) {
    $base = BaseInstagram
    $tok = [Uri]::EscapeDataString($c.access_token)
    $limite = (Get-Date).AddSeconds($esperaSeg)
    do {
        $s = Api Get "$base/$($id)?fields=status_code,status&access_token=$tok"
        if ($s.status_code -eq 'FINISHED' -or $s.status_code -eq 'PUBLISHED') { break }
        if ($s.status_code -eq 'ERROR' -or $s.status_code -eq 'EXPIRED') { throw "Instagram rechazo el video: $($s.status_code). $($s.status)" }
        if ($esperaSeg -gt 0) { Start-Sleep -Seconds 10 }
    } while ((Get-Date) -lt $limite)
    if ($s.status_code -eq 'PUBLISHED') { return [ordered]@{ id_publicacion = "contenedor:$id"; url = $null; estado = 'publicado'; privacidad = 'publico'; detalle = 'El contenedor ya estaba publicado' } }
    if ($s.status_code -ne 'FINISHED') { return [ordered]@{ id_publicacion = "contenedor:$id"; url = $null; estado = 'procesando'; privacidad = 'publico'; detalle = "$($s.status_code)" } }
    $pub = Api Post "$base/$($c.ig_user_id)/media_publish" (Formulario @{ creation_id = $id; access_token = $c.access_token }) @{} $tipoForm
    $enlace = $null
    try { $enlace = (Api Get "$base/$($pub.id)?fields=permalink&access_token=$tok").permalink } catch { }
    [ordered]@{ id_publicacion = $pub.id; url = $enlace; estado = 'publicado'; privacidad = 'publico'; detalle = '' }
}
function SubirInstagram($envio, [string]$archivo) {
    $c = CredInstagram
    $feed = if ($config.plataformas.instagram.compartir_en_feed) { 'true' } else { 'false' }
    $cont = Api Post "$(BaseInstagram)/$($c.ig_user_id)/media" (Formulario @{ media_type = 'REELS'; upload_type = 'resumable'; caption = $envio.texto; share_to_feed = $feed; access_token = $c.access_token }) @{} $tipoForm
    $destino = if ($cont.uri) { $cont.uri } else { "https://rupload.facebook.com/ig-api-upload/$graph/$($cont.id)" }
    SubirBinarioMeta $destino $archivo $c.access_token
    PublicarContenedor $c $cont.id 300
}
function ComprobarInstagram([string]$id) {
    $c = CredInstagram
    if ($id -like 'contenedor:*') { return PublicarContenedor $c $id.Substring(11) 0 }
    $m = Api Get "$(BaseInstagram)/$($id)?fields=permalink&access_token=$([Uri]::EscapeDataString($c.access_token))"
    [ordered]@{ estado = 'publicado'; url = $m.permalink; detalle = '' }
}
# Me gusta y comentarios salen con el permiso basico; las vistas piden el de estadisticas (manage_insights)
function MetricasInstagram([string]$id) {
    if ($id -like 'contenedor:*') { return [ordered]@{ vistas = $null; me_gusta = $null; comentarios = $null; compartidos = $null; detalle = 'El video sigue en proceso' } }
    $c = CredInstagram
    $tok = [Uri]::EscapeDataString($c.access_token)
    $m = Api Get "$(BaseInstagram)/$($id)?fields=like_count,comments_count&access_token=$tok"
    $o = [ordered]@{ vistas = $null; me_gusta = $m.like_count; comentarios = $m.comments_count; compartidos = $null; detalle = '' }
    try {
        $ins = Api Get "$(BaseInstagram)/$($id)/insights?metric=views,shares&access_token=$tok"
        foreach ($d in @($ins.data)) {
            $valor = if ($d.values) { @($d.values)[0].value } else { $d.total_value.value }
            if ($d.name -eq 'views') { $o.vistas = $valor } elseif ($d.name -eq 'shares') { $o.compartidos = $valor }
        }
    } catch { $o.detalle = "Sin vistas: el token no tiene el permiso de estadisticas (plataformas.md, seccion 11). $_" }
    $o
}

# --- Facebook (Reels de una pagina) ---
function SubirFacebook($envio, [string]$archivo) {
    $c = CredDe 'facebook'
    $base = "https://graph.facebook.com/$graph"
    $ini = Api Post "$base/$($c.page_id)/video_reels" (Formulario @{ upload_phase = 'start'; access_token = $c.page_token }) @{} $tipoForm
    SubirBinarioMeta $ini.upload_url $archivo $c.page_token
    $estado = if ($envio.privacidad) { $envio.privacidad } else { $config.plataformas.facebook.estado }
    Api Post "$base/$($c.page_id)/video_reels" (Formulario @{ upload_phase = 'finish'; video_id = $ini.video_id; video_state = $estado; description = $envio.texto; access_token = $c.page_token }) @{} $tipoForm | Out-Null
    [ordered]@{ id_publicacion = $ini.video_id; url = "https://www.facebook.com/reel/$($ini.video_id)"; estado = 'procesando'; privacidad = $estado }
}
function ComprobarFacebook([string]$id) {
    $c = CredDe 'facebook'
    $s = (Api Get "https://graph.facebook.com/$graph/$($id)?fields=status&access_token=$([Uri]::EscapeDataString($c.page_token))").status
    $estado = if ($s.video_status -eq 'error') { 'error' } elseif ($s.publishing_phase.status -eq 'complete') { 'publicado' } elseif ($s.video_status -eq 'ready') { 'en_borradores' } else { 'procesando' }
    [ordered]@{ estado = $estado; url = "https://www.facebook.com/reel/$id"; detalle = "video_status=$($s.video_status) publishing=$($s.publishing_phase.status)" }
}
function MetricasFacebook([string]$id) {
    $c = CredDe 'facebook'
    $tok = [Uri]::EscapeDataString($c.page_token)
    $o = [ordered]@{ vistas = $null; me_gusta = $null; comentarios = $null; compartidos = $null; detalle = '' }
    $v = Api Get "https://graph.facebook.com/$graph/$($id)?fields=views,likes.summary(true).limit(0),comments.summary(true).limit(0)&access_token=$tok"
    $o.vistas = Campo $v 'views'
    if ($v.likes) { $o.me_gusta = $v.likes.summary.total_count }
    if ($v.comments) { $o.comentarios = $v.comments.summary.total_count }
    if ($null -eq $o.vistas) {
        # Los reels pueden no traer "views" en el video: se piden las reproducciones en sus estadisticas
        try {
            $ins = Api Get "https://graph.facebook.com/$graph/$($id)/video_insights?metric=blue_reels_play_count&access_token=$tok"
            $d = @($ins.data)[0]
            if ($d) { $o.vistas = @($d.values)[0].value }
        } catch { $o.detalle = "Sin vistas: $_" }
    }
    $o
}

# --- Guardas de subir ---
# Clips que el usuario descarto expresamente: no van a ninguna plataforma
function Descartado([string]$clip) {
    $ruta = Join-Path $raiz 'datos\publicador\descartados.json'
    if (-not $clip -or -not (Test-Path -LiteralPath $ruta)) { return $false }
    @((LeerJson $ruta).clips) -contains $clip
}
# Cada cuenta lleva su propia version: el mismo video no se sube a dos cuentas de la misma plataforma.
# Devuelve la cuenta que ya lo tiene, o $null. Mira los resultados guardados junto a los envios.
function YaEnOtraCuenta([string]$dir, [string]$p, [string]$alias, [string]$archivo) {
    $mio = $archivo -replace '\\', '/'
    foreach ($f in @(Get-ChildItem -LiteralPath $dir -Filter '*.resultado.json')) {
        try {
            $r = LeerJson $f.FullName
            if (-not $r.ok -or $r.plataforma -ne $p) { continue }
            $e = LeerJson ($f.FullName -replace '\.resultado\.json$', '.json')
            $otra = AliasDe $e
            if ($otra -ne $alias -and (([string]$e.archivo) -replace '\\', '/') -ieq $mio) { return "$otra ($($r.fecha))" }
        } catch { }
    }
    $null
}

# --- Validacion previa (la usan subir y -Simular) ---
function Duracion([string]$archivo) {
    if (-not (Test-Path -LiteralPath $ffprobe)) { return $null }
    try {
        $s = & $ffprobe -v error -show_entries format=duration -of 'default=nw=1:nk=1' $archivo
        [math]::Round([double]::Parse(([string]@($s)[0]).Trim(), $cultura), 1)
    } catch { $null }
}
function Validar($envio, [string]$p, [string]$archivo) {
    $err = New-Object Collections.Generic.List[string]
    $avi = New-Object Collections.Generic.List[string]
    $dur = $null
    $texto = [string]$envio.texto
    if (-not $envio.archivo -or -not (Test-Path -LiteralPath $archivo)) { $err.Add("No existe el video: $($envio.archivo)") }
    elseif ((Get-Item -LiteralPath $archivo).Length -eq 0) { $err.Add('El video esta vacio') }
    else {
        $dur = Duracion $archivo
        if ($null -eq $dur) { $avi.Add('No se pudo medir la duracion (falta ffprobe en herramientas/bin)') }
    }
    if (-not $texto.Trim()) { $err.Add('Falta el texto') }
    $hashtags = [regex]::Matches($texto, '#[\p{L}\p{N}_]+').Count
    switch ($p) {
        'youtube' {
            $titulo = [string]$envio.titulo
            if (-not $titulo.Trim()) { $err.Add('Falta el titulo') }
            elseif ($titulo.Length -gt 100) { $err.Add("Titulo de $($titulo.Length) caracteres; YouTube admite 100") }
            if (($titulo + $texto) -match '[<>]') { $err.Add('YouTube no admite < ni > en el titulo ni en la descripcion') }
            if ($utf8.GetByteCount($texto) -gt 5000) { $err.Add('Descripcion de mas de 5000 bytes') }
            if ((@($envio.etiquetas | Where-Object { $_ }) -join ',').Length -gt 500) { $err.Add('Las etiquetas pasan de 500 caracteres') }
            if ($envio.privacidad -and @('private', 'unlisted', 'public') -notcontains $envio.privacidad) { $err.Add("Privacidad no valida para YouTube: $($envio.privacidad)") }
            if ($dur -gt 180) { $avi.Add('Dura mas de 3 minutos: YouTube no lo tratara como Short') }
        }
        'tiktok' {
            if ($texto.Length -gt 2200) { $err.Add("Texto de $($texto.Length) caracteres; TikTok admite 2200") }
            if ($null -ne $dur -and $dur -lt 3) { $err.Add('TikTok pide al menos 3 segundos') }
            if ($envio.privacidad -and @('PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS', 'FOLLOWER_OF_CREATOR', 'SELF_ONLY') -notcontains $envio.privacidad) { $err.Add("Privacidad no valida para TikTok: $($envio.privacidad)") }
        }
        'instagram' {
            if ($texto.Length -gt 2200) { $err.Add("Texto de $($texto.Length) caracteres; Instagram admite 2200") }
            if ($hashtags -gt 30) { $err.Add("$hashtags hashtags; Instagram admite 30") }
            if ($null -ne $dur -and ($dur -lt 3 -or $dur -gt 900)) { $err.Add("Instagram Reels admite de 3 s a 15 min; el clip dura $dur s") }
        }
        'facebook' {
            if ($null -ne $dur -and ($dur -lt 3 -or $dur -gt 90)) { $err.Add("Facebook Reels admite de 3 a 90 s; el clip dura $dur s") }
            if ($envio.privacidad -and @('PUBLISHED', 'DRAFT') -notcontains $envio.privacidad) { $err.Add("Estado no valido para Facebook: $($envio.privacidad)") }
        }
    }
    [pscustomobject]@{ errores = $err; avisos = $avi; duracion = $dur }
}

# --- Panel ---
# Lo que estado y panel cuentan de cada cuenta sin usar la red
function FilaCuenta([string]$p, $cta, $cred) {
    $script:cuentaAct = [string]$cta.alias
    $activaCta = if ($null -eq (Campo $cta 'activa')) { $true } else { [bool]$cta.activa }
    $tope = Campo $cta 'max_por_dia'
    if ($null -eq $tope) { $tope = Campo $config.plataformas.$p 'max_por_dia' }
    [ordered]@{ plataforma = $p; cuenta = [string]$cta.alias; activa = ([bool]$config.plataformas.$p.activa -and $activaCta); linea = (Campo $cta 'linea'); max_por_dia = $tope; credenciales = [bool](Campo $cred (ClaveCred $p)) }
}
function Entero($x) { if ($null -eq $x -or "$x" -eq '') { $null } else { try { [long]$x } catch { $null } } }
# Fecha de referencia de una entrada del estado, para quedarse con las de los ultimos dias
function FechaDe($e) {
    foreach ($n in 'publicado', 'aprobado', 'creado', 'ventana_hasta') {
        $v = Campo $e $n
        if ($v) { try { return [datetime]::Parse([string]$v, $cultura) } catch { } }
    }
    $null
}
# Pagina del panel. Solo ASCII: los acentos van como entidades HTML o escapes \u. Los datos entran en __DATOS__.
$plantillaPanel = @'
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Panel del Publicador</title>
<style>
:root { --fondo:#f6f5f2; --tarjeta:#ffffff; --texto:#1c1b19; --tenue:#6b6a66; --linea:#e3e1db; --acento:#0f6e56; --acento-suave:#e2f1ec; --alerta:#a4530a; --alerta-suave:#fbefdc; }
@media (prefers-color-scheme: dark) { :root { --fondo:#141413; --tarjeta:#1e1e1c; --texto:#ecebe7; --tenue:#9c9a94; --linea:#33322f; --acento:#5fc9a8; --acento-suave:#17332b; --alerta:#f0b25e; --alerta-suave:#3a2a12; } }
* { box-sizing:border-box; }
body { margin:0; background:var(--fondo); color:var(--texto); font:15px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif; }
main { max-width:1100px; margin:0 auto; padding:28px 16px 56px; }
h1 { font-size:24px; margin:0 0 4px; letter-spacing:-0.01em; }
h2 { font-size:16px; margin:34px 0 10px; }
.sub { color:var(--tenue); margin:0; font-size:13px; }
.cifras { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px; margin-top:20px; }
.cifra { background:var(--tarjeta); border:1px solid var(--linea); border-radius:10px; padding:12px 14px; }
.cifra b { display:block; font-size:26px; font-variant-numeric:tabular-nums; letter-spacing:-0.02em; }
.cifra span { color:var(--tenue); font-size:13px; }
.barra { display:flex; gap:12px; align-items:center; flex-wrap:wrap; margin-bottom:10px; }
input[type=search] { flex:1 1 220px; padding:8px 10px; border:1px solid var(--linea); border-radius:8px; background:var(--tarjeta); color:inherit; font:inherit; }
label.op { color:var(--tenue); font-size:13px; display:flex; gap:6px; align-items:center; }
.tabla { background:var(--tarjeta); border:1px solid var(--linea); border-radius:10px; overflow-x:auto; }
table { width:100%; border-collapse:collapse; }
th, td { padding:9px 12px; text-align:left; border-bottom:1px solid var(--linea); vertical-align:top; }
th { font-size:12px; font-weight:600; color:var(--tenue); white-space:nowrap; }
tbody > tr:last-child > td { border-bottom:0; }
td.n, th.n { text-align:right; font-variant-numeric:tabular-nums; white-space:nowrap; }
tr > td:first-child { min-width:210px; }
tr.pieza { cursor:pointer; }
tr.pieza:hover { background:var(--acento-suave); }
tr.pieza td:first-child::before { content:"\25B8"; display:inline-block; width:1.1em; color:var(--tenue); }
tr.pieza.abierta td:first-child::before { content:"\25BE"; }
tr.detalle > td { background:var(--fondo); padding:0; }
tr.detalle th, tr.detalle td { font-size:13px; padding:7px 12px; }
.id { display:block; color:var(--tenue); font-size:12px; font-family:ui-monospace,Consolas,monospace; overflow-wrap:anywhere; }
.marca { display:inline-block; padding:1px 8px; border-radius:99px; font-size:12px; background:var(--linea); white-space:nowrap; }
.marca.ok { background:var(--acento-suave); color:var(--acento); }
.marca.ojo { background:var(--alerta-suave); color:var(--alerta); }
a { color:var(--acento); }
.vacio { padding:18px 14px; color:var(--tenue); }
ul.avisos { margin:0; padding-left:18px; color:var(--tenue); font-size:13px; }
</style>
</head>
<body>
<main>
<h1>Panel del Publicador</h1>
<p class="sub" id="sub"></p>
<div class="cifras" id="cifras"></div>

<h2>Piezas</h2>
<div class="barra">
  <input type="search" id="buscar" placeholder="Buscar por gancho o id" aria-label="Buscar piezas">
  <label class="op"><input type="checkbox" id="todas"> Incluir lo que a&uacute;n no ha salido</label>
</div>
<div class="tabla"><table>
  <thead><tr><th>Pieza</th><th class="n">Versiones</th><th class="n">Publicadas</th><th class="n">En la bandeja</th><th class="n">En cola</th><th>D&oacute;nde</th><th class="n">Vistas</th><th class="n">Me gusta</th></tr></thead>
  <tbody id="piezas"></tbody>
</table></div>

<h2>Cuentas</h2>
<div class="tabla"><table>
  <thead><tr><th>Plataforma</th><th>Cuenta</th><th>L&iacute;nea</th><th>Estado</th><th class="n">Hoy / tope</th><th class="n" id="thDias"></th><th class="n">Vistas</th></tr></thead>
  <tbody id="cuentas"></tbody>
</table></div>

<div id="zonaAvisos"></div>
</main>
<script id="datos" type="application/json">__DATOS__</script>
<script>
(function () {
  var D = JSON.parse(document.getElementById('datos').textContent);
  var filas = D.filas || [], cuentas = D.cuentas || [], avisos = D.avisos || [];
  var RAYA = '\u2014';
  var NOMBRES = { publicado: 'Publicado', en_borradores: 'En la bandeja', procesando: 'Procesando', aprobado: 'Aprobado', pendiente_aprobacion: 'Por aprobar', error: 'Error', rechazado: 'Rechazado', vencido: 'Vencido' };
  var ORDEN = { publicado: 0, en_borradores: 1, procesando: 2, aprobado: 3, pendiente_aprobacion: 4, error: 5, vencido: 6, rechazado: 7 };
  var FUERA = { publicado: 1, en_borradores: 1, procesando: 1 };
  var COLA = { aprobado: 1, pendiente_aprobacion: 1 };
  var PLATAFORMAS = { youtube: 'YouTube', tiktok: 'TikTok', instagram: 'Instagram', facebook: 'Facebook' };

  function h(tag, attrs) {
    var e = document.createElement(tag), k, i, c;
    if (attrs) for (k in attrs) {
      if (k === 'text') e.textContent = attrs[k]; else if (k === 'cls') e.className = attrs[k]; else e.setAttribute(k, attrs[k]);
    }
    for (i = 2; i < arguments.length; i++) { c = arguments[i]; if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); }
    return e;
  }
  function num(x) { return x == null || x === '' ? RAYA : Number(x).toLocaleString('es-CO'); }
  function suma(lista, campo) {
    var t = null;
    lista.forEach(function (f) { if (f[campo] != null && f[campo] !== '') t = (t || 0) + Number(f[campo]); });
    return t;
  }
  function unicos(lista) { var v = {}, r = []; lista.forEach(function (x) { if (!v[x]) { v[x] = 1; r.push(x); } }); return r; }
  function fecha(s) {
    if (!s) return RAYA;
    var d = new Date(s);
    if (isNaN(d)) return s;
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  function mismoDia(s, d) { var x = new Date(s); return !isNaN(x) && x.getFullYear() === d.getFullYear() && x.getMonth() === d.getMonth() && x.getDate() === d.getDate(); }
  function plataforma(p) { return PLATAFORMAS[p] || p; }
  function marca(estado) {
    var cls = 'marca' + (estado === 'publicado' ? ' ok' : (estado === 'error' || estado === 'vencido' ? ' ojo' : ''));
    return h('span', { cls: cls, text: NOMBRES[estado] || estado });
  }

  // Una pieza es un momento: el clip original y sus variantes
  var mapa = {}, piezas = [];
  filas.forEach(function (f) {
    var p = mapa[f.pieza];
    if (!p) { p = mapa[f.pieza] = { id: f.pieza, titulo: null, filas: [] }; piezas.push(p); }
    p.filas.push(f);
    if (f.gancho && (f.clip === f.pieza || !p.titulo)) p.titulo = f.gancho;
  });
  piezas.forEach(function (p) {
    var fuera = p.filas.filter(function (f) { return FUERA[f.estado]; });
    p.versiones = unicos(p.filas.map(function (f) { return f.clip; })).length;
    p.publicadas = fuera.filter(function (f) { return f.estado === 'publicado'; }).length;
    p.bandeja = fuera.length - p.publicadas;
    p.cola = p.filas.filter(function (f) { return COLA[f.estado]; }).length;
    p.donde = unicos(fuera.map(function (f) { return plataforma(f.plataforma) + (f.cuenta && f.cuenta !== 'principal' ? ' (' + f.cuenta + ')' : ''); }));
    p.vistas = suma(p.filas, 'vistas');
    p.megusta = suma(p.filas, 'me_gusta');
    p.ultima = fuera.map(function (f) { return f.publicado || ''; }).sort().pop() || '';
    p.texto = ((p.titulo || '') + ' ' + p.id + ' ' + p.filas.map(function (f) { return f.clip; }).join(' ')).toLowerCase();
    p.filas.sort(function (a, b) { return (ORDEN[a.estado] - ORDEN[b.estado]) || a.clip.localeCompare(b.clip) || a.plataforma.localeCompare(b.plataforma); });
  });
  piezas.sort(function (a, b) {
    return ((b.vistas == null ? -1 : b.vistas) - (a.vistas == null ? -1 : a.vistas)) || (b.publicadas - a.publicadas) || (b.bandeja - a.bandeja) || b.ultima.localeCompare(a.ultima) || a.id.localeCompare(b.id);
  });

  function detalle(p) {
    var cuerpo = h('tbody');
    p.filas.forEach(function (f) {
      var version = f.clip === p.id ? 'Original' : 'Variante';
      var celda = h('td', null, version, h('span', { cls: 'id', text: f.clip }));
      if (f.diferencia) celda.appendChild(h('span', { cls: 'id', text: f.diferencia }));
      cuerpo.appendChild(h('tr', null, celda,
        h('td', { text: plataforma(f.plataforma) }), h('td', { text: f.cuenta || 'principal' }), h('td', null, marca(f.estado)),
        h('td', { text: fecha(f.publicado) }), h('td', { cls: 'n', text: num(f.vistas) }), h('td', { cls: 'n', text: num(f.me_gusta) }),
        h('td', { cls: 'n', text: num(f.comentarios) }),
        h('td', null, f.url ? h('a', { href: f.url, target: '_blank', rel: 'noopener', text: 'Abrir' }) : RAYA)));
    });
    var cab = h('thead', null, h('tr', null, h('th', { text: 'Versi\u00f3n' }), h('th', { text: 'Plataforma' }), h('th', { text: 'Cuenta' }), h('th', { text: 'Estado' }),
      h('th', { text: 'Subido' }), h('th', { cls: 'n', text: 'Vistas' }), h('th', { cls: 'n', text: 'Me gusta' }), h('th', { cls: 'n', text: 'Comentarios' }), h('th', { text: 'Enlace' })));
    return h('tr', { cls: 'detalle' }, h('td', { colspan: '8' }, h('table', null, cab, cuerpo)));
  }

  var tabla = document.getElementById('piezas'), buscar = document.getElementById('buscar'), todas = document.getElementById('todas');
  function pintar() {
    var q = buscar.value.trim().toLowerCase(), n = 0;
    tabla.textContent = '';
    piezas.forEach(function (p) {
      if (!todas.checked && !(p.publicadas + p.bandeja)) return;
      if (q && p.texto.indexOf(q) < 0) return;
      n++;
      var fila = h('tr', { cls: 'pieza', tabindex: '0' },
        h('td', null, p.titulo || p.id, h('span', { cls: 'id', text: p.id })),
        h('td', { cls: 'n', text: num(p.versiones) }), h('td', { cls: 'n', text: num(p.publicadas) }), h('td', { cls: 'n', text: num(p.bandeja) }),
        h('td', { cls: 'n', text: num(p.cola) }), h('td', { text: p.donde.join(', ') || RAYA }),
        h('td', { cls: 'n', text: num(p.vistas) }), h('td', { cls: 'n', text: num(p.megusta) }));
      var abierto = null;
      function alternar() {
        if (abierto) { abierto.remove(); abierto = null; fila.classList.remove('abierta'); }
        else { abierto = detalle(p); fila.after(abierto); fila.classList.add('abierta'); }
      }
      fila.addEventListener('click', alternar);
      fila.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); alternar(); } });
      tabla.appendChild(fila);
    });
    if (!n) tabla.appendChild(h('tr', null, h('td', { colspan: '8', cls: 'vacio', text: piezas.length ? 'Nada coincide. Marca la casilla para ver tambi\u00e9n lo que a\u00fan no ha salido.' : 'Todav\u00eda no hay nada en la cola del Publicador.' })));
  }
  buscar.addEventListener('input', pintar);
  todas.addEventListener('change', pintar);
  pintar();

  // Cuentas
  var hoy = new Date(), cuerpoCuentas = document.getElementById('cuentas');
  document.getElementById('thDias').textContent = '\u00daltimos ' + D.dias + ' d\u00edas';
  cuentas.forEach(function (c) {
    var suyas = filas.filter(function (f) { return f.plataforma === c.plataforma && (f.cuenta || 'principal') === c.cuenta && FUERA[f.estado]; });
    var deHoy = suyas.filter(function (f) { return mismoDia(f.publicado, hoy); }).length;
    var estado = !c.activa ? h('span', { cls: 'marca', text: 'Inactiva' }) : (c.credenciales ? h('span', { cls: 'marca ok', text: 'Lista' }) : h('span', { cls: 'marca ojo', text: 'Sin credenciales en esta PC' }));
    cuerpoCuentas.appendChild(h('tr', null, h('td', { text: plataforma(c.plataforma) }), h('td', { text: c.cuenta }), h('td', { text: c.linea || RAYA }), h('td', null, estado),
      h('td', { cls: 'n', text: deHoy + ' / ' + (c.max_por_dia == null ? RAYA : c.max_por_dia) }), h('td', { cls: 'n', text: num(suyas.length) }), h('td', { cls: 'n', text: num(suma(suyas, 'vistas')) })));
  });

  // Cifras de arriba
  var fueraTodas = filas.filter(function (f) { return FUERA[f.estado]; });
  var publicadas = fueraTodas.filter(function (f) { return f.estado === 'publicado'; }).length;
  var cifras = [
    [piezas.filter(function (p) { return p.publicadas + p.bandeja; }).length, 'Piezas que ya salieron'],
    [publicadas, 'Publicaciones'],
    [fueraTodas.length - publicadas, 'En la bandeja o en proceso'],
    [filas.filter(function (f) { return COLA[f.estado]; }).length, 'En cola'],
    [cuentas.filter(function (c) { return c.activa && c.credenciales; }).length, 'Cuentas listas'],
    [suma(filas, 'vistas'), 'Vistas medidas']
  ];
  var zona = document.getElementById('cifras');
  cifras.forEach(function (c) { zona.appendChild(h('div', { cls: 'cifra' }, h('b', { text: num(c[0]) }), h('span', { text: c[1] }))); });

  document.getElementById('sub').textContent = 'Generado el ' + fecha(D.generado) + ' \u00b7 \u00faltimos ' + D.dias + ' d\u00edas \u00b7 ' +
    (D.medido ? 'vistas le\u00eddas el ' + fecha(D.medido) : 'vistas sin leer todav\u00eda') + (D.simulacion ? ' \u00b7 en simulaci\u00f3n' : '');

  if (avisos.length) {
    var lista = h('ul', { cls: 'avisos' });
    avisos.forEach(function (a) { lista.appendChild(h('li', { text: a })); });
    var z = document.getElementById('zonaAvisos');
    z.appendChild(h('h2', { text: 'Avisos' }));
    z.appendChild(lista);
  }
})();
</script>
</body>
</html>
'@

switch ($Accion) {
    'estado' {
        $cred = LeerCred
        # Una fila por cuenta. "cuenta" es el alias de config.json; "nombre", como se llama en la plataforma.
        $lista = foreach ($p in $plataformas) { foreach ($cta in @(CuentasDe $p)) {
            $o = FilaCuenta $p $cta $cred
            $c = Campo $cred (ClaveCred $p)
            $o.token = 'sin_credenciales'; $o.nombre = $null; $o.detalle = ''
            if ($c) {
                try {
                    switch ($p) {
                        'youtube' { $o.nombre = @((Api Get 'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true' $null @{ Authorization = "Bearer $(TokenYoutube)" }).items)[0].snippet.title }
                        'tiktok' {
                            # Nombre visible de la cuenta conectada (user.info.basic), para saber adonde van los videos
                            $hTk = @{ Authorization = "Bearer $(TokenTiktok)" }
                            $yo = Api Get 'https://open.tiktokapis.com/v2/user/info/?fields=display_name' $null $hTk
                            RevisarTiktok $yo
                            $u = UsuarioTiktok $c
                            $o.nombre = if ($u) { "@$u ($($yo.data.user.display_name))" } else { $yo.data.user.display_name }
                            # Privacidades que TikTok admite hoy en publicacion directa (sin auditoria: solo SELF_ONLY)
                            try {
                                $ci = Api Post 'https://open.tiktokapis.com/v2/post/publish/creator_info/query/' '{}' $hTk
                                RevisarTiktok $ci
                                $o.detalle = "directo admite: $(@($ci.data.privacy_level_options) -join ', ')"
                            } catch { $o.detalle = "directo no disponible: $_" }
                        }
                        'instagram' { $ci = CredInstagram; $o.nombre = (Api Get "$(BaseInstagram)/$($ci.ig_user_id)?fields=username&access_token=$([Uri]::EscapeDataString($ci.access_token))").username }
                        'facebook' { $o.nombre = (Api Get "https://graph.facebook.com/$graph/$($c.page_id)?fields=name&access_token=$([Uri]::EscapeDataString($c.page_token))").name }
                    }
                    $o.token = 'valido'
                } catch { $o.token = 'error'; $o.detalle = "$_" }
            }
            $o
        } }
        Salir ([ordered]@{ fecha = (Ahora); modo = $config.modo; simulacion = [bool]$config.simulacion; plataformas = @($lista) }) $true
    }

    'subir' {
        $res = [ordered]@{ ok = $false; plataforma = $Plataforma; cuenta = $null; clip = $null; simulado = [bool]$Simular; estado = $null; id_publicacion = $null; url = $null; privacidad = $null; duracion_seg = $null; avisos = @(); error = $null; fecha = (Ahora) }
        try {
            if (-not $Plataforma -or -not $Datos) { throw 'Uso: subir -Plataforma <p> -Datos <envio.json> [-Simular]' }
            $rutaDatos = if ([IO.Path]::IsPathRooted($Datos)) { $Datos } else { Join-Path $raiz $Datos }
            $envio = LeerJson $rutaDatos
            $res.clip = $envio.clip
            if ($envio.plataforma -and $envio.plataforma -ne $Plataforma) { throw "El envio es para $($envio.plataforma), no para $Plataforma" }
            # La cuenta la decide el envio; -Cuenta solo sirve para comprobar que se sube adonde se cree
            $alias = AliasDe $envio
            $res.cuenta = $alias
            if ($Cuenta -and $Cuenta -ne $alias) { throw "El envio es para la cuenta $alias, no para $Cuenta" }
            UsarCuenta $Plataforma $alias
            if (Descartado ([string]$envio.clip)) { $res.estado = 'descartado'; throw 'El usuario descarto este clip (datos/publicador/descartados.json). No se sube a ninguna plataforma.' }
            $archivo = Join-Path $raiz ([string]$envio.archivo)
            $v = Validar $envio $Plataforma $archivo
            $res.avisos = @($v.avisos)
            $res.duracion_seg = $v.duracion
            if ($v.errores.Count) { $res.estado = 'invalido'; throw ($v.errores -join ' | ') }
            if ($Simular) { $res.ok = $true; $res.estado = 'simulado'; Salir $res $true }

            # Guardas para no publicar nunca dos veces lo mismo
            $rutaRes = $rutaDatos -replace '\.json$', '.resultado.json'
            $marca = $rutaDatos -replace '\.json$', '.enviando'
            if (Test-Path -LiteralPath $rutaRes) {
                $previo = LeerJson $rutaRes
                if ($previo.ok) { $res.estado = 'duplicado'; throw "Este envio ya se subio ($($previo.id_publicacion), $($previo.fecha)). No se repite." }
            }
            if (Test-Path -LiteralPath $marca) { $res.estado = 'interrumpido'; throw "Una subida anterior de este envio se corto a medias. Revisa la plataforma: si no se publico, borra $marca y reintenta." }
            $otra = YaEnOtraCuenta (Split-Path $rutaDatos) $Plataforma $alias ([string]$envio.archivo)
            if ($otra) { $res.estado = 'repetido'; throw "Este mismo video ya se subio a $Plataforma en la cuenta $otra. Cada cuenta lleva una version distinta: usa una variante del Clipero." }
            if (-not $config.plataformas.$Plataforma.activa) { throw "La plataforma $Plataforma no esta activa en config.json" }
            $cfgCta = CfgCuenta $Plataforma $alias
            if ($null -ne (Campo $cfgCta 'activa') -and -not $cfgCta.activa) { throw "La cuenta $alias de $Plataforma no esta activa en config.json" }
            if ($config.simulacion) { throw 'config.json tiene simulacion: true; solo se admite -Simular' }

            # La marca solo sobrevive si el proceso muere a mitad de la subida
            [IO.File]::WriteAllText($marca, (Ahora), $utf8)
            try {
                $r = switch ($Plataforma) {
                    'youtube' { SubirYoutube $envio $archivo }
                    'tiktok' { SubirTiktok $envio $archivo }
                    'instagram' { SubirInstagram $envio $archivo }
                    'facebook' { SubirFacebook $envio $archivo }
                }
            } finally { Remove-Item -LiteralPath $marca -Force }
            foreach ($k in @($r.Keys)) { $res[$k] = $r[$k] }
            $res.ok = $true
            EscribirJson $rutaRes $res
            Salir $res $true
        } catch {
            $res.error = "$_"
            if (-not $res.estado) { $res.estado = 'error' }
            Salir $res $false
        }
    }

    'comprobar' {
        $res = [ordered]@{ ok = $false; plataforma = $Plataforma; cuenta = $(if ($Cuenta) { $Cuenta } else { 'principal' }); id_publicacion = $IdPublicacion; estado = $null; url = $null; detalle = $null; error = $null; fecha = (Ahora) }
        try {
            if (-not $Plataforma -or -not $IdPublicacion) { throw 'Uso: comprobar -Plataforma <p> -IdPublicacion <id> [-Cuenta <alias>]' }
            UsarCuenta $Plataforma $Cuenta
            $r = switch ($Plataforma) {
                'youtube' { ComprobarYoutube $IdPublicacion }
                'tiktok' { ComprobarTiktok $IdPublicacion }
                'instagram' { ComprobarInstagram $IdPublicacion }
                'facebook' { ComprobarFacebook $IdPublicacion }
            }
            foreach ($k in @($r.Keys)) { $res[$k] = $r[$k] }
            $res.ok = $true
            Salir $res $true
        } catch {
            $res.error = "$_"
            Salir $res $false
        }
    }

    'panel' {
        $res = [ordered]@{ ok = $false; panel = 'salidas/publicador/panel.html'; piezas = 0; publicaciones = 0; mediciones = 0; vistas = $null; avisos = @(); error = $null; fecha = (Ahora) }
        try {
            $cfgPanel = Campo $config 'panel'
            $dias = if (Campo $cfgPanel 'dias') { [int]$cfgPanel.dias } else { 30 }
            $maxMed = if (Campo $cfgPanel 'max_mediciones') { [int]$cfgPanel.max_mediciones } else { 150 }
            $avisos = New-Object Collections.Generic.List[string]
            $cred = LeerCred

            $rutaEstado = Join-Path $raiz 'datos\publicador\estado.json'
            $entradas = if (Test-Path -LiteralPath $rutaEstado) { @((LeerJson $rutaEstado).entradas | Where-Object { $_ }) } else { @() }
            $desde = (Get-Date).AddDays(-$dias)
            $recientes = @($entradas | Where-Object { $f = FechaDe $_; -not $f -or $f -ge $desde })
            # clips.json del Clipero: el gancho de cada clip y de que original es variante
            $clips = @{}
            $rutaClips = Join-Path $raiz 'salidas\clipero\clips.json'
            if (Test-Path -LiteralPath $rutaClips) { foreach ($c in @((LeerJson $rutaClips).clips)) { if ($c.id) { $clips[[string]$c.id] = $c } } }
            # Mediciones anteriores: se conservan si hoy no se puede leer alguna
            $rutaMet = Join-Path $raiz 'datos\publicador\metricas.json'
            $met = @{}
            $medidoEn = $null
            if (Test-Path -LiteralPath $rutaMet) {
                $previas = LeerJson $rutaMet
                $medidoEn = Campo $previas 'actualizado'
                foreach ($m in @($previas.publicaciones)) { if ($m.clip) { $met["$($m.clip)|$($m.plataforma)"] = $m } }
            }

            if (-not $SinRed) {
                $fallos = @{}
                $avisado = @{}
                $medibles = @($recientes | Where-Object { $_.estado -eq 'publicado' -and $_.id_publicacion } | Sort-Object { [string]$_.publicado } -Descending | Select-Object -First $maxMed)
                foreach ($e in $medibles) {
                    $p = [string]$e.plataforma
                    $alias = AliasDe $e
                    $par = "$p/$alias"
                    if ($plataformas -notcontains $p -or [int]$fallos[$par] -ge 3) { continue }
                    if ($p -eq 'tiktok' -and -not (Campo $config.plataformas.tiktok 'leer_metricas')) {
                        if (-not $avisado['tiktok']) { $avisado['tiktok'] = $true; $avisos.Add('TikTok: no se leen las vistas porque tiktok.leer_metricas esta en false (plataformas.md, seccion 11).') }
                        continue
                    }
                    try {
                        UsarCuenta $p $alias
                        if (-not (Campo $cred (ClaveCred $p))) {
                            $fallos[$par] = 3
                            $avisos.Add("$($par): sin credenciales en esta PC; no se leen sus vistas.")
                            continue
                        }
                        $id = [string]$e.id_publicacion
                        $m = switch ($p) {
                            'youtube' { MetricasYoutube $id }
                            'tiktok' { MetricasTiktok $id }
                            'instagram' { MetricasInstagram $id }
                            'facebook' { MetricasFacebook $id }
                        }
                        $met["$($e.clip)|$p"] = [pscustomobject]([ordered]@{
                            clip = [string]$e.clip; plataforma = $p; cuenta = $alias
                            vistas = (Entero $m.vistas); me_gusta = (Entero $m.me_gusta); comentarios = (Entero $m.comentarios); compartidos = (Entero $m.compartidos)
                            medido = (Ahora); detalle = [string]$m.detalle
                        })
                        if ($m.detalle -and -not $avisado[$par]) { $avisado[$par] = $true; $avisos.Add("$($par): $($m.detalle)") }
                        $fallos[$par] = 0
                        $res.mediciones++
                    } catch {
                        $fallos[$par] = [int]$fallos[$par] + 1
                        $avisos.Add("$($par), $($e.clip): $_")
                        if ($fallos[$par] -ge 3) { $avisos.Add("$($par): tres errores seguidos; no se leen mas vistas de esta cuenta en esta pasada.") }
                    }
                }
                $medidoEn = Ahora
                EscribirJson $rutaMet ([ordered]@{ actualizado = $medidoEn; publicaciones = @($met.Values | Sort-Object { [string]$_.clip }, { [string]$_.plataforma }) })
            }

            $filas = foreach ($e in $recientes) {
                $ci = $clips[[string]$e.clip]
                $pieza = Campo $e 'pieza'
                if (-not $pieza) { $pieza = Campo $ci 'variante_de' }
                if (-not $pieza) { $pieza = $e.clip }
                $gancho = Campo $e 'gancho'
                if (-not $gancho) { $gancho = Campo $ci 'gancho' }
                $m = $met["$($e.clip)|$($e.plataforma)"]
                [ordered]@{
                    pieza = [string]$pieza; clip = [string]$e.clip; gancho = $gancho; diferencia = (Campo $ci 'diferencia')
                    plataforma = [string]$e.plataforma; cuenta = (AliasDe $e); estado = [string]$e.estado
                    publicado = (Campo $e 'publicado'); url = (Campo $e 'url'); privacidad = (Campo $e 'privacidad'); ventana_hasta = (Campo $e 'ventana_hasta')
                    vistas = (Campo $m 'vistas'); me_gusta = (Campo $m 'me_gusta'); comentarios = (Campo $m 'comentarios'); compartidos = (Campo $m 'compartidos'); medido = (Campo $m 'medido')
                }
            }
            $filas = @($filas)
            $ctas = @(foreach ($p in $plataformas) { foreach ($cta in @(CuentasDe $p)) { FilaCuenta $p $cta $cred } })

            $datosPanel = [ordered]@{
                generado = (Ahora); dias = $dias; medido = $medidoEn; modo = $config.modo; simulacion = [bool]$config.simulacion
                cuentas = $ctas; filas = $filas; avisos = @($avisos)
            }
            $dirSalida = Join-Path $raiz 'salidas\publicador'
            if (-not (Test-Path -LiteralPath $dirSalida)) { New-Item -ItemType Directory -Force $dirSalida | Out-Null }
            $json = ConvertTo-Json -InputObject $datosPanel -Depth 8 -Compress
            [IO.File]::WriteAllText((Join-Path $dirSalida 'panel.html'), $plantillaPanel.Replace('__DATOS__', $json), $utf8)

            $fuera = @($filas | Where-Object { 'publicado', 'en_borradores', 'procesando' -contains $_.estado })
            $res.piezas = @($fuera | ForEach-Object { $_.pieza } | Sort-Object -Unique).Count
            $res.publicaciones = @($fuera | Where-Object { $_.estado -eq 'publicado' }).Count
            $conVistas = @($filas | Where-Object { $null -ne $_.vistas })
            if ($conVistas.Count) { $res.vistas = ($conVistas | ForEach-Object { [long]$_.vistas } | Measure-Object -Sum).Sum }
            $res.avisos = @($avisos)
            $res.ok = $true
            Salir $res $true
        } catch {
            $res.error = "$_"
            Salir $res $false
        }
    }

    'autorizar' {
        if (-not $Plataforma) { throw 'Uso: autorizar -Plataforma <youtube|tiktok|instagram|facebook> [-Cuenta <alias>]' }
        UsarCuenta $Plataforma $Cuenta
        Write-Host "Autorizar $Plataforma, cuenta $cuentaAct. Los datos se guardan en $rutaCred (fuera del proyecto)."
        if ($cuentaAct -ne 'principal') { Write-Host 'OJO: en el navegador entra con la cuenta que corresponde a este alias, no con la principal.' }
        Write-Host 'Pasos previos en legion/03-publicador/plataformas.md'
        switch ($Plataforma) {
            'youtube' {
                $id = (Read-Host 'client_id del cliente OAuth (tipo Aplicacion de escritorio)').Trim()
                $secreto = (LeerSecreto 'client_secret').Trim()
                $redir = "http://127.0.0.1:$($config.puerto_oauth)"
                $verif = Aleatorio 64
                $estadoOauth = Aleatorio 24
                $url = 'https://accounts.google.com/o/oauth2/v2/auth?' + (Formulario ([ordered]@{
                    client_id = $id; redirect_uri = $redir; response_type = 'code'; access_type = 'offline'; prompt = 'select_account consent'
                    scope = 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly'
                    code_challenge = (Base64Url (Sha256 $verif)); code_challenge_method = 'S256'; state = $estadoOauth
                }))
                $codigo = PedirCodigo $url $redir $estadoOauth
                $t = Api Post 'https://oauth2.googleapis.com/token' (Formulario @{ code = $codigo; client_id = $id; client_secret = $secreto; redirect_uri = $redir; grant_type = 'authorization_code'; code_verifier = $verif }) @{} $tipoForm
                if (-not $t.refresh_token) { throw 'Google no entrego refresh_token. Quita el acceso de la app en tu cuenta de Google y vuelve a autorizar.' }
                GuardarPlataforma 'youtube' ([ordered]@{ client_id = $id; client_secret = $secreto; refresh_token = $t.refresh_token; autorizado = (Ahora) })
            }
            'tiktok' {
                $clave = Dato 'client_key de la app de TikTok' 'LEGION_CLIENT_KEY'
                $secreto = Dato 'client_secret' 'LEGION_CLIENT_SECRET' -Secreto
                $usuario = (Dato 'Tu usuario de TikTok, sin @ (solo para armar los enlaces)' 'LEGION_USUARIO').TrimStart('@')
                if (-not $clave -or -not $secreto) { throw 'Falta el client_key o el client_secret (se pego vacio). Vuelve a ejecutar el comando.' }
                $redir = $config.plataformas.tiktok.redirect_uri
                $verif = Aleatorio 64
                $estadoOauth = Aleatorio 24
                # TikTok (Login Kit para escritorio) pide el SHA-256 del verificador en hexadecimal, no en base64url
                # video.list (leer las vistas para el panel) solo se pide si la app lo tiene: tiktok.leer_metricas
                $permisos = 'user.info.basic,video.upload,video.publish'
                if (Campo $config.plataformas.tiktok 'leer_metricas') { $permisos += ',video.list' }
                $url = 'https://www.tiktok.com/v2/auth/authorize/?' + (Formulario ([ordered]@{
                    client_key = $clave; scope = $permisos; response_type = 'code'
                    redirect_uri = $redir; state = $estadoOauth; code_challenge = (Hex (Sha256 $verif)); code_challenge_method = 'S256'
                }))
                $codigo = PedirCodigo $url $redir $estadoOauth
                $t = Api Post 'https://open.tiktokapis.com/v2/oauth/token/' (Formulario @{ client_key = $clave; client_secret = $secreto; code = $codigo; grant_type = 'authorization_code'; redirect_uri = $redir; code_verifier = $verif }) @{} $tipoForm
                if (-not $t.refresh_token) { throw "TikTok no entrego refresh_token: $($t.error) $($t.error_description)" }
                GuardarPlataforma 'tiktok' ([ordered]@{ client_key = $clave; client_secret = $secreto; refresh_token = $t.refresh_token; open_id = $t.open_id; usuario = $usuario; autorizado = (Ahora) })
            }
            'instagram' {
                if ($config.plataformas.instagram.api -eq 'facebook') {
                    $igId = (Read-Host 'ID de la cuenta de Instagram (instagram_business_account)').Trim()
                    $tok = (LeerSecreto 'Token de acceso de larga duracion').Trim()
                } else {
                    $tok = (LeerSecreto 'Token de acceso de Instagram (panel de la app: Generar token)').Trim()
                    $yo = Api Get "https://graph.instagram.com/$graph/me?fields=user_id,username&access_token=$([Uri]::EscapeDataString($tok))"
                    $igId = $yo.user_id
                    Write-Host "Cuenta: @$($yo.username)"
                }
                GuardarPlataforma 'instagram' ([ordered]@{ ig_user_id = $igId; access_token = $tok; renovado = (Ahora); autorizado = (Ahora) })
            }
            'facebook' {
                $pagina = (Read-Host 'ID de la pagina de Facebook').Trim()
                $tok = (LeerSecreto 'Token de acceso de la pagina (larga duracion)').Trim()
                $info = Api Get "https://graph.facebook.com/$graph/$($pagina)?fields=name&access_token=$([Uri]::EscapeDataString($tok))"
                Write-Host "Pagina: $($info.name)"
                GuardarPlataforma 'facebook' ([ordered]@{ page_id = $pagina; page_token = $tok; autorizado = (Ahora) })
            }
        }
        Write-Host "Listo: credenciales de $Plataforma (cuenta $cuentaAct) guardadas. Comprueba con: publicar.ps1 estado"
    }
}
