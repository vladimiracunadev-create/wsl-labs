<#
.SYNOPSIS
    Compila el instalador de Windows de WSL Labs usando Inno Setup.

.DESCRIPTION
    Requiere:
      1. El launcher .exe compilado en launcher\windows\wsl-labs-launcher.exe
         (ejecutar build-launcher.ps1 primero).
      2. Inno Setup 6.x instalado en la maquina de build.
         Ubicacion por defecto: C:\Program Files (x86)\Inno Setup 6\ISCC.exe
         Descarga: https://jrsoftware.org/isinfo.php

    Salida: dist\wsl-labs-setup-{Version}.exe

.PARAMETER Version
    String de version para el nombre de salida. Si no se pasa, se lee de version.txt.

.PARAMETER InnoSetupPath
    Ruta completa a ISCC.exe si no esta en la ubicacion por defecto.

.EXAMPLE
    .\scripts\windows\build-installer.ps1
    .\scripts\windows\build-installer.ps1 -Version 1.2.0

.NOTES
    El instalador generado es un artefacto de release — NO commitearlo al repo.
    Subirlo a GitHub Releases como release asset.
#>
param (
    [string]$Version       = "",
    [string]$InnoSetupPath = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Si no se pasa Version, leerla desde version.txt
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
$IssFile     = Join-Path $RepoRoot "installer\wsl-labs.iss"
$LauncherExe = Join-Path $RepoRoot "launcher\windows\wsl-labs-launcher.exe"
$DistDir     = Join-Path $RepoRoot "dist"
$ExpectedOut = Join-Path $DistDir  "wsl-labs-setup-${Version}.exe"

Write-Host ""
Write-Host "=== WSL Labs - Build Installer ===" -ForegroundColor Cyan
Write-Host "  Repositorio : $RepoRoot"
Write-Host "  Script ISS  : $IssFile"
Write-Host "  Version     : $Version"
Write-Host "  Salida      : $ExpectedOut"
Write-Host ""

# Verificar que el launcher este compilado
if (-not (Test-Path $LauncherExe)) {
    Write-Error "Launcher no encontrado: $LauncherExe`nEjecuta scripts\windows\build-launcher.ps1 primero."
}
Write-Host "  Launcher    : OK ($LauncherExe)"

# Localizar ISCC.exe
$iscc = $InnoSetupPath
if (-not $iscc) {
    $candidates = @(
        "C:\Program Files (x86)\Inno Setup 6\ISCC.exe",
        "C:\Program Files\Inno Setup 6\ISCC.exe",
        "C:\Program Files (x86)\Inno Setup 5\ISCC.exe"
    )
    foreach ($c in $candidates) {
        if (Test-Path $c) { $iscc = $c; break }
    }
}
if (-not $iscc -or -not (Test-Path $iscc)) {
    Write-Error "Inno Setup (ISCC.exe) no encontrado.`nInstala desde https://jrsoftware.org/isinfo.php`no pasa -InnoSetupPath 'C:\ruta\a\ISCC.exe'"
}
Write-Host "  ISCC.exe    : $iscc"
Write-Host ""

# Crear directorio dist
if (-not (Test-Path $DistDir)) {
    New-Item -ItemType Directory -Path $DistDir | Out-Null
}

# Compilar instalador
Write-Host "[1/2] Ejecutando compilador de Inno Setup..." -ForegroundColor Yellow
Push-Location $RepoRoot
try {
    & $iscc `
        "/DAppVersion=$Version" `
        "/O$DistDir" `
        $IssFile
    if ($LASTEXITCODE -ne 0) {
        Write-Error "ISCC.exe fallo con exit code $LASTEXITCODE"
    }
} finally {
    Pop-Location
}

# Verificar salida
if (-not (Test-Path $ExpectedOut)) {
    # Inno Setup puede nombrar el archivo distinto segun OutputBaseFilename — buscarlo
    $found = Get-ChildItem $DistDir -Filter "wsl-labs-setup-*.exe" |
             Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($found) {
        $ExpectedOut = $found.FullName
    } else {
        Write-Error "Instalador no encontrado en $DistDir tras la compilacion."
    }
}

$size = [math]::Round((Get-Item $ExpectedOut).Length / 1MB, 2)
Write-Host ""
Write-Host "[2/2] Instalador listo." -ForegroundColor Green
Write-Host "  Archivo : $ExpectedOut"
Write-Host "  Tamano  : ${size} MB"
Write-Host ""
Write-Host "Sube este archivo a GitHub Releases como release asset." -ForegroundColor Cyan
Write-Host ""
