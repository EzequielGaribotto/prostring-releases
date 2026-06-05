# QZ Tray Installation Scripts

Automated setup scripts for installing QZ Tray and configuring the ProString certificate across Windows, macOS, and Linux.

## Quick Start

### Windows
1. Open **PowerShell as Administrator**
2. Run:
   ```powershell
   .\install-qz-tray-windows.ps1
   ```

### macOS / Linux
1. Open **Terminal**
2. Make the script executable:
   ```bash
   chmod +x install-qz-tray-unix.sh
   ```
3. Run:
   ```bash
   ./install-qz-tray-unix.sh
   ```

## Usage

### Basic Usage (Default)
Uses `http://localhost:5173/override.crt` as the certificate source.

**Windows:**
```powershell
.\install-qz-tray-windows.ps1
```

**Unix (macOS/Linux):**
```bash
./install-qz-tray-unix.sh
```

### Custom Certificate URL
Provide a different certificate URL if needed.

**Windows:**
```powershell
.\install-qz-tray-windows.ps1 -CertificateUrl "https://example.com/override.crt"
```

**Unix (macOS/Linux):**
```bash
./install-qz-tray-unix.sh https://example.com/override.crt
```

### Cross-Platform (PowerShell Core)
If you have PowerShell 7+ installed on any OS:

```powershell
.\install-qz-tray.ps1 -CertificateUrl "http://localhost:5173/override.crt"
```

## What These Scripts Do

1. **Check Installation** — Verifies if QZ Tray is already installed
2. **Download & Install** — If not present, downloads the latest QZ Tray from qz.io
3. **Download Certificate** — Fetches `override.crt` and places it in the correct location
4. **Restart QZ Tray** — Stops and restarts QZ Tray to load the certificate

## Permissions Required

### Windows
- **Administrator rights** — Required to copy files to `C:\Program Files\QZ Tray\`
  - Right-click PowerShell → "Run as administrator"

### macOS
- No special permissions required for user-level installation
- Installs to `~/Applications/QZ Tray.app`

### Linux
- **sudo** — May prompt for password during dpkg installation
- Installs to `/opt/qz-tray`

## Certificate Paths

| OS | Path |
|---|---|
| **Windows** | `C:\Program Files\QZ Tray\override.crt` |
| **macOS** | `~/Library/Application Support/QZ Tray/override.crt` |
| **Linux** | `~/.config/QZ Tray/override.crt` |

## Troubleshooting

### "Running as Administrator" Error (Windows)
Right-click PowerShell and select **"Run as administrator"**, then run the script again.

### Certificate Download Fails
- Verify the certificate URL is accessible
- Check your network connection
- Try manually specifying the URL with the `-CertificateUrl` parameter

### QZ Tray Won't Start
- Check that the installation succeeded (look for the printer icon in system tray)
- Try running QZ Tray manually from its install location
- Restart your computer

### Permission Denied (macOS/Linux)
Make sure the script is executable:
```bash
chmod +x install-qz-tray-unix.sh
```

## Next Steps

After the script completes:

1. ✓ QZ Tray is running (visible as a printer icon in your system tray)
2. Open **ProString** in your browser
3. Grant permission when QZ Tray shows the security dialog
4. Configure your printers in **ProString Settings**

See [SETUP_CLIENT.md](../docs/SETUP_CLIENT.md) for the manual steps.
