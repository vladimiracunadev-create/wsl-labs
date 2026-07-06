<#
.SYNOPSIS
    Pipeline de release de WSL Labs: crea el tag git vX.Y.Z y lo pushea.

.DESCRIPTION
    Orquesta la publicacion de un release:
      1. Lee la version desde version.txt (fuente unica de verdad).
      2. Verifica que el arbol de trabajo este limpio.
      3. Crea el tag git anotado vX.Y.Z (si no existe).
      4. Hace push del tag a origin.

    Al pushear el tag vX.Y.Z se dispara el workflow "Build Windows Installer"
    (.github/workflows/build-windows.yml), que en GitHub Actions:
      - Compila el launcher Go (scripts/windows/build-launcher.ps1)
      - Compila el instalador Inno Setup (scripts/windows/build-installer.ps1)
      - Crea el GitHub Release y adjunta wsl-labs-setup-{version}.exe

    Este script NO compila localmente: delega el build al workflow. Si quieres
    compilar en local, ejecuta build-launcher.ps1 + build-installer.ps1 a mano.

.PARAMETER Version
    Version a taggear. Si no se pasa, se lee de version.txt.

.PARAMETER Push
    Si se indica, hace push del tag a origin (lo que dispara el workflow).
    Sin este flag el tag se crea solo localmente (dry-run).

.EXAMPLE
    # Crear tag local sin pushear (dry-run)
    .\scripts\windows\release.ps1

    # Crear tag y pushear (dispara el build en GitHub Actions)
    .\scripts\windows\release.ps1 -Push

.NOTES
    Requisitos:
      - git en el PATH
      - Permisos de push al remoto origin
#>
param (
    [string]$Version = "",
    [switch]$Push
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ScriptsWin = $PSScriptRoot
$RepoRoot   = Resolve-Path (Join-Path $ScriptsWin "../..")

# Leer version de version.txt si no se pasa
if (-not $Version) {
    $versionFile = Join-Path $RepoRoot "version.txt"
    if (Test-Path $versionFile) {
        $Version = (Get-Content $versionFile -Raw).Trim()
    } else {
        Write-Error "version.txt no encontrado en $RepoRoot y no se paso -Version."
    }
}

$Tag = "v$Version"

Write-Host ""
Write-Host "=== WSL Labs - Release Pipeline ===" -ForegroundColor Cyan
Write-Host "  Repositorio : $RepoRoot"
Write-Host "  Version     : $Version"
Write-Host "  Tag         : $Tag"
Write-Host "  Push        : $Push"
Write-Host ""

# Verificar git
if (-not (Get-Command "git" -ErrorAction SilentlyContinue)) {
    Write-Error "git no encontrado en el PATH."
}

Push-Location $RepoRoot
try {
    # Verificar arbol limpio
    $status = & git status --porcelain
    if ($status) {
        Write-Warning "El arbol de trabajo tiene cambios sin commitear:"
        Write-Host $status
        Write-Error "Commitea o descarta los cambios antes de crear el tag."
    }

    # Verificar si el tag ya existe
    $existing = & git tag --list $Tag
    if ($existing) {
        Write-Error "El tag $Tag ya existe. Borralo (git tag -d $Tag) o sube la version en version.txt."
    }

    # Crear tag anotado
    Write-Host "[1/2] Creando tag $Tag..." -ForegroundColor Yellow
    & git tag -a $Tag -m "WSL Labs $Tag"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "git tag fallo con exit code $LASTEXITCODE"
    }
    Write-Host "  Tag $Tag creado localmente." -ForegroundColor Green

    # Push del tag (dispara el workflow)
    if ($Push) {
        Write-Host "[2/2] Pusheando tag $Tag a origin..." -ForegroundColor Yellow
        & git push origin $Tag
        if ($LASTEXITCODE -ne 0) {
            Write-Error "git push fallo con exit code $LASTEXITCODE"
        }
        Write-Host ""
        Write-Host "Tag pusheado. Se disparo el workflow 'Build Windows Installer'." -ForegroundColor Green
        Write-Host "Sigue el progreso en:" -ForegroundColor Cyan
        Write-Host "  https://github.com/vladimiracunadev-create/wsl-labs/actions"
        Write-Host ""
        Write-Host "El instalador wsl-labs-setup-$Version.exe quedara adjunto al release:" -ForegroundColor Cyan
        Write-Host "  https://github.com/vladimiracunadev-create/wsl-labs/releases/tag/$Tag"
    } else {
        Write-Host "[2/2] Push omitido (dry-run)." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "El tag se creo solo localmente. Para disparar el build en GitHub Actions:" -ForegroundColor Cyan
        Write-Host "  git push origin $Tag"
        Write-Host "  (o vuelve a ejecutar este script con -Push)"
    }
    Write-Host ""
} finally {
    Pop-Location
}
