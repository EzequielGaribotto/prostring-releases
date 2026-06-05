# QZ Tray Installer Builder

This guide explains how to build standalone executable installers for each platform.

## Overview

- **Windows** → `install-qz-tray.exe` (using PyInstaller or AutoIt)
- **macOS** → `install-qz-tray.app` or `install-qz-tray.dmg`
- **Linux** → `install-qz-tray` (AppImage or standalone binary)

---

## Windows: PowerShell → EXE

### Option 1: PS2EXE (Recommended - Simple)

**PS2EXE** converts a PowerShell script directly to an executable.

#### Setup
```powershell
# Install PS2EXE
Install-Module ps2exe -Scope CurrentUser -Force

# Or download: https://github.com/MScholtes/PS2EXE
```

#### Build
```powershell
Invoke-ps2exe `
  -inputFile "c:\Users\Eze\Desktop\public_html (3)\scripts\install-qz-tray-windows.ps1" `
  -outputFile "c:\Users\Eze\Desktop\public_html (3)\scripts\dist\install-qz-tray.exe" `
  -iconFile "c:\path\to\icon.ico" `
  -title "QZ Tray Installer" `
  -description "Automated QZ Tray setup for ProString"
```

#### Features
- ✅ Single .exe file
- ✅ No dependencies
- ✅ Can require admin on execution
- ✅ Fast startup

---

### Option 2: AutoIt (More Polished UI)

**AutoIt** creates native Windows executables with a GUI.

#### Setup
```powershell
# Download: https://www.autoitscript.com/site/autoit/downloads/
# Install to: C:\Program Files (x86)\AutoIt3\
```

#### Create Script
File: `install-qz-tray.au3`

```autoitscript
#RequireAdmin
#NoTrayIcon

Global $title = "QZ Tray Installer"
Global $qzPath = "C:\Program Files\QZ Tray\qz-tray.exe"
Global $certUrl = "http://localhost:5173/override.crt"

; Create main GUI
$hGUI = GUICreate($title, 500, 400)
GUICtrlCreateLabel("QZ Tray Setup Wizard", 10, 10, 480, 30)
$idStatus = GUICtrlCreateEdit("", 10, 50, 480, 250, BitOR($ES_MULTILINE, $ES_READONLY))
$idInstallBtn = GUICtrlCreateButton("Start Installation", 10, 310, 150, 30)
$idExitBtn = GUICtrlCreateButton("Exit", 340, 310, 150, 30)
GUISetState(@SW_SHOW)

AppendStatus("Welcome to QZ Tray Setup!")
AppendStatus("This will install QZ Tray and configure ProString.")
AppendStatus("")

While 1
    $nMsg = GUIGetMsg()
    Select
        Case $nMsg = $GUI_EVENT_CLOSE Or $nMsg = $idExitBtn
            Exit
        Case $nMsg = $idInstallBtn
            InstallQZTray()
    EndSelect
WEnd

Func InstallQZTray()
    GUICtrlSetState($idInstallBtn, $GUI_DISABLE)
    
    ; Step 1: Check if already installed
    If FileExists($qzPath) Then
        AppendStatus("✓ QZ Tray is already installed")
    Else
        AppendStatus("Step 1: Downloading QZ Tray...")
        
        Local $installerPath = @TempDir & "\qz-tray-installer.exe"
        Local $url = "https://qz.io/download/?os=windows"
        
        ; Download
        If Not InetGet($url, $installerPath) Then
            AppendStatus("✗ Failed to download QZ Tray")
            GUICtrlSetState($idInstallBtn, $GUI_ENABLE)
            Return
        EndIf
        
        AppendStatus("Installing QZ Tray...")
        RunWait($installerPath & " /S")
        FileDelete($installerPath)
        
        If Not FileExists($qzPath) Then
            AppendStatus("✗ Installation failed")
            GUICtrlSetState($idInstallBtn, $GUI_ENABLE)
            Return
        EndIf
        AppendStatus("✓ QZ Tray installed successfully")
    EndIf
    
    ; Step 2: Download certificate
    AppendStatus("Step 2: Downloading certificate...")
    
    Local $certPath = "C:\Program Files\QZ Tray\override.crt"
    If Not InetGet($certUrl, $certPath) Then
        AppendStatus("✗ Failed to download certificate")
        GUICtrlSetState($idInstallBtn, $GUI_ENABLE)
        Return
    EndIf
    AppendStatus("✓ Certificate installed")
    
    ; Step 3: Restart QZ Tray
    AppendStatus("Step 3: Starting QZ Tray...")
    Run("taskkill /IM qz-tray.exe /F", "", @SW_HIDE)
    Sleep(2000)
    Run($qzPath)
    AppendStatus("✓ QZ Tray started")
    
    AppendStatus("")
    AppendStatus("Setup Complete!")
    AppendStatus("Next: Go to ProString Settings → Printer Settings → Click 'Reconnect'")
    GUICtrlSetState($idInstallBtn, $GUI_ENABLE)
