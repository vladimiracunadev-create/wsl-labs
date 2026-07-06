<#
.SYNOPSIS
    Compila el launcher de Windows de WSL Labs (Go).

.DESCRIPTION
    Compila launcher/windows/main.go en launcher/windows/wsl-labs-launcher.exe
    usando el toolchain de Go. El binario resultante lo consume el instalador
    de Inno Setup y el workflow build-windows de GitHub Actions.

    La version se inyecta en el binario con -ldflags "-X main.launcherVersion=...".
    Solo usa la biblioteca estandar de Go (no hay dependencias que descargar).

.PARAMETER Version
    String de version embebido en el binario. Si no se pasa, se lee de version.txt.

.EXAMPLE
    .\scripts\windows\build-launcher.ps1
    .\scripts\windows\build-launcher.ps1 -Version 1.2.0

.NOTES
    Requisitos:
      - Go 1.21 o superior  (https://go.dev/dl/)
      - Ejecutar desde la raiz del repo
#>
param (
    [string]$Version = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Si no se pasa Version, leerla desde version.txt en la raiz del repo
if (-not $Version) {
    $versionFile = Join-Path $PSScriptRoot "..\..\version.txt"
    if (Test-Path $versionFile) {
        $Version = (Get-Content $versionFile -Raw).Trim()
        Write-Host "  Version leida de version.txt: $Version"
    } else {
        $Version = "0.1.0"
        Write-Host "  version.txt no encontrado, usando default: $Version"
    }
}

$RepoRoot    = Resolve-Path (Join-Path $PSScriptRoot "../..")
$LauncherDir = Join-Path $RepoRoot "launcher\windows"
$OutputExe   = Join-Path $LauncherDir "wsl-labs-launcher.exe"

Write-Host ""
Write-Host "=== WSL Labs - Build Launcher ===" -ForegroundColor Cyan
Write-Host "  Repositorio : $RepoRoot"
Write-Host "  Launcher    : $LauncherDir"
Write-Host "  Salida      : $OutputExe"
Write-Host "  Version     : $Version"
Write-Host ""

# Verificar que Go este disponible
if (-not (Get-Command "go" -ErrorAction SilentlyContinue)) {
    Write-Error "Toolchain de Go no encontrado. Instala Go 1.21+ desde https://go.dev/dl/"
}

$goVersion = & go version
Write-Host "  Go version  : $goVersion"
Write-Host ""

# Compilar
Write-Host "[1/2] Compilando launcher..." -ForegroundColor Yellow
Push-Location $LauncherDir
try {
    & go build -v -ldflags "-X main.launcherVersion=$Version" -o $OutputExe .
    if ($LASTEXITCODE -ne 0) {
        Write-Error "go build fallo con exit code $LASTEXITCODE"
    }
} finally {
    Pop-Location
}

# Verificar salida
if (-not (Test-Path $OutputExe)) {
    Write-Error "No se encontro la salida esperada: $OutputExe"
}

$size = [math]::Round((Get-Item $OutputExe).Length / 1MB, 2)
Write-Host ""
Write-Host "[2/2] Compilacion completa." -ForegroundColor Green
Write-Host "  Binario : $OutputExe"
Write-Host "  Tamano  : ${size} MB"
Write-Host ""
Write-Host "Siguiente paso: ejecuta scripts\windows\build-installer.ps1 para empaquetar el instalador." -ForegroundColor Cyan
Write-Host ""
