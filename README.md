# ProString — QZ Tray Installers

Public repository for **standalone QZ Tray installers** required by ProString.

## 📥 Downloads

- **Windows:** [`install-qz-tray-win.exe`](../../releases/v1.0.0/install-qz-tray-win.exe) (37.6 MB)
- **macOS:** [`install-qz-tray-macos`](../../releases/v1.0.0/install-qz-tray-macos) (51.3 MB)
- **Linux:** [`install-qz-tray-linux`](../../releases/v1.0.0/install-qz-tray-linux) (46.3 MB)

Or go to [Releases](../../releases/) to see all versions.

---

## 🚀 Quick Start

### Windows
1. Download `install-qz-tray-win.exe`
2. Right-click → "Run as administrator"
3. Follow the prompts
4. Done!

### macOS
1. Download `install-qz-tray-macos`
2. Open Terminal
3. Run: `./install-qz-tray-macos`
4. Enter your password when prompted
5. Done!

### Linux
1. Download `install-qz-tray-linux`
2. Open Terminal
3. Run: `./install-qz-tray-linux`
4. Enter your password when prompted
5. Done!

---

## ❓ What Is This?

QZ Tray is a background application that routes print jobs directly to your printers without browser dialogs.

This repository contains **standalone installers** for QZ Tray configured for ProString. They automatically:
- ✅ Download & install QZ Tray
- ✅ Configure the ProString certificate
- ✅ Start QZ Tray
- ✅ Enable seamless printing

---

## 🔧 Build Instructions

If you need to rebuild the installers:

```bash
cd scripts
npm install
npm run build
```

Output: `scripts/dist/`

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | This file (quick start) |
| `scripts/README.md` | Build system overview |
| `scripts/BUILD.md` | How to build from source |
| `scripts/IMPLEMENTATION.md` | Technical details |
| `scripts/build-installers.md` | Advanced customization |
| `scripts/installer.mjs` | Node.js orchestrator |
| `scripts/install-qz-tray-windows.ps1` | Windows automation |
| `scripts/install-qz-tray-unix.sh` | macOS/Linux automation |

---

## 🔐 Security

✅ **Open Source** — All scripts are visible and reviewable  
✅ **No Credentials** — No passwords or API keys in code  
✅ **HTTPS Only** — All downloads encrypted  
✅ **Official Sources** — QZ Tray from https://qz.io/  
✅ **Transparent** — Clear what gets installed and where

---

## 📝 Version History

### v1.0.0 (Current)
- Initial release
- Windows, macOS, Linux support
- Automatic QZ Tray setup
- Certificate configuration
- Full automation

---

## 🤝 Repository Structure

```
prostring-releases/
├── README.md                              (this file)
├── INSTALLATION_GUIDE.md                  (detailed user guide)
├── install-qz-tray-win.exe               (Windows executable)
├── install-qz-tray-macos                 (macOS executable)
├── install-qz-tray-linux                 (Linux executable)
└── scripts/
    ├── README.md                         (build overview)
    ├── BUILD.md                          (build instructions)
    ├── IMPLEMENTATION.md                 (technical details)
    ├── build-installers.md               (advanced customization)
    ├── package.json                      (build config)
    ├── installer.mjs                     (orchestrator)
    ├── install-qz-tray-windows.ps1       (Windows script)
    ├── install-qz-tray-unix.sh           (macOS/Linux script)
    └── dist/                             (built executables)
```

---

## 💡 Recommendations

- ⭐ **First Time?** Start with the Quick Start above
- 📖 **Detailed Guide?** See `INSTALLATION_GUIDE.md`
- 🔧 **Need to Rebuild?** See `scripts/BUILD.md`
- 🤔 **Questions?** Check `scripts/IMPLEMENTATION.md`

---

## 📞 Support

For issues with:
- **ProString:** Contact your administrator
- **QZ Tray:** Visit https://qz.io/support/
- **Installation:** See troubleshooting in `INSTALLATION_GUIDE.md`

---

## 📄 License

ProString is proprietary software.
QZ Tray is open source (LGPL).

---

**Latest Release:** v1.0.0  
**Updated:** 2026-06-05