EndFunc

Func AppendStatus($text)
    Local $currentText = GUICtrlRead($idStatus)
    If $currentText = "" Then
        GUICtrlSetData($idStatus, $text)
    Else
        GUICtrlSetData($idStatus, $currentText & @CRLF & $text)
    EndIf
    ; Auto-scroll to bottom
    _GUICtrlEdit_LineScroll($idStatus, 0, _GUICtrlEdit_GetLineCount($idStatus))
EndFunc
```

#### Build
```powershell
# Compile
& "C:\Program Files (x86)\AutoIt3\Aut2Exe.exe" `
  /in "install-qz-tray.au3" `
  /out "install-qz-tray.exe" `
  /icon "icon.ico"
```

---

## macOS: Bash → DMG

### Create App Bundle

```bash
#!/bin/bash

# Create app structure
mkdir -p "install-qz-tray.app/Contents/MacOS"
mkdir -p "install-qz-tray.app/Contents/Resources"

# Copy shell script
cp install-qz-tray-unix.sh "install-qz-tray.app/Contents/MacOS/install-qz-tray"
chmod +x "install-qz-tray.app/Contents/MacOS/install-qz-tray"

# Create Info.plist
cat > "install-qz-tray.app/Contents/Info.plist" <<'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleExecutable</key>
    <string>install-qz-tray</string>
    <key>CFBundleIdentifier</key>
    <string>com.prostring.qztray-installer</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>QZ Tray Installer</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
</dict>
</plist>
EOF

# Create DMG
hdiutil create -volname "QZ Tray Installer" \
  -srcfolder "install-qz-tray.app" \
  -ov -format UDZO "install-qz-tray.dmg"
```

---

## Linux: Bash → AppImage

### Create AppImage

```bash
#!/bin/bash

# Download appimagetool
wget https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage
chmod +x appimagetool-x86_64.AppImage

# Create AppDir structure
mkdir -p AppDir/usr/bin
mkdir -p AppDir/usr/share/applications

# Copy script
cp install-qz-tray-unix.sh AppDir/usr/bin/install-qz-tray
chmod +x AppDir/usr/bin/install-qz-tray

# Create desktop entry
cat > AppDir/usr/share/applications/qz-tray-installer.desktop <<'EOF'
[Desktop Entry]
Type=Application
Name=QZ Tray Installer
Exec=install-qz-tray
Icon=application-x-executable
Terminal=true
EOF

# Create AppImage
./appimagetool-x86_64.AppImage AppDir install-qz-tray-x86_64.AppImage
chmod +x install-qz-tray-x86_64.AppImage
```

---

## Alternative: Node.js Based (Cross-Platform)

Use **pkg** to bundle Node.js + installer script:

```bash
# Install pkg
npm install -g pkg

# Create index.js
cat > installer.js <<'EOF'
#!/usr/bin/env node
const { execSync } = require('child_process');
const os = require('os');
const path = require('path');

console.log('QZ Tray Setup');
console.log('=============\n');

const platform = os.platform();
let scriptPath;

if (platform === 'win32') {
    scriptPath = path.join(__dirname, 'install-qz-tray-windows.ps1');
    console.log('Running PowerShell script...');
    execSync(`powershell -ExecutionPolicy Bypass -File "${scriptPath}"`, { stdio: 'inherit' });
} else if (platform === 'darwin' || platform === 'linux') {
    scriptPath = path.join(__dirname, 'install-qz-tray-unix.sh');
    console.log('Running shell script...');
    execSync(`bash "${scriptPath}"`, { stdio: 'inherit' });
}
EOF

# Build for each platform
pkg installer.js --targets node18-win-x64 --output install-qz-tray-win.exe
pkg installer.js --targets node18-macos-x64 --output install-qz-tray-macos
pkg installer.js --targets node18-linux-x64 --output install-qz-tray-linux
```

---

## Recommendation

**For simplicity:** Use **PS2EXE** on Windows (one-liner), bash DMG on macOS, and AppImage on Linux.

**For polish:** Use **AutoIt** on Windows (GUI), native .app on macOS, AppImage on Linux.

**For cross-platform:** Use **Node.js + pkg** (single build system, all three platforms).

