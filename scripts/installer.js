#!/usr/bin/env node

const { execSync } = require('child_process')
const { writeFileSync } = require('fs')
const path = require('path')
const os = require('os')

// Base64-encoded PowerShell script (fixed version with short lines)
const WINDOWS_SCRIPT_B64 = 'IyBRWiBUcmF5IFNldHVwIFNjcmlwdCBmb3IgV2luZG93cw0KIyBJbnN0YWxscyBRWiBUcmF5IGFuZCBzZXRzIHVwIG92ZXJyaWRlLmNydCBjZXJ0aWZpY2F0ZQ0KDQpwYXJhbSgNCiAgICBbc3RyaW5nXSRDZXJ0aWZpY2F0ZVVybCA9ICJodHRwczovL3N0cmluZ2pvYnMucHJvc3RyaW5nc2hvcC5lcy9xei9vdmVycmlkZS5jcnQiDQopDQoNCiRFcnJvckFjdGlvblByZWZlcmVuY2UgPSAiU3RvcCINCg0KV3JpdGUtSG9zdCAiUVogVHJheSBTZXR1cCAtIFdpbmRvd3MiIC1Gb3JlZ3JvdW5kQ29sb3IgQ3lhbg0KDQojIENoZWNrIGlmIHJ1bm5pbmcgYXMgYWRtaW5pc3RyYXRvcg0KJGlzQWRtaW4gPSAoW1NlY3VyaXR5LlByaW5jaXBhbC5XaW5kb3dzUHJpbmNpcGFsXSBbU2VjdXJpdHkuUHJpbmNpcGFsLldpbmRvd3NJZGVudGl0eV06OkdldEN1cnJlbnQoKSkuSXNJblJvbGUoW1NlY3VyaXR5LlByaW5jaXBhbC5XaW5kb3dzQnVpbHRJblJvbGVdICJBZG1pbmlzdHJhdG9yIikNCmlmICgtbm90ICRpc0FkbWluKSB7DQogICAgV3JpdGUtSG9zdCAiRXJyb3I6IFRoaXMgc2NyaXB0IG11c3QgYmUgcnVuIGFzIEFkbWluaXN0cmF0b3IiIC1Gb3JlZ3JvdW5kQ29sb3IgUmVkDQogICAgV3JpdGUtSG9zdCAiUmlnaHQtY2xpY2sgUG93ZXJTaGVsbCBhbmQgc2VsZWN0ICdSdW4gYXMgYWRtaW5pc3RyYXRvciciIC1Gb3JlZ3JvdW5kQ29sb3IgWWVsbG93DQogICAgZXhpdCAxDQp9DQoNCiMgU3RlcCAxOiBDaGVjayBpZiBRWiBUcmF5IGlzIGFscmVhZHkgaW5zdGFsbGVkDQokcXpUcmF5UGF0aCA9ICJDOlxQcm9ncmFtIEZpbGVzXFFaIFRyYXlccXotdHJheS5leGUiDQokcXpUcmF5SW5zdGFsbGVkID0gVGVzdC1QYXRoICRxelRyYXlQYXRoDQoNCmlmICgkcXpUcmF5SW5zdGFsbGVkKSB7DQogICAgV3JpdGUtSG9zdCAi4pyTIFFaIFRyYXkgaXMgYWxyZWFkeSBpbnN0YWxsZWQiIC1Gb3JlZ3JvdW5kQ29sb3IgR3JlZW4NCn0gZWxzZSB7DQogICAgV3JpdGUtSG9zdCAiRG93bmxvYWRpbmcgUVogVHJheSBpbnN0YWxsZXIuLi4iIC1Gb3JlZ3JvdW5kQ29sb3IgWWVsbG93DQoNCiAgICAjIERvd25sb2FkIHRoZSBpbnN0YWxsZXIgZnJvbSBxei5pbw0KICAgICRpbnN0YWxsZXJQYXRoID0gIiRlbnY6VEVNUFxxei10cmF5LWluc3RhbGxlci5leGUiDQoNCiAgICB0cnkgew0KICAgICAgICAjIFVzZSBQb3dlclNoZWxsIHRvIGRvd25sb2FkIHRoZSBsYXRlc3QgUVogVHJheSBpbnN0YWxsZXINCiAgICAgICAgJHVybCA9ICJodHRwczovL3F6LmlvL2Rvd25sb2FkLz9vcz13aW5kb3dzIg0KDQogICAgICAgICMgVGhpcyBtaWdodCByZWRpcmVjdCwgc28gd2UgdXNlIGEgd2ViIGNsaWVudA0KICAgICAgICAkY2xpZW50ID0gTmV3LU9iamVjdCBTeXN0ZW0uTmV0LldlYkNsaWVudA0KICAgICAgICAkY2xpZW50LkRvd25sb2FkRmlsZSgkdXJsLCAkaW5zdGFsbGVyUGF0aCkNCg0KICAgICAgICBXcml0ZS1Ib3N0ICJSdW5uaW5nIFFaIFRyYXkgaW5zdGFsbGVyLi4uIiAtRm9yZWdyb3VuZENvbG9yIFlsbG93DQogICAgICAgICYgJGluc3RhbGxlclBhdGggL1MgICMgU2lsZW50IGluc3RhbGxhdGlvbg0KDQogICAgICAgICMgV2FpdCBmb3IgaW5zdGFsbGF0aW9uIHRvIGNvbXBsZXRlDQogICAgICAgIFN0YXJ0LVNsZWVwIC1TZWNvbmRzIDUNCg0KICAgICAgICBpZiAoVGVzdC1QYXRoICRxelRyYXlQYXRoKSB7DQogICAgICAgICAgICBXcml0ZS1Ib3N0ICLinJMgUVogVHJheSBpbnN0YWxsZWQgc3VjY2Vzc2Z1bGx5IiAtRm9yZWdyb3VuZENvbG9yIEdyZWVuDQogICAgICAgICAgICBSZW1vdmUtSXRlbSAkaW5zdGFsbGVyUGF0aCAtRm9yY2UNCiAgICAgICAgfSBlbHNlIHsNCiAgICAgICAgICAgICRtc2cgPSAiV2FybmluZzogUVogVHJheSBpbnN0YWxsYXRpb24gcGF0aCBub3QgZm91bmQuIkluc3RhbGxhdGlvbiBtYXkgaGF2ZSBmYWlsZWQuIg0KICAgICAgICAgICAgV3JpdGUtSG9zdCAkbXNnIC1Gb3JlZ3JvdW5kQ29sb3IgWWVsbG93DQogICAgICAgIH0NCiAgICB9DQogICAgY2F0Y2ggew0KICAgICAgICBXcml0ZS1Ib3N0ICJFcnJvciBkb3dubG9hZGluZy9pbnN0YWxsaW5nIFFaIFRyYXk6ICRfIiAtRm9yZWdyb3VuZENvbG9yIFJlZA0KICAgICAgICBXcml0ZS1Ib3N0ICJQbGVhc2UgZG93bmxvYWQgbWFudWFsbHkgZnJvbSBodHRwczovL3F6LmlvL2Rvd25sb2FkLyIgLUZvcmVncm91bmRDb2xvciBZZWxsb3cNCiAgICAgICAgZXhpdCAxDQogICAgfQ0KfQ0KDQojIFN0ZXAgMjogRG93bmxvYWQgYW5kIGluc3RhbGwgb3ZlcnJpZGUuY3J0DQokY2VydFBhdGggPSAiQzpcUHJvZ3JhbSBGaWxlc1xRWiBUcmF5XG92ZXJyaWRlLmNydCINCiRjZXJ0RGlyID0gIkM6XFByb2dyYW0gRmlsZXNcUVogVHJheSINCg0KIyBFbnN1cmUgZGlyZWN0b3J5IGV4aXN0cw0KaWYgKC1ub3QgKFRlc3QtUGF0aCAkY2VydERpcikpIHsNCiAgICBOZXctSXRlbSAtSXRlbVR5cGUgRGlyZWN0b3J5IC1QYXRoICRjZXJ0RGlyIC1Gb3JjZSB8IE91dC1OdWxsDQp9DQoNCldyaXRlLUhvc3QgIkRvd25sb2FkaW5nIGNlcnRpZmljYXRlIGZyb20gJENlcnRpZmljYXRlVXJsLi4uIiAtRm9yZWdyb3VuZENvbG9yIFlsbG93DQoNCnRyeSB7DQogICAgJGNsaWVudCA9IE5ldy1PYmplY3QgU3lzdGVtLk5ldC5XZWJDbGllbnQNCiAgICAkY2xpZW50LkRvd25sb2FkRmlsZSgkQ2VydGlmaWNhdGVVcmwsICRjZXJ0UGF0aCkNCg0KICAgIGlmIChUZXN0LVBhdGggJGNlcnRQYXRoKSB7DQogICAgICAgIFdyaXRlLUhvc3QgIuKckyBDZXJ0aWZpY2F0ZSBpbnN0YWxsZWQgYXQgJGNlcnRQYXRoIiAtRm9yZWdyb3VuZENvbG9yIEdyZWVuDQogICAgfSBlbHNlIHsNCiAgICAgICAgV3JpdGUtSG9zdCAiRXJyb3I6IENlcnRpZmljYXRlIHdhcyBub3Qgc2F2ZWQiIC1Gb3JlZ3JvdW5kQ29sb3IgUmVkDQogICAgICAgIGV4aXQgMQ0KICAgIH0NCn0NCmNhdGNoIHsNCiAgICBXcml0ZS1Ib3N0ICJFcnJvciBkb3dubG9hZGluZyBjZXJ0aWZpY2F0ZTogJF8iIC1Gb3JlZ3JvdW5kQ29sb3IgUmVkDQogICAgV3JpdGUtSG9zdCAiTWFrZSBzdXJlIHRoZSBjZXJ0aWZpY2F0ZSBVUkwgaXMgYWNjZXNzaWJsZSIgLUZvcmVncm91bmRDb2xvciBZZWxsb3cNCiAgICBleGl0IDENCn0NCg0KIyBTdGVwIDM6IFJlc3RhcnQgUVogVHJheQ0KV3JpdGUtSG9zdCAiUmVzdGFydGluZyBRWiBUcmF5Li4uIiAtRm9yZWdyb3VuZENvbG9yIFlsbG93DQoNCiMgS2lsbCBhbnkgcnVubmluZyBRWiBUcmF5IGluc3RhbmNlcw0KR2V0LVByb2Nlc3MgcXotdHJheSAtRXJyb3JBY3Rpb24gU2lsZW50bHlDb250aW51ZSB8IFN0b3AtUHJvY2VzcyAtRm9yY2UNCiBTdGFydC1TbGVlcCAtU2Vjb25kcyAyDQoNCiMgU3RhcnQgUVogVHJheQ0KaWYgKFRlc3QtUGF0aCAkcXpUcmF5UGF0aCkgew0KICAgICYgJHF6VHJheVBhdGgNCiAgICBXcml0ZS1Ib3N0ICLinJMgUVogVHJheSBzdGFydGVkIiAtRm9yZWdyb3VuZENvbG9yIEdyZWVuDQp9DQoNCldyaXRlLUhvc3QgImBuU2V0dXAgQ29tcGxldGUhIiAtRm9yZWdyb3VuZENvbG9yIEdyZWVuDQpXcml0ZS1Ib3N0ICJOZXN0IHN0ZXBzOiIgLUZvcmVncm91bmRDb2xvciBDeWFuDQpXcml0ZS1Ib3N0ICIxLiBRWiBUcmF5IGlzIHJ1bm5pbmcgKGNoZWNrIHN5c3RlbSB0cmF5IGZvciBwcmludGVyIGljb24pIiAtRm9yZWdyb3VuZENvbG9yIEdyYXkNCldyaXRlLUhvc3QgIjIuIE9wZW4gUHJvU3RyaW5nIGluIHlvdXIgYnJvd3NlciIgLUZvcmVncm91bmRDb2xvciBHcmF5DQpXcml0ZS1Ib3N0ICIzLiBHcmFudCBwZXJtaXNzaW9uIHdoZW4gUVogVHJheSBzaG93cyB0aGUgc2VjdXJpdHkgZGlhbG9nIiAtRm9yZWdyb3VuZENvbG9yIEdyYXkNCldyaXRlLUhvc3QgIjQuIENvbmZpZ3VyZSB5b3VyIHByaW50ZXJzIGluIFByb1N0cmluZyBTZXR0aW5ncyIgLUZvcmVncm91bmRDb2xvciBHcmF5DQo='

