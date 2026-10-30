# Herramienta del Publicador (Agente 03 de la Legion). Acciones:
#   estado
#       -> JSON con cada plataforma: activa en config.json, credenciales, si el token funciona y la cuenta
#   subir -Plataforma <p> -Datos <envio.json> [-Simular]
#       -> valida el envio y sube el clip. Con -Simular solo valida (no usa la red).
#          Guarda <envio>.resultado.json junto al envio y nunca sube dos veces el mismo envio.
#   comprobar -Plataforma <p> -IdPublicacion <id>
#       -> estado del procesamiento en la plataforma (en Instagram publica el contenedor cuando ya esta listo)
#   autorizar -Plataforma <p>
#       -> SOLO LA EJECUTA EL USUARIO, en su propia ventana de PowerShell: pide los datos de la app,
#          abre el navegador si hace falta y guarda las credenciales fuera del proyecto.
# Plataformas: youtube, tiktok, instagram, facebook. Requisitos de cada una: legion/03-publicador/plataformas.md
# Uso: powershell -NoProfile -ExecutionPolicy Bypass -File legion/03-publicador/publicar.ps1 <accion> ...

param(
    [Parameter(Mandatory = $true, Position = 0)][ValidateSet('estado', 'subir', 'comprobar', 'autorizar')][string]$Accion,
    [ValidateSet('youtube', 'tiktok', 'instagram', 'facebook')][string]$Plataforma,
    [string]$Datos,
    [string]$IdPublicacion,
    [switch]$Simular
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

# --- Credenciales: viven fuera del proyecto y nunca se imprimen ---
function LeerCred { if (Test-Path -LiteralPath $rutaCred) { LeerJson $rutaCred } else { New-Object psobject } }
function GuardarPlataforma([string]$p, $datos) {
    $cred = LeerCred
    $cred | Add-Member -NotePropertyName $p -NotePropertyValue $datos -Force
    $dir = Split-Path $rutaCred
    if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Force $dir | Out-Null }
    EscribirJson $rutaCred $cred
}
function CredDe([string]$p) {
    $c = Campo (LeerCred) $p
    if (-not $c) { throw "No hay credenciales de $p. El usuario debe ejecutar en su PowerShell: powershell -NoProfile -ExecutionPolicy Bypass -File legion/03-publicador/publicar.ps1 autorizar -Plataforma $p" }
    $c
}
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
    $c = CredDe 'youtube'
    (Api Post 'https://oauth2.googleapis.com/token' (Formulario @{ client_id = $c.client_id; client_secret = $c.client_secret; refresh_token = $c.refresh_token; grant_type = 'refresh_token' }) @{} $tipoForm).access_token
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
function ComprobarYoutube([string]$id) {
    $r = Api Get "https://www.googleapis.com/youtube/v3/videos?part=status&id=$([Uri]::EscapeDataString($id))" $null @{ Authorization = "Bearer $(TokenYoutube)" }
    $v = @($r.items)[0]
    if (-not $v) { return [ordered]@{ estado = 'error'; detalle = 'YouTube no encuentra el video (borrado o de otra cuenta)' } }
    $estado = switch ($v.status.uploadStatus) { 'processed' { 'publicado' } 'uploaded' { 'procesando' } default { 'error' } }
    [ordered]@{ estado = $estado; url = "https://www.youtube.com/shorts/$id"; privacidad = $v.status.privacyStatus; detalle = "$($v.status.uploadStatus) $($v.status.rejectionReason) $($v.status.failureReason)".Trim() }
}

