# QZ Tray Setup - Master Script
# Auto-detects OS and runs the appropriate installer
# Usage: .\install-qz-tray.ps1 [-CertificateUrl "http://example.com/override.crt"]

param(
    [string]$CertificateUrl = "http://localhost:5173/override.crt"
)

$osInfo = [System.Runtime.InteropServices.RuntimeInformation]::OSDescription
$isWindows = [System.Runtime.InteropServices.RuntimeInformation]::IsOSPlatform([System.Runtime.InteropServices.OSPlatform]::Windows)
$isMacOS = [System.Runtime.InteropServices.RuntimeInformation]::IsOSPlatform([System.Runtime.InteropServices.OSPlatform]::OSX)
$isLinux = [System.Runtime.InteropServices.RuntimeInformation]::IsOSPlatform([System.Runtime.InteropServices.OSPlatform]::Linux)

Write-Host "Detected OS: $osInfo" -ForegroundColor Cyan

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

if ($isWindows) {
    Write-Host "Running Windows installer..." -ForegroundColor Yellow
    & "$scriptPath\install-qz-tray-windows.ps1" -CertificateUrl $CertificateUrl
} elseif ($isMacOS -or $isLinux) {
    Write-Host "Running Unix installer..." -ForegroundColor Yellow

    $unixScriptPath = "$scriptPath/install-qz-tray-unix.sh"

    if (Test-Path $unixScriptPath) {
        # Make sure it's executable
        chmod +x $unixScriptPath

        & bash $unixScriptPath $CertificateUrl
    } else {
        Write-Host "Error: Unix installer not found at $unixScriptPath" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Error: Unsupported operating system" -ForegroundColor Red
    exit 1
}
