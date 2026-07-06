param(
    [Parameter(Mandatory=$true)]
    [string]$NewDistroName,

    [Parameter(Mandatory=$true)]
    [string]$InstallLocation,

    [Parameter(Mandatory=$true)]
    [string]$TarFile
)

Write-Host "Importando distro WSL"
Write-Host "Nombre: $NewDistroName"
Write-Host "Ubicación: $InstallLocation"
Write-Host "Archivo: $TarFile"

wsl --import $NewDistroName $InstallLocation $TarFile --version 2

Write-Host "Importación terminada. Ejecuta con: wsl -d $NewDistroName"
