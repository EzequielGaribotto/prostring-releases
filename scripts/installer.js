#!/usr/bin/env node

const { execSync } = require('child_process')
const { writeFileSync } = require('fs')
const path = require('path')
const os = require('os')

const WINDOWS_SCRIPT_B64 = 'cGFyYW0oCiAgICBbc3RyaW5nXSRDZXJ0aWZpY2F0ZVVybCA9ICJodHRwczovL3N0cmluZ2pvYnMucHJvc3RyaW5nc2hvcC5lcy9xei9vdmVycmlkZS5jcnQiCikKCiRFcnJvckFjdGlvblByZWZlcmVuY2UgPSAiU3RvcCIKCldyaXRlLUhvc3QgIlFaIFRyYXkgU2V0dXAgLSBXaW5kb3dzIiAtRm9yZWdyb3VuZENvbG9yIEN5YW4KCiRpc0FkbWluID0gKFtTZWN1cml0eS5QcmluY2lwYWwuV2luZG93c1ByaW5jaXBhbF0gW1NlY3VyaXR5LlByaW5jaXBhbC5XaW5kb3dzSWRlbnRpdHldOjpHZXRDdXJyZW50KCkpLklzSW5Sb2xlKFtTZWN1cml0eS5QcmluY2lwYWwuV2luZG93c0J1aWx0SW5Sb2xlXSAiQWRtaW5pc3RyYXRvciIpCmlmICgtbm90ICRpc0FkbWluKSB7CiAgICBXcml0ZS1Ib3N0ICJFcnJvcjogUnVuIGFzIEFkbWluaXN0cmF0b3IiIC1Gb3JlZ3JvdW5kQ29sb3IgUmVkCiAgICBleGl0IDEKfQoKJHF6VHJheVBhdGggPSAiQzpcUHJvZ3JhbSBGaWxlc1xRWiBUcmF5XHF6LXRyYXkuZXhlIgppZiAoLW5vdCAoVGVzdC1QYXRoICRxelRyYXlQYXRoKSkgewogICAgV3JpdGUtSG9zdCAiRG93bmxvYWRpbmcgUVogVHJheS4uLiIgLUZvcmVncm91bmRDb2xvciBZZWxsb3cKICAgICR0bXBFeGUgPSAiJGVudjpURU1QXHF6LXRyYXktMi4yLjYuZXhlIgoKICAgIHRyeSB7CiAgICAgICAgJHdlYiA9IE5ldy1PYmplY3QgU3lzdGVtLk5ldC5XZWJDbGllbnQKICAgICAgICAkd2ViLkRvd25sb2FkRmlsZSgiaHR0cHM6Ly9naXRodWIuY29tL3F6aW5kL3RyYXkvcmVsZWFzZXMvZG93bmxvYWQvdjIuMi42L3F6LXRyYXktMi4yLjYteDg2XzY0LmV4ZSIsICR0bXBFeGUpCiAgICAgICAgV3JpdGUtSG9zdCAiUnVubmluZyBpbnN0YWxsZXIuLi4iIC1Gb3JlZ3JvdW5kQ29sb3IgWWVsbG93CiAgICAgICAgJiAkdG1wRXhlIC9TCiAgICAgICAgU3RhcnQtU2xlZXAgLVNlY29uZHMgNQogICAgICAgIGlmIChUZXN0LVBhdGggJHRtcEV4ZSkgewogICAgICAgICAgICBSZW1vdmUtSXRlbSAkdG1wRXhlIC1Gb3JjZSAtRXJyb3JBY3Rpb24gU2lsZW50bHlDb250aW51ZQogICAgICAgIH0KICAgICAgICBXcml0ZS1Ib3N0ICJRWiBUcmF5IGluc3RhbGxlZCIgLUZvcmVncm91bmRDb2xvciBHcmVlbgogICAgfSBjYXRjaCB7CiAgICAgICAgV3JpdGUtSG9zdCAiRG93bmxvYWQgZmFpbGVkOiAkXyIgLUZvcmVncm91bmRDb2xvciBSZWQKICAgICAgICBleGl0IDEKICAgIH0KfSBlbHNlIHsKICAgIFdyaXRlLUhvc3QgIlFaIFRyYXkgYWxyZWFkeSBpbnN0YWxsZWQiIC1Gb3JlZ3JvdW5kQ29sb3IgR3JlZW4KfQoKJGNlcnREaXIgPSAiQzpcUHJvZ3JhbSBGaWxlc1xRWiBUcmF5IgokY2VydFBhdGggPSAiJGNlcnREaXJcb3ZlcnJpZGUuY3J0IgoKaWYgKC1ub3QgKFRlc3QtUGF0aCAkY2VydERpcikpIHsKICAgIE5ldy1JdGVtIC1JdGVtVHlwZSBEaXJlY3RvcnkgLVBhdGggJGNlcnREaXIgLUZvcmNlIHwgT3V0LU51bGwKfQoKV3JpdGUtSG9zdCAiRG93bmxvYWRpbmcgY2VydGlmaWNhdGUuLi4iIC1Gb3JlZ3JvdW5kQ29sb3IgWWVsbG93Cgp0cnkgewogICAgJHdlYiA9IE5ldy1PYmplY3QgU3lzdGVtLk5ldC5XZWJDbGllbnQKICAgICR3ZWIuRG93bmxvYWRGaWxlKCRDZXJ0aWZpY2F0ZVVybCwgJGNlcnRQYXRoKQogICAgV3JpdGUtSG9zdCAiQ2VydGlmaWNhdGUgaW5zdGFsbGVkIiAtRm9yZWdyb3VuZENvbG9yIEdyZWVuCn0gY2F0Y2ggewogICAgV3JpdGUtSG9zdCAiQ2VydGlmaWNhdGUgZG93bmxvYWQgZmFpbGVkOiAkXyIgLUZvcmVncm91bmRDb2xvciBSZWQKICAgIGV4aXQgMQp9CgpXcml0ZS1Ib3N0ICJSZXN0YXJ0aW5nIFFaIFRyYXkuLi4iIC1Gb3JlZ3JvdW5kQ29sb3IgWWVsbG93CkdldC1Qcm9jZXNzIHF6LXRyYXkgLUVycm9yQWN0aW9uIFNpbGVudGx5Q29udGludWUgfCBTdG9wLVByb2Nlc3MgLUZvcmNlClN0YXJ0LVNsZWVwIC1TZWNvbmRzIDIKCmlmIChUZXN0LVBhdGggJHF6VHJheVBhdGgpIHsKICAgICYgJHF6VHJheVBhdGgKICAgIFdyaXRlLUhvc3QgIlFaIFRyYXkgc3RhcnRlZCIgLUZvcmVncm91bmRDb2xvciBHcmVlbgp9CgpXcml0ZS1Ib3N0ICJgblNldHVwIENvbXBsZXRlISIgLUZvcmVncm91bmRDb2xvciBHcmVlbgpXcml0ZS1Ib3N0ICJOZXh0IHN0ZXBzOiIgLUZvcmVncm91bmRDb2xvciBDeWFuCldyaXRlLUhvc3QgIjEuIEdyYW50IHBlcm1pc3Npb24gd2hlbiBRWiBUcmF5IHNob3dzIHNlY3VyaXR5IGRpYWxvZyIgLUZvcmVncm91bmRDb2xvciBHcmF5CldyaXRlLUhvc3QgIjIuIENvbmZpZ3VyZSBwcmludGVycyBpbiBQcm9TdHJpbmcgU2V0dGluZ3MiIC1Gb3JlZ3JvdW5kQ29sb3IgR3JheQo='

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
      await installMacOS()
    } else if (platform === 'linux') {
      await installLinux()
    } else {
      console.error(`❌ Unsupported platform: ${platform}`)
      process.exit(1)
    }

  } catch (err) {
    console.error(`\n❌ Installation failed: ${err.message}\n`)
    process.exit(1)
  }
}

async function installWindows() {
  console.log('🪟 Windows Installation\n')

  try {
    execSync('net session', { stdio: 'ignore' })
  } catch (e) {
    console.error('❌ This script must be run as Administrator')
    console.error('   Right-click Command Prompt or PowerShell and select "Run as administrator"\n')
    process.exit(1)
  }

  console.log('Running PowerShell installer...\n')

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

async function installMacOS() {
  console.log('🍎 macOS Installation\n')
  console.log('Running shell installer...\n')

  const scriptPath = path.join(__dirname, 'qz-tray-setup.sh')

  try {
    execSync(`bash "${scriptPath}"`, { stdio: 'inherit' })
  } catch (err) {
    throw new Error('Shell installation failed')
  }
}

async function installLinux() {
  console.log('🐧 Linux Installation\n')
  console.log('Running shell installer...\n')

  const scriptPath = path.join(__dirname, 'qz-tray-setup.sh')

  try {
    execSync(`bash "${scriptPath}"`, { stdio: 'inherit' })
  } catch (err) {
    throw new Error('Shell installation failed')
  }
}

main().catch((err) => {
  console.error(`\n❌ Error: ${err.message}\n`)
  process.exit(1)
})
