# Building Standalone Installers

This guide explains how to build standalone executable installers for Windows, macOS, and Linux.

## Quick Start

### Prerequisites
- Node.js 18+ installed
- For Windows: Administrator access to run the script
- For macOS/Linux: `bash` shell available

### Build All Platforms

```bash
cd scripts
npm install
npm run build
```

Output files:
- `dist/install-qz-tray-win.exe` — Windows (double-click to run)
- `dist/install-qz-tray-macos` — macOS (open in Terminal: `./install-qz-tray-macos`)
- `dist/install-qz-tray-linux` — Linux (run: `./install-qz-tray-linux`)

### Build Single Platform

**Windows:**
```bash
npm run build:win
# Output: dist/install-qz-tray-win.exe
```

**macOS:**
```bash
npm run build:macos
# Output: dist/install-qz-tray-macos
```

**Linux:**
```bash
npm run build:linux
# Output: dist/install-qz-tray-linux
```

---

## How It Works

### Architecture

The installers are built using **pkg**, which bundles:
1. Node.js runtime (18+)
2. `installer.mjs` — smart entry point that detects the OS
3. `install-qz-tray-windows.ps1` — PowerShell script for Windows
4. `install-qz-tray-unix.sh` — Bash script for macOS/Linux

When you run the executable, it:
- Detects your OS automatically
- Runs the appropriate platform script
- Shows progress as it installs QZ Tray and configures ProString

### Why pkg?

- ✅ Single executable per platform
- ✅ No Node.js installation required
- ✅ No additional dependencies
- ✅ Fast startup (bundled runtime)
- ✅ Works on any machine (no admin needed to run the .exe, but scripts may require it)

---

## Installation

### Windows Users

1. Download `install-qz-tray-win.exe`
2. **Right-click** → "Run as administrator"
3. Follow the prompts
4. QZ Tray will start automatically when done

### macOS Users

1. Download `install-qz-tray-macos`
2. Open Terminal
3. Run: `./install-qz-tray-macos`
4. Enter your password when prompted
5. QZ Tray will start automatically when done

### Linux Users

1. Download `install-qz-tray-linux`
2. Open Terminal
3. Run: `./install-qz-tray-linux`
4. Enter your password when prompted (for apt-get)
5. QZ Tray will start automatically when done

---

## Distribution

### GitHub Releases

```bash
# Create release and upload binaries
gh release create v1.0.0 \
  dist/install-qz-tray-win.exe \
  dist/install-qz-tray-macos \
  dist/install-qz-tray-linux \
  --title "QZ Tray Installer v1.0.0" \
  --notes "Standalone installers for Windows, macOS, and Linux"
```

### Direct Download

Host the files on your server:
```
https://example.com/downloads/install-qz-tray-win.exe
https://example.com/downloads/install-qz-tray-macos
https://example.com/downloads/install-qz-tray-linux
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Windows: "Run as administrator" unavailable** | Right-click the `.exe` file, not the shortcut |
| **Windows: SmartScreen warning** | Click "More info" → "Run anyway" (unsigned executables trigger this) |
| **macOS: "Permission denied"** | Run `chmod +x install-qz-tray-macos` in Terminal first |
| **macOS: "Cannot open" (unidentified developer)** | Go to System Settings → Privacy → General, allow the app |
| **Linux: "Permission denied"** | Run `chmod +x install-qz-tray-linux` first |
| **Linux: dpkg errors** | Run `sudo apt-get install -f` to fix broken dependencies |
| **QZ Tray won't start after installation** | Check that QZ Tray installed to the correct location: `/opt/qz-tray` (Linux), `~/Applications/QZ Tray.app` (macOS), `C:\Program Files\QZ Tray` (Windows) |

---

## Sign & Distribute (Optional)

### Windows Code Signing

To avoid SmartScreen warnings, sign the .exe:

```powershell
# Requires a code signing certificate
signtool sign /f cert.pfx /p password dist/install-qz-tray-win.exe
```

### macOS Notarization

For distribution on macOS 10.15+:

```bash
# Requires Apple Developer account
xcrun notarytool submit dist/install-qz-tray-macos \
  --apple-id email@example.com \
  --password app-password \
  --team-id TEAM123ABC
```

---

## Customization

### Change Certificate URL

Edit `installer.mjs` and replace the default URL:

```javascript
// Line ~80: Change this
const certificateUrl = 'http://localhost:5173/override.crt'
// To your production URL:
const certificateUrl = 'https://api.prostring.example.com/certificate'
```

Then rebuild:
```bash
npm run build
```

### Custom Branding

Edit the welcome message in `installer.mjs` (lines ~18-22).

---

## Development

### Local Testing

Without rebuilding the full binary, test the installer locally:

```bash
# Windows (PowerShell)
& "c:\path\to\install-qz-tray-windows.ps1"

# macOS/Linux (bash)
bash install-qz-tray-unix.sh
```

### Incremental Builds

During development, rebuild only what changed:

```bash
# After modifying installer.mjs
npm run build:win

# After modifying install-qz-tray-windows.ps1
npm run build
```

### Debug Mode

Add debug output to `installer.mjs`:

```javascript
// Line ~15, after platform assignment
if (process.env.DEBUG) {
  console.log('Debug mode enabled')
  console.log(`Script path: ${scriptPath}`)
}
```

Then run:
```bash
DEBUG=1 node installer.mjs
```

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/build-installers.yml`:

```yaml
name: Build QZ Tray Installers

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd scripts && npm install
      - run: npm run build
      - uses: softprops/action-gh-release@v1
        with:
          files: dist/*
```

---

## See Also

- [pkg documentation](https://github.com/vercel/pkg) — bundling Node.js apps
- [QZ Tray documentation](https://qz.io/docs/) — QZ Tray setup details
- [SETUP_CLIENT.md](../docs/SETUP_CLIENT.md) — end-user setup guide
