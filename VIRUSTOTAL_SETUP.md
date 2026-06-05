# VirusTotal Security Scanning Setup

This repository includes automatic VirusTotal scanning for all released installers. This provides users with transparent verification that the executables are safe and free from malware.

## 🔧 Setup Instructions

### 1. Get a VirusTotal API Key

1. Visit [VirusTotal](https://www.virustotal.com)
2. Sign up for a free account (or log in)
3. Go to your [API settings](https://www.virustotal.com/api/v3/intelligence)
4. Copy your API key (looks like a long random string)

### 2. Add the Secret to GitHub

1. Go to your repository settings
2. Navigate to **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `VIRUSTOTAL_API_KEY`
5. Value: Paste your VirusTotal API key
6. Click **Add secret**

### 3. Verify the Workflow

Once configured, the workflow will automatically:
- ✅ Trigger when you publish a new release
- ✅ Download all installer executables
- ✅ Upload each file to VirusTotal
- ✅ Add a comment to the release with scan results

## 📊 How It Works

When you create a release with the three installer files:

```
install-qz-tray-win.exe
install-qz-tray-macos
install-qz-tray-linux
```

The GitHub Actions workflow will:

1. **Upload to VirusTotal** - Each file is scanned by 70+ antivirus engines
2. **Generate Analysis IDs** - Unique links to view detailed scan results
3. **Comment on Release** - Posts results and links for user verification
4. **Track Results** - Logs all scan data in the GitHub Action logs

## 🔍 Public Verification

Users can verify installer safety by:

1. Visiting [VirusTotal.com](https://www.virustotal.com)
2. Searching for the executable file name or hash
3. Viewing results from all antivirus engines
4. Checking if any detections exist

## 🛡️ Security Benefits

- **Transparency**: Users can independently verify file safety
- **Coverage**: 70+ antivirus engines scan each file
- **Zero-Trust**: No need to trust just our word - use public scanning
- **Automation**: No manual work needed after release
- **Documentation**: Release comments show scan status to all users

## ⚙️ Troubleshooting

### Workflow shows "VirusTotal API key not configured"

**Solution**: Add the `VIRUSTOTAL_API_KEY` secret to your repository (see Setup Instructions above).

### Files not found in release

**Solution**: Ensure all three installers are attached to the GitHub release:
- `install-qz-tray-win.exe`
- `install-qz-tray-macos`
- `install-qz-tray-linux`

### API Rate Limits

VirusTotal free tier allows 4 requests per minute. For frequent releases, wait between publishing.

---

**Questions?** Check [VirusTotal API Documentation](https://developers.virustotal.com/reference/files)
