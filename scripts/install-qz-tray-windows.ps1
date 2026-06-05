# QZ Tray Setup Script for Windows
# Installs QZ Tray and sets up override.crt certificate

param(
    [string]$CertificateUrl = "https://stringjobs.prostringshop.es/qz/override.crt"
)

$ErrorActionPreference = "Stop"

Write-Host "QZ Tray Setup - Windows" -ForegroundColor Cyan

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "Error: This script must be run as Administrator" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as administrator'" -ForegroundColor Yellow
    exit 1
}

# Step 1: Check if QZ Tray is already installed
$qzTrayPath = "C:\Program Files\QZ Tray\qz-tray.exe"
$qzTrayInstalled = Test-Path $qzTrayPath

if ($qzTrayInstalled) {
    Write-Host "✓ QZ Tray is already installed" -ForegroundColor Green
} else {
    Write-Host "Downloading QZ Tray installer..." -ForegroundColor Yellow

    # Download the installer from qz.io
    $installerPath = "$env:TEMP\qz-tray-installer.exe"

    try {
        # Use PowerShell to download the latest QZ Tray installer
        $url = "https://qz.io/download/?os=windows"

        # This might redirect, so we use a web client
        $client = New-Object System.Net.WebClient
        $client.DownloadFile($url, $installerPath)

        Write-Host "Running QZ Tray installer..." -ForegroundColor Yellow
        & $installerPath /S  # Silent installation

        # Wait for installation to complete
        Start-Sleep -Seconds 5

        if (Test-Path $qzTrayPath) {
            Write-Host "✓ QZ Tray installed successfully" -ForegroundColor Green
            Remove-Item $installerPath -Force
        } else {
            $msg = "Warning: QZ Tray installation path not found. Installation may have failed."
            Write-Host $msg -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "Error downloading/installing QZ Tray: $_" -ForegroundColor Red
        Write-Host "Please download manually from https://qz.io/download/" -ForegroundColor Yellow
        exit 1
    }
}

# Step 2: Download and install override.crt
$certPath = "C:\Program Files\QZ Tray\override.crt"
$certDir = "C:\Program Files\QZ Tray"

# Ensure directory exists
if (-not (Test-Path $certDir)) {
    New-Item -ItemType Directory -Path $certDir -Force | Out-Null
}

Write-Host "Downloading certificate from $CertificateUrl..." -ForegroundColor Yellow

try {
    $client = New-Object System.Net.WebClient
    $client.DownloadFile($CertificateUrl, $certPath)

    if (Test-Path $certPath) {
        Write-Host "✓ Certificate installed at $certPath" -ForegroundColor Green
    } else {
        Write-Host "Error: Certificate was not saved" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "Error downloading certificate: $_" -ForegroundColor Red
    Write-Host "Make sure the certificate URL is accessible" -ForegroundColor Yellow
    exit 1
}

# Step 3: Restart QZ Tray
Write-Host "Restarting QZ Tray..." -ForegroundColor Yellow

# Kill any running QZ Tray instances
Get-Process qz-tray -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Start QZ Tray
if (Test-Path $qzTrayPath) {
    & $qzTrayPath
    Write-Host "✓ QZ Tray started" -ForegroundColor Green
}

Write-Host "`nSetup Complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. QZ Tray is running (check system tray for printer icon)" -ForegroundColor Gray
Write-Host "2. Open ProString in your browser" -ForegroundColor Gray
Write-Host "3. Grant permission when QZ Tray shows the security dialog" -ForegroundColor Gray
Write-Host "4. Configure your printers in ProString Settings" -ForegroundColor Gray
