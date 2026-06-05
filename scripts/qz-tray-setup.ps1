param(
    [string]$CertificateUrl = "https://stringjobs.prostringshop.es/qz/override.crt"
)

$ErrorActionPreference = "Stop"

Write-Host "QZ Tray Setup - Windows" -ForegroundColor Cyan

$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "Error: Run as Administrator" -ForegroundColor Red
    exit 1
}

$qzTrayPath = "C:\Program Files\QZ Tray\qz-tray.exe"
if (-not (Test-Path $qzTrayPath)) {
    Write-Host "Downloading QZ Tray..." -ForegroundColor Yellow
    $tmpExe = "$env:TEMP\qz-tray-2.2.6.exe"

    try {
        $web = New-Object System.Net.WebClient
        $web.DownloadFile("https://github.com/qzind/tray/releases/download/v2.2.6/qz-tray-2.2.6-x86_64.exe", $tmpExe)
        Write-Host "Running installer..." -ForegroundColor Yellow
        & $tmpExe /S
        Start-Sleep -Seconds 5
        if (Test-Path $tmpExe) {
            Remove-Item $tmpExe -Force -ErrorAction SilentlyContinue
        }
        Write-Host "QZ Tray installed" -ForegroundColor Green
    } catch {
        Write-Host "Download failed: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "QZ Tray already installed" -ForegroundColor Green
}

$certDir = "C:\Program Files\QZ Tray"
$certPath = "$certDir\override.crt"

if (-not (Test-Path $certDir)) {
    New-Item -ItemType Directory -Path $certDir -Force | Out-Null
}

Write-Host "Downloading certificate..." -ForegroundColor Yellow

try {
    $web = New-Object System.Net.WebClient
    $web.DownloadFile($CertificateUrl, $certPath)
    Write-Host "Certificate installed" -ForegroundColor Green
} catch {
    Write-Host "Certificate download failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host "Restarting QZ Tray..." -ForegroundColor Yellow
Get-Process qz-tray -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

if (Test-Path $qzTrayPath) {
    & $qzTrayPath
    Write-Host "QZ Tray started" -ForegroundColor Green
}

Write-Host "`nSetup Complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Grant permission when QZ Tray shows security dialog" -ForegroundColor Gray
Write-Host "2. Configure printers in ProString Settings" -ForegroundColor Gray
