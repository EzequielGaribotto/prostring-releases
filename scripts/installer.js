#!/usr/bin/env node

const { execSync } = require('child_process')
const { writeFileSync } = require('fs')
const path = require('path')
const os = require('os')

// Embedded script content - use proper escaping for PowerShell
const WINDOWS_SCRIPT = `# QZ Tray Setup Script for Windows
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
$qzTrayPath = "C:\\Program Files\\QZ Tray\\qz-tray.exe"
$qzTrayInstalled = Test-Path $qzTrayPath

if ($qzTrayInstalled) {
    Write-Host "✓ QZ Tray is already installed" -ForegroundColor Green
} else {
    Write-Host "Downloading QZ Tray installer..." -ForegroundColor Yellow

    # Download the installer from qz.io
    $installerPath = "$env:TEMP\\qz-tray-installer.exe"

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
            Write-Host "Warning: QZ Tray installation path not found. Installation may have failed." -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "Error downloading/installing QZ Tray: $_" -ForegroundColor Red
        Write-Host "Please download manually from https://qz.io/download/" -ForegroundColor Yellow
        exit 1
    }
}

# Step 2: Download and install override.crt
$certPath = "C:\\Program Files\\QZ Tray\\override.crt"
$certDir = "C:\\Program Files\\QZ Tray"

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

Write-Host ""
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. QZ Tray is running (check system tray for printer icon)" -ForegroundColor Gray
Write-Host "2. Open ProString in your browser" -ForegroundColor Gray
Write-Host "3. Grant permission when QZ Tray shows the security dialog" -ForegroundColor Gray
Write-Host "4. Configure your printers in ProString Settings" -ForegroundColor Gray
`

const UNIX_SCRIPT = `#!/bin/bash
set -e
CERTIFICATE_URL="\${1:-https://stringjobs.prostringshop.es/qz/override.crt}"
OS_TYPE=$(uname -s)
echo -e "\\n\\033[36mQZ Tray Setup - $OS_TYPE\\033[0m\\n"
if [[ "$OS_TYPE" == "Darwin" ]]; then
    QZ_INSTALL_DIR="$HOME/Applications/QZ Tray.app"
    QZ_EXECUTABLE="$QZ_INSTALL_DIR/Contents/MacOS/QZ Tray"
    CERT_PATH="$HOME/Library/Application Support/QZ Tray/override.crt"
    CERT_DIR="$HOME/Library/Application Support/QZ Tray"
    DOWNLOAD_URL="https://qz.io/download/?os=mac"
    INSTALLER_PATH="/tmp/qz-tray-installer.dmg"
elif [[ "$OS_TYPE" == "Linux" ]]; then
    QZ_INSTALL_DIR="/opt/qz-tray"
    QZ_EXECUTABLE="$QZ_INSTALL_DIR/qz-tray"
    CERT_PATH="$HOME/.config/QZ Tray/override.crt"
    CERT_DIR="$HOME/.config/QZ Tray"
    DOWNLOAD_URL="https://qz.io/download/?os=linux"
    INSTALLER_PATH="/tmp/qz-tray-installer.deb"
else
    echo -e "\\033[31mError: Unsupported OS ($OS_TYPE)\\033[0m"
    exit 1
fi
if [[ -f "$QZ_EXECUTABLE" ]]; then
    echo -e "\\033[32m✓ QZ Tray is already installed\\033[0m"
else
    echo -e "\\033[33mDownloading QZ Tray...\\033[0m"
    if ! curl -L -o "$INSTALLER_PATH" "$DOWNLOAD_URL"; then
        echo -e "\\033[31mError: Failed to download QZ Tray\\033[0m"
        echo -e "\\033[33mPlease download manually from https://qz.io/download/\\033[0m"
        exit 1
    fi
    if [[ "$OS_TYPE" == "Darwin" ]]; then
        echo -e "\\033[33mMounting and installing QZ Tray (macOS)...\\033[0m"
        hdiutil attach "$INSTALLER_PATH" -quiet
        DMG_MOUNT=$(mount | grep qz-tray | awk '{print $3}')
        if [[ -z "$DMG_MOUNT" ]]; then
            echo -e "\\033[31mError: Could not mount DMG\\033[0m"
            exit 1
        fi
        mkdir -p "$HOME/Applications"
        cp -r "$DMG_MOUNT/QZ Tray.app" "$HOME/Applications/"
        hdiutil detach "$DMG_MOUNT" -quiet
        if [[ -f "$QZ_EXECUTABLE" ]]; then
            echo -e "\\033[32m✓ QZ Tray installed successfully\\033[0m"
            rm "$INSTALLER_PATH"
        else
            echo -e "\\033[31mError: Installation failed\\033[0m"
            exit 1
        fi
    elif [[ "$OS_TYPE" == "Linux" ]]; then
        echo -e "\\033[33mInstalling QZ Tray (Linux)...\\033[0m"
        if ! sudo -n true 2>/dev/null; then
            echo -e "\\033[33mSudo password required for installation:\\033[0m"
        fi
        if ! sudo dpkg -i "$INSTALLER_PATH"; then
            echo -e "\\033[31mError: dpkg installation failed\\033[0m"
            echo -e "\\033[33mTrying apt-get to resolve dependencies...\\033[0m"
            sudo apt-get install -f -y || exit 1
        fi
        if [[ -f "$QZ_EXECUTABLE" ]]; then
            echo -e "\\033[32m✓ QZ Tray installed successfully\\033[0m"
            rm "$INSTALLER_PATH"
        else
            echo -e "\\033[31mError: Installation failed\\033[0m"
            exit 1
        fi
    fi
fi
mkdir -p "$CERT_DIR"
echo -e "\\033[33mDownloading certificate from $CERTIFICATE_URL...\\033[0m"
if ! curl -L -o "$CERT_PATH" "$CERTIFICATE_URL"; then
    echo -e "\\033[31mError: Failed to download certificate\\033[0m"
    echo -e "\\033[33mMake sure the certificate URL is accessible\\033[0m"
    exit 1
fi
if [[ -f "$CERT_PATH" ]]; then
    echo -e "\\033[32m✓ Certificate installed at $CERT_PATH\\033[0m"
else
    echo -e "\\033[31mError: Certificate was not saved\\033[0m"
    exit 1
fi
echo -e "\\033[33mRestarting QZ Tray...\\033[0m"
killall "QZ Tray" 2>/dev/null || true
sleep 2
if [[ "$OS_TYPE" == "Darwin" ]]; then
    open -a "QZ Tray"
elif [[ "$OS_TYPE" == "Linux" ]]; then
    nohup "$QZ_EXECUTABLE" > /dev/null 2>&1 &
fi
echo -e "\\033[32m✓ QZ Tray started\\033[0m"
echo -e "\\n\\033[32mSetup Complete!\\033[0m"
echo -e "\\n\\033[36mNext steps:\\033[0m"
echo -e "  \\033[37m1. QZ Tray is running (check system tray for printer icon)\\033[0m"
echo -e "  \\033[37m2. Open ProString in your browser\\033[0m"
echo -e "  \\033[37m3. Grant permission when QZ Tray shows the security dialog\\033[0m"
echo -e "  \\033[37m4. Configure your printers in ProString Settings\\033[0m"
echo ""
`