const platform = os.platform()
const arch = os.arch()

console.log('\n╔═══════════════════════════════════════════╗')
console.log('║     QZ Tray Setup Wizard for ProString    ║')
console.log('╚═══════════════════════════════════════════╝\n')

console.log(`Platform: ${platform} (${arch})`)
console.log(`Node.js: ${process.version}\n`)

async function main() {
  try {
    if (platform === 'win32') {
      await installWindows()
    } else if (platform === 'darwin') {
      console.log('🍎 macOS Installation\nNote: Full installer not yet configured. Visit https://qz.io/download/')
    } else if (platform === 'linux') {
      console.log('🐧 Linux Installation\nNote: Full installer not yet configured. Visit https://qz.io/download/')
    } else {
      console.error(`❌ Unsupported platform: ${platform}`)
      process.exit(1)
    }

    if (platform === 'win32') {
      console.log('\n✅ Setup Complete!\n')
      console.log('Next steps:')
      console.log('  1. Go to ProString Settings')
      console.log('  2. Navigate to Printer Settings')
      console.log('  3. Click "Reconnect" to detect your printers')
      console.log('  4. Select your receipt and label printers')
      console.log('  5. Done! Printing will now work automatically\n')
    }

  } catch (err) {
    console.error(`\n❌ Installation failed: ${err.message}\n`)
    process.exit(1)
  }
}

async function installWindows() {
  console.log('🪟 Windows Installation\n')

  // Check admin rights
  try {
    execSync('net session', { stdio: 'ignore' })
  } catch (e) {
    console.error('❌ This script must be run as Administrator')
    console.error('   Right-click Command Prompt or PowerShell and select "Run as administrator"\n')
    process.exit(1)
  }

  console.log('Running PowerShell installer...\n')

  // Decode base64 script and write with CRLF line endings
  const scriptContent = Buffer.from(WINDOWS_SCRIPT_B64, 'base64').toString('utf-8')
  const scriptPath = path.join(os.tmpdir(), 'qz-tray-setup.ps1')
  const windowsLineEndings = scriptContent.replace(/\n/g, '\r\n')
  writeFileSync(scriptPath, windowsLineEndings, 'utf-8')

  try {
    execSync(
      `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`,
      { stdio: 'inherit', shell: 'powershell.exe' }
    )
  } catch (err) {
    throw new Error('PowerShell installation failed')
  }
}

main().catch((err) => {
  console.error(`\n❌ Error: ${err.message}\n`)
  process.exit(1)
})
