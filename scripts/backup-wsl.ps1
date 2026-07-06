param(
    [string]$DistroName = "Ubuntu",
    [string]$BackupDir = ".\backups"
)

if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

$Date = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupFile = Join-Path $BackupDir "$DistroName-$Date.tar"

Write-Host "Exportando distro WSL: $DistroName"
Write-Host "Destino: $BackupFile"

wsl --export $DistroName $BackupFile

Write-Host "Backup terminado."
