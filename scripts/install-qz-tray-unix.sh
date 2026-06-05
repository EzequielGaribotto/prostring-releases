#!/bin/bash
# QZ Tray Setup Script for macOS and Linux
# Installs QZ Tray and sets up override.crt certificate

set -e

CERTIFICATE_URL="${1:-http://localhost:5173/override.crt}"
OS_TYPE=$(uname -s)

echo -e "\n\033[36mQZ Tray Setup - $OS_TYPE\033[0m\n"

# Detect OS and set paths accordingly
if [[ "$OS_TYPE" == "Darwin" ]]; then
    # macOS paths
    QZ_INSTALL_DIR="$HOME/Applications/QZ Tray.app"
    QZ_EXECUTABLE="$QZ_INSTALL_DIR/Contents/MacOS/QZ Tray"
    CERT_PATH="$HOME/Library/Application Support/QZ Tray/override.crt"
    CERT_DIR="$HOME/Library/Application Support/QZ Tray"
    DOWNLOAD_URL="https://qz.io/download/?os=mac"
    INSTALLER_PATH="/tmp/qz-tray-installer.dmg"
elif [[ "$OS_TYPE" == "Linux" ]]; then
    # Linux paths
    QZ_INSTALL_DIR="/opt/qz-tray"
    QZ_EXECUTABLE="$QZ_INSTALL_DIR/qz-tray"
    CERT_PATH="$HOME/.config/QZ Tray/override.crt"
    CERT_DIR="$HOME/.config/QZ Tray"
    DOWNLOAD_URL="https://qz.io/download/?os=linux"
    INSTALLER_PATH="/tmp/qz-tray-installer.deb"
else
    echo -e "\033[31mError: Unsupported OS ($OS_TYPE)\033[0m"
    exit 1
fi

# Step 1: Check if QZ Tray is installed
if [[ -f "$QZ_EXECUTABLE" ]]; then
    echo -e "\033[32m✓ QZ Tray is already installed\033[0m"
else
    echo -e "\033[33mDownloading QZ Tray...\033[0m"

    # Download installer
    if ! curl -L -o "$INSTALLER_PATH" "$DOWNLOAD_URL"; then
        echo -e "\033[31mError: Failed to download QZ Tray\033[0m"
        echo -e "\033[33mPlease download manually from https://qz.io/download/\033[0m"
        exit 1
    fi

    # Install based on OS
    if [[ "$OS_TYPE" == "Darwin" ]]; then
        echo -e "\033[33mMounting and installing QZ Tray (macOS)...\033[0m"

        # Mount DMG
        hdiutil attach "$INSTALLER_PATH" -quiet
        DMG_MOUNT=$(mount | grep qz-tray | awk '{print $3}')

        if [[ -z "$DMG_MOUNT" ]]; then
            echo -e "\033[31mError: Could not mount DMG\033[0m"
            exit 1
        fi

        # Copy to Applications
        mkdir -p "$HOME/Applications"
        cp -r "$DMG_MOUNT/QZ Tray.app" "$HOME/Applications/"

        # Unmount
        hdiutil detach "$DMG_MOUNT" -quiet

        if [[ -f "$QZ_EXECUTABLE" ]]; then
            echo -e "\033[32m✓ QZ Tray installed successfully\033[0m"
            rm "$INSTALLER_PATH"
        else
            echo -e "\033[31mError: Installation failed\033[0m"
            exit 1
        fi

    elif [[ "$OS_TYPE" == "Linux" ]]; then
        echo -e "\033[33mInstalling QZ Tray (Linux)...\033[0m"

        # Check if we have sudo rights
        if ! sudo -n true 2>/dev/null; then
            echo -e "\033[33mSudo password required for installation:\033[0m"
        fi

        if ! sudo dpkg -i "$INSTALLER_PATH"; then
            echo -e "\033[31mError: dpkg installation failed\033[0m"
            echo -e "\033[33mTrying apt-get to resolve dependencies...\033[0m"
            sudo apt-get install -f -y || exit 1
        fi

        if [[ -f "$QZ_EXECUTABLE" ]]; then
            echo -e "\033[32m✓ QZ Tray installed successfully\033[0m"
            rm "$INSTALLER_PATH"
        else
            echo -e "\033[31mError: Installation failed\033[0m"
            exit 1
        fi
    fi
fi

# Step 2: Download and install certificate
mkdir -p "$CERT_DIR"

echo -e "\033[33mDownloading certificate from $CERTIFICATE_URL...\033[0m"

if ! curl -L -o "$CERT_PATH" "$CERTIFICATE_URL"; then
    echo -e "\033[31mError: Failed to download certificate\033[0m"
    echo -e "\033[33mMake sure the certificate URL is accessible\033[0m"
    exit 1
fi

if [[ -f "$CERT_PATH" ]]; then
    echo -e "\033[32m✓ Certificate installed at $CERT_PATH\033[0m"
else
    echo -e "\033[31mError: Certificate was not saved\033[0m"
    exit 1
fi

# Step 3: Kill existing QZ Tray processes and restart
echo -e "\033[33mRestarting QZ Tray...\033[0m"

killall "QZ Tray" 2>/dev/null || true
sleep 2

# Start QZ Tray
if [[ "$OS_TYPE" == "Darwin" ]]; then
    open -a "QZ Tray"
elif [[ "$OS_TYPE" == "Linux" ]]; then
    nohup "$QZ_EXECUTABLE" > /dev/null 2>&1 &
fi

echo -e "\033[32m✓ QZ Tray started\033[0m"

echo -e "\n\033[32mSetup Complete!\033[0m"
echo -e "\n\033[36mNext steps:\033[0m"
echo -e "  \033[37m1. QZ Tray is running (check system tray for printer icon)\033[0m"
echo -e "  \033[37m2. Open ProString in your browser\033[0m"
echo -e "  \033[37m3. Grant permission when QZ Tray shows the security dialog\033[0m"
echo -e "  \033[37m4. Configure your printers in ProString Settings\033[0m"
echo ""