# --- TikTok (Content Posting API) ---
function TokenTiktok {
    $c = CredDe 'tiktok'
    $r = Api Post 'https://open.tiktokapis.com/v2/oauth/token/' (Formulario @{ client_key = $c.client_key; client_secret = $c.client_secret; grant_type = 'refresh_token'; refresh_token = $c.refresh_token }) @{} $tipoForm
    if (-not $r.access_token) { throw "TikTok no renovo el token: $($r.error) $($r.error_description)" }
    # TikTok puede entregar un refresh_token nuevo: se guarda para el proximo uso
    if ($r.refresh_token -and $r.refresh_token -ne $c.refresh_token) {
        $c.refresh_token = $r.refresh_token
        GuardarPlataforma 'tiktok' $c
    }
    $r.access_token
}
# El usuario (sin @) solo sirve para armar enlaces; si no se dio al autorizar, se toma de config.json
function UsuarioTiktok($c) {
    $u = Campo $c 'usuario'
    if (-not $u) { $u = Campo $config.plataformas.tiktok 'usuario' }
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

switch ($Accion) {
    'estado' {
        $cred = LeerCred
        $lista = foreach ($p in $plataformas) {
            $c = Campo $cred $p
            $o = [ordered]@{ plataforma = $p; activa = [bool]$config.plataformas.$p.activa; credenciales = [bool]$c; token = 'sin_credenciales'; cuenta = $null; detalle = '' }
            if ($c) {
                try {
                    switch ($p) {
                        'youtube' { $o.cuenta = @((Api Get 'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true' $null @{ Authorization = "Bearer $(TokenYoutube)" }).items)[0].snippet.title }
                        'tiktok' { TokenTiktok | Out-Null; $o.cuenta = UsuarioTiktok $c }
                        'instagram' { $ci = CredInstagram; $o.cuenta = (Api Get "$(BaseInstagram)/$($ci.ig_user_id)?fields=username&access_token=$([Uri]::EscapeDataString($ci.access_token))").username }
                        'facebook' { $o.cuenta = (Api Get "https://graph.facebook.com/$graph/$($c.page_id)?fields=name&access_token=$([Uri]::EscapeDataString($c.page_token))").name }
                    }
                    $o.token = 'valido'
                } catch { $o.token = 'error'; $o.detalle = "$_" }
            }
            $o
        }
        Salir ([ordered]@{ fecha = (Ahora); modo = $config.modo; simulacion = [bool]$config.simulacion; plataformas = @($lista) }) $true
    }

    'subir' {
        $res = [ordered]@{ ok = $false; plataforma = $Plataforma; clip = $null; simulado = [bool]$Simular; estado = $null; id_publicacion = $null; url = $null; privacidad = $null; duracion_seg = $null; avisos = @(); error = $null; fecha = (Ahora) }
        try {
            if (-not $Plataforma -or -not $Datos) { throw 'Uso: subir -Plataforma <p> -Datos <envio.json> [-Simular]' }
            $rutaDatos = if ([IO.Path]::IsPathRooted($Datos)) { $Datos } else { Join-Path $raiz $Datos }
            $envio = LeerJson $rutaDatos
            $res.clip = $envio.clip
            if ($envio.plataforma -and $envio.plataforma -ne $Plataforma) { throw "El envio es para $($envio.plataforma), no para $Plataforma" }
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
            if (-not $config.plataformas.$Plataforma.activa) { throw "La plataforma $Plataforma no esta activa en config.json" }
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
        $res = [ordered]@{ ok = $false; plataforma = $Plataforma; id_publicacion = $IdPublicacion; estado = $null; url = $null; detalle = $null; error = $null; fecha = (Ahora) }
        try {
            if (-not $Plataforma -or -not $IdPublicacion) { throw 'Uso: comprobar -Plataforma <p> -IdPublicacion <id>' }
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

    'autorizar' {
        if (-not $Plataforma) { throw 'Uso: autorizar -Plataforma <youtube|tiktok|instagram|facebook>' }
        Write-Host "Autorizar $Plataforma. Los datos se guardan en $rutaCred (fuera del proyecto)."
        Write-Host 'Pasos previos en legion/03-publicador/plataformas.md'
        switch ($Plataforma) {
            'youtube' {
                $id = (Read-Host 'client_id del cliente OAuth (tipo Aplicacion de escritorio)').Trim()
                $secreto = (LeerSecreto 'client_secret').Trim()
                $redir = "http://127.0.0.1:$($config.puerto_oauth)"
                $verif = Aleatorio 64
                $estadoOauth = Aleatorio 24
                $url = 'https://accounts.google.com/o/oauth2/v2/auth?' + (Formulario ([ordered]@{
                    client_id = $id; redirect_uri = $redir; response_type = 'code'; access_type = 'offline'; prompt = 'consent'
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
                $url = 'https://www.tiktok.com/v2/auth/authorize/?' + (Formulario ([ordered]@{
                    client_key = $clave; scope = 'user.info.basic,video.upload,video.publish'; response_type = 'code'
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
        Write-Host "Listo: credenciales de $Plataforma guardadas. Comprueba con: publicar.ps1 estado"
    }
}