const platform = os.platform()
const arch = os.arch()

console.log('\n╔═══════════════════════════════════════════╗')
console.log('║     QZ Tray Setup Wizard for ProString    ║')
console.log('╚═══════════════════════════════════════════╝\n')

console.log(`Platform: ${platform} (${arch})`)
console.log(`Node.js: ${process.version}\n`)

async function main() {
  const tempDir = os.tmpdir()
  let scriptPath

  try {
    if (platform === 'win32') {
      scriptPath = path.join(tempDir, 'qz-tray-setup.ps1')
      writeFileSync(scriptPath, WINDOWS_SCRIPT)
      await installWindows(scriptPath)
    } else if (platform === 'darwin') {
      scriptPath = path.join(tempDir, 'qz-tray-setup.sh')
      writeFileSync(scriptPath, UNIX_SCRIPT)
      await installUnix(scriptPath, 'macOS')
    } else if (platform === 'linux') {
      scriptPath = path.join(tempDir, 'qz-tray-setup.sh')
      writeFileSync(scriptPath, UNIX_SCRIPT)
      await installUnix(scriptPath, 'Linux')
    } else {
      console.error(`❌ Unsupported platform: ${platform}`)
      process.exit(1)
    }

    console.log('\n✅ Setup Complete!\n')
    console.log('Next steps:')
    console.log('  1. Go to ProString Settings')
    console.log('  2. Navigate to Printer Settings')
    console.log('  3. Click "Reconnect" to detect your printers')
    console.log('  4. Select your receipt and label printers')
    console.log('  5. Done! Printing will now work automatically\n')
  } catch (err) {
    console.error(`\n❌ Installation failed: ${err.message}\n`)
    process.exit(1)
  }
}

async function installWindows(scriptPath) {
  console.log('🪟 Windows Installation\n')

  try {
    execSync('net session', { stdio: 'ignore' })
  } catch (e) {
    console.error('❌ This script must be run as Administrator')
    console.error('   Right-click Command Prompt or PowerShell and select "Run as administrator"\n')
    process.exit(1)
  }

  console.log('Running PowerShell installer...\n')

  try {
    execSync(
      `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`,
      { stdio: 'inherit', shell: 'powershell.exe' }
    )
  } catch (err) {
    throw new Error('PowerShell installation failed')
  }
}

async function installUnix(scriptPath, displayName) {
  const emoji = displayName === 'macOS' ? '🍎' : '🐧'
  console.log(`${emoji} ${displayName} Installation\n`)
  console.log('Running shell installer...')
  console.log('You may be prompted to enter your password for administrative tasks.\n')

  try {
    execSync(`chmod +x "${scriptPath}" && bash "${scriptPath}"`, { stdio: 'inherit' })
  } catch (err) {
    throw new Error('Shell installation failed')
  }
}

main().catch((err) => {
  console.error(`\n❌ Error: ${err.message}\n`)
  process.exit(1)
})
