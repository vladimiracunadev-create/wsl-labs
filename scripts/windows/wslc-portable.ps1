<#
.SYNOPSIS
  Mover imágenes y volúmenes de wslc a/desde un archivo (para otro equipo).

.DESCRIPTION
  Envuelve los comandos de wslc verificados para portabilidad:
    - export-image  : wslc save  <imagen> -o <archivo.tar>
    - import-image  : wslc load  -i <archivo.tar>
    - backup-volume : tar del volumen -> <archivo.tar.gz>   (por stdout, evita el
                      límite de bind mounts de la preview de wslc)
    - restore-volume: crea el volumen y restaura desde <archivo.tar.gz> (por stdin)

.EXAMPLE
  .\wslc-portable.ps1 export-image  -Image wsl-labs/node-api:latest -File C:\tmp\node-api.tar
  .\wslc-portable.ps1 import-image  -File C:\tmp\node-api.tar
  .\wslc-portable.ps1 backup-volume -Volume wslc-pgdata -File C:\tmp\pgdata.tar.gz
  .\wslc-portable.ps1 restore-volume -Volume wslc-pgdata -File C:\tmp\pgdata.tar.gz
#>
param(
  [Parameter(Mandatory, Position = 0)]
  [ValidateSet('export-image', 'import-image', 'backup-volume', 'restore-volume')]
  [string]$Action,
  [string]$Image,
  [string]$Volume,
  [Parameter(Mandatory)][string]$File
)

$ErrorActionPreference = 'Stop'
$wslc = if ($env:WSL_LABS_WSLC) { $env:WSL_LABS_WSLC } else { 'C:\Program Files\WSL\wslc.exe' }
if (-not (Test-Path $wslc)) { throw "No se encontró wslc en '$wslc'. Instala/actualiza con: wsl --update --pre-release" }

switch ($Action) {
  'export-image' {
    if (-not $Image) { throw 'Falta -Image (nombre:tag de la imagen).' }
    & $wslc save $Image -o $File
    Write-Host "[wslc-portable] Imagen '$Image' guardada en $File"
  }
  'import-image' {
    & $wslc load -i $File
    Write-Host "[wslc-portable] Imagen cargada desde $File"
  }
  'backup-volume' {
    if (-not $Volume) { throw 'Falta -Volume (nombre del volumen).' }
    # Redirección binaria vía cmd para no corromper el tar (PowerShell usa texto).
    cmd /c "`"$wslc`" run --rm -v ${Volume}:/data alpine tar czf - -C /data . > `"$File`""
    Write-Host "[wslc-portable] Volumen '$Volume' respaldado en $File"
  }
  'restore-volume' {
    if (-not $Volume) { throw 'Falta -Volume (nombre del volumen).' }
    & $wslc volume create $Volume | Out-Null
    cmd /c "`"$wslc`" run --rm -i -v ${Volume}:/data alpine tar xzf - -C /data < `"$File`""
    Write-Host "[wslc-portable] Volumen '$Volume' restaurado desde $File"
  }
}
