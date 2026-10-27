# Recolector de senales del Cazador Viral (Agente 01 de la Legion).
# Descarga fuentes gratuitas y deja un snapshot en datos/cazador-viral/crudo/<marca>/.
# Uso: powershell -NoProfile -ExecutionPolicy Bypass -File legion/01-cazador-viral/recolectar.ps1
# Claves opcionales (variables de entorno): YOUTUBE_API_KEY, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET

param(
    [string]$Config = (Join-Path $PSScriptRoot 'config.json')
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$raiz = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$cfg = Get-Content -Raw -Encoding UTF8 $Config | ConvertFrom-Json
$marca = Get-Date -Format 'yyyy-MM-dd_HHmm'
$crudo = Join-Path $raiz 'datos\cazador-viral\crudo'
$destino = Join-Path $crudo $marca
New-Item -ItemType Directory -Force $destino | Out-Null

$utf8 = New-Object Text.UTF8Encoding $false
$cultura = [Globalization.CultureInfo]::InvariantCulture
$estado = [ordered]@{ marca = $marca; inicio = (Get-Date).ToString('o'); fuentes = [ordered]@{} }

function Descargar([string]$url, [hashtable]$cabeceras = @{}) {
    $h = @{ 'User-Agent' = 'LegionCazadorViral/0.1 (investigacion de tendencias)' }
    foreach ($k in $cabeceras.Keys) { $h[$k] = $cabeceras[$k] }
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -Headers $h -TimeoutSec 30
    $utf8.GetString($r.RawContentStream.ToArray()).TrimStart([char]0xFEFF)
}

function Guardar([string]$nombre, $datos) {
    $json = ConvertTo-Json -InputObject @($datos) -Depth 8
    [IO.File]::WriteAllText((Join-Path $destino "$nombre.json"), $json, $utf8)
}

# Corre una fuente aislada: si falla, se anota y el resto sigue.
function Ejecutar([string]$nombre, [scriptblock]$bloque) {
    try {
        $datos = @(& $bloque)
        Guardar $nombre $datos
        $estado.fuentes[$nombre] = "ok ($($datos.Count) registros)"
    } catch {
        $estado.fuentes[$nombre] = "error: $($_.Exception.Message)"
    }
}

# --- Google Trends: busquedas en alza por pais ---
Ejecutar 'google-trends' {
    foreach ($reg in $cfg.regiones) {
        $xml = [xml](Descargar "https://trends.google.com/trending/rss?geo=$($reg.geo)")
        $ns = New-Object Xml.XmlNamespaceManager $xml.NameTable
        $ns.AddNamespace('ht', 'https://trends.google.com/trending/rss')
        $rank = 0
        foreach ($it in $xml.SelectNodes('//item')) {
            $rank++
            [ordered]@{
                region        = $reg.geo
                rank          = $rank
                tema          = $it.SelectSingleNode('title').InnerText
                trafico_aprox = $it.SelectSingleNode('ht:approx_traffic', $ns).InnerText
                publicado     = $it.SelectSingleNode('pubDate').InnerText
                noticias      = @($it.SelectNodes('ht:news_item', $ns) | ForEach-Object {
                    [ordered]@{
                        titulo = $_.SelectSingleNode('ht:news_item_title', $ns).InnerText
                        fuente = $_.SelectSingleNode('ht:news_item_source', $ns).InnerText
                        url    = $_.SelectSingleNode('ht:news_item_url', $ns).InnerText
                    }
                })
            }
        }
    }
}

# --- X: tendencias por pais via trends24 (snapshots horarios -> permanencia) ---
Ejecutar 'x-trends24' {
    $slugs = @($cfg.regiones | ForEach-Object { $_.trends24 })
    if ($cfg.x_mundial) { $slugs += '' }
    foreach ($slug in $slugs) {
        $html = Descargar "https://trends24.in/$(if ($slug) { "$slug/" })"
        $bloques = [regex]::Matches($html, 'data-timestamp=([\d.]+)>.*?<ol class=trend-card__list>(.*?)</ol>', 'Singleline') |
            Select-Object -First $cfg.x_snapshots
        $vistos = @{}
        $i = 0
        foreach ($b in $bloques) {
            $hora = [DateTimeOffset]::FromUnixTimeSeconds([long][double]::Parse($b.Groups[1].Value, $cultura)).ToLocalTime().ToString('o')
            $pos = 0
            foreach ($t in [regex]::Matches($b.Groups[2].Value, 'class=trend-link>(.*?)</a>(?:<span class=tweet-count data-count="?([^">]*)"?)?')) {
                $pos++
                $nombre = [Net.WebUtility]::HtmlDecode($t.Groups[1].Value)
                # El hashtable ignora mayusculas: "LULA" y "Lula" son la misma tendencia y cuentan una vez por hora.
                if (-not $vistos.ContainsKey($nombre)) {
                    $vistos[$nombre] = [ordered]@{ rank_actual = $null; mejor_rank = $pos; horas_en_lista = 0; visto_desde = $hora; conteo = $null; ultimo_bloque = -1 }
                }
                $v = $vistos[$nombre]
                if ($v.ultimo_bloque -ne $i) { $v.horas_en_lista++; $v.ultimo_bloque = $i }
                $v.visto_desde = $hora
                if ($pos -lt $v.mejor_rank) { $v.mejor_rank = $pos }
                if ($i -eq 0 -and $null -eq $v.rank_actual) { $v.rank_actual = $pos; if ($t.Groups[2].Value) { $v.conteo = $t.Groups[2].Value } }
            }
            $i++
        }
        foreach ($nombre in $vistos.Keys) {
            $v = $vistos[$nombre]
            # Se guardan las tendencias actuales y las que salieron tras llegar al top 10.
            if ($null -ne $v.rank_actual -or $v.mejor_rank -le 10) {
                [ordered]@{
                    region         = $(if ($slug) { $slug } else { 'mundial' })
                    tendencia      = $nombre
                    rank_actual    = $v.rank_actual
                    mejor_rank     = $v.mejor_rank
                    horas_en_lista = $v.horas_en_lista
                    visto_desde    = $v.visto_desde
                    conteo         = $v.conteo
                    estado         = $(if ($null -eq $v.rank_actual) { 'salio' } elseif ($v.horas_en_lista -le 2) { 'nueva' } else { 'activa' })
                }
            }
        }
    }
}

# --- Wikipedia: paginas mas vistas (curiosidad masiva). Prueba ayer y, si aun no hay datos, dias anteriores ---
Ejecutar 'wikipedia' {
    $excluir = '^(Main_Page|-|(Special|Especial|Wikipedia|Portal|File|Archivo|Help|Ayuda|Category|Categor.a|Template|Plantilla|User|Usuario)(:|$))'
    foreach ($idioma in $cfg.wikipedia.idiomas) {
        $j = $null
        foreach ($dias in 1..3) {
            $dia = (Get-Date).ToUniversalTime().AddDays(-$dias)
            try {
                $j = (Descargar ("https://wikimedia.org/api/rest_v1/metrics/pageviews/top/$idioma.wikipedia/all-access/{0:yyyy}/{0:MM}/{0:dd}" -f $dia)) | ConvertFrom-Json
                break
            } catch { }
        }
        if (-not $j) { throw "sin datos de Wikipedia $idioma en los ultimos 3 dias" }
        $j.items[0].articles | Where-Object { $_.article -notmatch $excluir } | Select-Object -First $cfg.wikipedia.top | ForEach-Object {
            [ordered]@{
                idioma   = $idioma
                fecha    = '{0}-{1}-{2}' -f $j.items[0].year, $j.items[0].month, $j.items[0].day
                articulo = $_.article -replace '_', ' '
                vistas   = $_.views
                rank     = $_.rank
            }
        }
    }
}

# --- YouTube: videos en tendencia con metricas reales (requiere clave gratuita) ---
if ($env:YOUTUBE_API_KEY) {
    Ejecutar 'youtube' {
        $ahora = [DateTimeOffset]::Now
        foreach ($reg in $cfg.regiones) {
            $url = "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=$($reg.geo)&maxResults=$($cfg.youtube.max_por_region)&key=$($env:YOUTUBE_API_KEY)"
            $j = (Descargar $url) | ConvertFrom-Json
            $rank = 0
            foreach ($v in $j.items) {
                $rank++
                $pub = [DateTimeOffset]::Parse([string]$v.snippet.publishedAt, $cultura)
                $horas = [Math]::Max(1.0, [Math]::Round(($ahora - $pub).TotalHours, 1))
                $vistas = [long]$v.statistics.viewCount
                [ordered]@{
                    region         = $reg.geo
                    rank           = $rank
                    url            = "https://www.youtube.com/watch?v=$($v.id)"
                    titulo         = $v.snippet.title
                    canal          = $v.snippet.channelTitle
                    publicado      = $pub.ToString('o')
                    horas_desde    = $horas
                    vistas         = $vistas
                    likes          = [long]$v.statistics.likeCount
                    comentarios    = [long]$v.statistics.commentCount
                    vistas_por_hora = [long]($vistas / $horas)
                    duracion_seg   = [int][Xml.XmlConvert]::ToTimeSpan($v.contentDetails.duration).TotalSeconds
                    categoria_id   = $v.snippet.categoryId
                    etiquetas      = @($v.snippet.tags | Where-Object { $_ } | Select-Object -First 10)
                }
            }
        }
    }
} else {
    $estado.fuentes['youtube'] = 'omitida: falta YOUTUBE_API_KEY'
}

# --- Twitch: streams top, categorias top y clips de las ultimas 24 h (requiere app gratuita) ---
if ($env:TWITCH_CLIENT_ID -and $env:TWITCH_CLIENT_SECRET) {
    Ejecutar 'twitch' {
        $tok = Invoke-RestMethod -Method Post -TimeoutSec 30 -Uri "https://id.twitch.tv/oauth2/token?client_id=$($env:TWITCH_CLIENT_ID)&client_secret=$($env:TWITCH_CLIENT_SECRET)&grant_type=client_credentials"
        $h = @{ 'Client-Id' = $env:TWITCH_CLIENT_ID; 'Authorization' = "Bearer $($tok.access_token)" }
        foreach ($lang in $cfg.twitch.idiomas) {
            $s = (Descargar "https://api.twitch.tv/helix/streams?first=$($cfg.twitch.max_streams)&language=$lang" $h) | ConvertFrom-Json
            foreach ($x in $s.data) {
                [ordered]@{ tipo = 'stream'; idioma = $lang; canal = $x.user_name; categoria = $x.game_name; titulo = $x.title; espectadores = $x.viewer_count; inicio = $x.started_at; url = "https://www.twitch.tv/$($x.user_login)" }
            }
        }
        $g = (Descargar "https://api.twitch.tv/helix/games/top?first=20" $h) | ConvertFrom-Json
        $desde = [uri]::EscapeDataString((Get-Date).ToUniversalTime().AddDays(-1).ToString("yyyy-MM-dd'T'HH:mm:ss'Z'"))
        $rank = 0
        foreach ($x in $g.data) {
            $rank++
            [ordered]@{ tipo = 'categoria_top'; rank = $rank; categoria = $x.name }
            if ($rank -le $cfg.twitch.juegos_para_clips) {
                $c = (Descargar "https://api.twitch.tv/helix/clips?game_id=$($x.id)&started_at=$desde&first=10" $h) | ConvertFrom-Json
                foreach ($k in $c.data) {
                    [ordered]@{ tipo = 'clip'; categoria = $x.name; canal = $k.broadcaster_name; titulo = $k.title; vistas = $k.view_count; idioma = $k.language; creado = $k.created_at; duracion_seg = $k.duration; url = $k.url }
                }
            }
        }
    }
} else {
    $estado.fuentes['twitch'] = 'omitida: faltan TWITCH_CLIENT_ID / TWITCH_CLIENT_SECRET'
}

# --- Cierre: estado y limpieza de snapshots viejos ---
$estado.fin = (Get-Date).ToString('o')
[IO.File]::WriteAllText((Join-Path $destino 'estado.json'), (ConvertTo-Json -InputObject $estado -Depth 4), $utf8)

Get-ChildItem -Directory $crudo | Sort-Object Name -Descending | Select-Object -Skip $cfg.retener_snapshots |
    Remove-Item -Recurse -Force

$anterior = Get-ChildItem -Directory $crudo | Where-Object { $_.Name -ne $marca } | Sort-Object Name -Descending | Select-Object -First 1
"Snapshot: datos/cazador-viral/crudo/$marca"
"Anterior: $(if ($anterior) { "datos/cazador-viral/crudo/$($anterior.Name)" } else { '(ninguno, primer ciclo)' })"
foreach ($k in $estado.fuentes.Keys) { "  {0,-14} {1}" -f $k, $estado.fuentes[$k] }
