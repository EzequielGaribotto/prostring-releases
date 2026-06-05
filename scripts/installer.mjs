#!/usr/bin/env node

import { execSync, spawnSync } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
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

  const scriptPath = path.join(__dirname, 'install-qz-tray-windows.ps1')
  if (!existsSync(scriptPath)) {
    throw new Error(`PowerShell script not found: ${scriptPath}`)
  }

  console.log('Running PowerShell installer...\n')

  try {
    // Run PowerShell script with admin bypass
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

  const scriptPath = path.join(__dirname, 'install-qz-tray-unix.sh')
  if (!existsSync(scriptPath)) {
    throw new Error(`Shell script not found: ${scriptPath}`)
  }

  console.log('Running shell installer...')
  console.log('You may be prompted to enter your password for administrative tasks.\n')

  try {
    execSync(`bash "${scriptPath}"`, { stdio: 'inherit' })
  } catch (err) {
    throw new Error('Shell installation failed')
  }
}

async function installLinux() {
  console.log('🐧 Linux Installation\n')

  const scriptPath = path.join(__dirname, 'install-qz-tray-unix.sh')
  if (!existsSync(scriptPath)) {
    throw new Error(`Shell script not found: ${scriptPath}`)
  }

  console.log('Running shell installer...')
  console.log('You may be prompted to enter your password for administrative tasks.\n')

  try {
    execSync(`bash "${scriptPath}"`, { stdio: 'inherit' })
  } catch (err) {
    throw new Error('Shell installation failed')
  }
}

// Run with error handling
main().catch((err) => {
  console.error(`\n❌ Error: ${err.message}\n`)
  process.exit(1)
})
