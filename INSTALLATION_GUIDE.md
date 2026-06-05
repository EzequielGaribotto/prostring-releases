# QZ Tray Installation Guide

Complete setup guide for installing QZ Tray with ProString.

---

## 🪟 Windows

### Requirements
- Windows 7 or later
- Administrator rights
- Internet connection

### Installation Steps

1. **Download**
   - Go to [Releases](../../releases/)
   - Download `install-qz-tray-win.exe`

2. **Run as Administrator**
   - Right-click the .exe file
   - Select "Run as administrator"
   - If prompted by SmartScreen, click "More info" → "Run anyway"

3. **Follow the Installer**
   - The installer will automatically:
     - Check permissions
     - Download QZ Tray
     - Install QZ Tray
     - Download certificate
     - Configure ProString certificate
     - Start QZ Tray
   - Watch for success message: "Setup Complete!"

4. **Verify**
   - Look for a **printer icon** in your system tray (bottom-right)
   - That's QZ Tray running!

5. **Configure ProString**
   - Open ProString
   - Go to Settings → Printer Settings
   - Click "Reconnect"
   - Your printers should appear in the dropdown

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "Run as administrator" missing | Right-click the .exe file itself, not a shortcut |
| SmartScreen warning | Click "More info" → "Run anyway" (unsigned binary) |
| QZ Tray not in system tray | Restart Windows or run the installer again |
| Printers don't appear | Check "Reconnect" button in Printer Settings |
| Installation failed | Check internet connection, try again |

---

## 🍎 macOS

### Requirements
- macOS 10.12 or later
- Terminal access
- Administrator/sudo rights
- Internet connection

### Installation Steps

1. **Download**
   - Go to [Releases](../../releases/)
   - Download `install-qz-tray-macos`
   - Save to your Downloads folder

2. **Open Terminal**
   - Applications → Utilities → Terminal

3. **Make Executable**
   - In Terminal, type:
   ```bash
   chmod +x ~/Downloads/install-qz-tray-macos
   ```

4. **Run the Installer**
   - In Terminal, type:
   ```bash
   ~/Downloads/install-qz-tray-macos
   ```
   - You'll be prompted to enter your password
   - Type your macOS password (characters won't show, but they're being entered)
   - Press Enter

5. **Follow the Installer**
   - Installer will automatically:
     - Download QZ Tray
     - Install to ~/Applications/QZ Tray.app
     - Configure certificate
     - Start QZ Tray
   - Watch for success message

6. **Verify**
   - Look at the top-right menu bar for a **printer icon**
   - That's QZ Tray running!

7. **Configure ProString**
   - Open ProString
   - Go to Settings → Printer Settings
   - Click "Reconnect"
   - Your printers should appear

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "Permission denied" | Run `chmod +x ~/Downloads/install-qz-tray-macos` first |
| "Command not found" | Check the file is in Downloads, use full path: `~/Downloads/install-qz-tray-macos` |
| Password prompt stuck | Just type your password and press Enter (don't worry if you don't see characters) |
| QZ Tray not in menu bar | Try running installer again or restart macOS |
| Printers don't appear | Check "Reconnect" button in Printer Settings |
| "Cannot open" (unidentified developer) | System Settings → Privacy → General → Allow QZ Tray |

---

## 🐧 Linux

### Requirements
- Ubuntu 18.04+ (or equivalent)
- Terminal access
- sudo rights
- Internet connection

### Installation Steps

1. **Download**
   - Go to [Releases](../../releases/)
   - Download `install-qz-tray-linux`
   - Save to your Downloads folder

2. **Open Terminal**
   - Applications → Terminal (or Ctrl+Alt+T)

3. **Make Executable**
   - In Terminal, type:
   ```bash
   chmod +x ~/Downloads/install-qz-tray-linux
   ```

4. **Run the Installer**
   - In Terminal, type:
   ```bash
   ~/Downloads/install-qz-tray-linux
   ```
   - You'll be prompted to enter your password (for sudo)
   - Type your password
   - Press Enter

5. **Follow the Installer**
   - Installer will automatically:
     - Install required packages
     - Download QZ Tray
     - Install to /opt/qz-tray
     - Configure certificate
     - Start QZ Tray
   - Watch for success message

6. **Verify**
   - QZ Tray runs in the background
   - No system tray icon on most Linux desktop environments
   - To verify: `ps aux | grep qz-tray` should show the process

7. **Configure ProString**
   - Open ProString
   - Go to Settings → Printer Settings
   - Click "Reconnect"
   - Your printers should appear

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "Permission denied" | Run `chmod +x ~/Downloads/install-qz-tray-linux` first |
| "dpkg: error" | Run `sudo apt-get install -f` to fix broken dependencies |
| "Command not found" | Check file is in Downloads, use: `~/Downloads/install-qz-tray-linux` |
| Password prompt stuck | Type your password and press Enter |
| Installation fails | Check internet connection and try again |
| QZ Tray not running | Try: `sudo systemctl restart qz-tray` (if available) |
| Printers don't appear | Check "Reconnect" in Printer Settings, restart ProString |

---

## ✅ After Installation

### All Platforms

Once installation is complete:

1. ✅ QZ Tray is running in the background
2. ✅ Certificate is configured
3. ✅ ProString can communicate with QZ Tray

**Configure ProString:**
- Open ProString → Settings → Printer Settings
- Click "Reconnect"
- Select your receipt printer
- Select your label printer
- Click "Save Printer Settings"
- Done! Printing now works seamlessly

---

## 🔄 Uninstalling QZ Tray

### Windows
- Settings → Apps → Apps & features
- Find "QZ Tray"
- Click → Uninstall

### macOS
- Open Finder
- Go to Applications
- Drag "QZ Tray" to Trash
- Empty Trash

### Linux
```bash
sudo apt-remove qz-tray
```

---

## 🆘 Getting Help

### Common Issues

**"Setup failed" message**
- Check internet connection
- Run installer again
- Check antivirus isn't blocking downloads

**QZ Tray won't start**
- Check it installed to correct location
- Restart your computer
- Download QZ Tray manually from https://qz.io/

**Printers not detected**
- Make sure printers are turned on
- Make sure printers are connected to network
- Click "Reconnect" in ProString Printer Settings
- Restart ProString

**Permission errors**
- Make sure you have admin/sudo rights
- Run as administrator (Windows)
- Use sudo (macOS/Linux)

### Still Have Questions?

- **ProString Help:** Check ProString documentation or contact your administrator
- **QZ Tray Help:** Visit https://qz.io/support/
- **Printing Issues:** Check that printers are on and connected to network

---

## 📋 Checklist

After installation:

- [ ] Installer ran without errors
- [ ] QZ Tray icon visible (Windows system tray / macOS menu bar)
- [ ] ProString opens
- [ ] Settings → Printer Settings shows green "connected" badge
- [ ] Printers appear in dropdown after clicking "Reconnect"
- [ ] Can print a test document

If all checked: **You're all set!** 🎉

---

**Version:** v1.0.0  
**Last Updated:** 2026-06-05
