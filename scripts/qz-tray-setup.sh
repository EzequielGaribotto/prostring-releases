#!/bin/bash

CERTIFICATE_URL="${1:-https://stringjobs.prostringshop.es/qz/override.crt}"

echo "QZ Tray Setup - Linux/macOS"

if [ ! -d "/opt/qz-tray" ] && [ ! -d "/Applications/QZ Tray.app" ]; then
    echo "Downloading QZ Tray from GitHub..."

    OS_TYPE=$(uname -s)
    if [ "$OS_TYPE" = "Darwin" ]; then
        DOWNLOAD_URL="https://github.com/qzind/tray/releases/download/v2.2.6/qz-tray-2.2.6-macos.dmg"
        TMP_FILE="/tmp/qz-tray-2.2.6.dmg"
    else
        DOWNLOAD_URL="https://github.com/qzind/tray/releases/download/v2.2.6/qz-tray-2.2.6-linux-x64.zip"
        TMP_FILE="/tmp/qz-tray-2.2.6.zip"
    fi

    if ! curl -L -o "$TMP_FILE" "$DOWNLOAD_URL"; then
        echo "Error downloading QZ Tray"
        exit 1
    fi

    if [ "$OS_TYPE" = "Darwin" ]; then
        echo "Running macOS installer..."
        hdiutil attach "$TMP_FILE"
        cp -r "/Volumes/QZ Tray"/"QZ Tray.app" /Applications/
        hdiutil detach "/Volumes/QZ Tray"
        rm "$TMP_FILE"
    else
        echo "Installing Linux version..."
        unzip -q "$TMP_FILE" -d /tmp/qz-tray
        sudo mkdir -p /opt/qz-tray
        sudo cp /tmp/qz-tray/qz-tray-2.2.6/* /opt/qz-tray/
        rm -rf /tmp/qz-tray "$TMP_FILE"
    fi

    echo "QZ Tray installed"
else
    echo "QZ Tray already installed"
fi

echo "Downloading certificate..."

if [ "$(uname -s)" = "Darwin" ]; then
    CERT_DIR="/Applications/QZ Tray.app/Contents/Resources"
else
    CERT_DIR="/opt/qz-tray"
fi

mkdir -p "$CERT_DIR"

if ! curl -L -o "$CERT_DIR/override.crt" "$CERTIFICATE_URL"; then
    echo "Error downloading certificate"
    exit 1
fi

echo "Certificate installed"

echo "Restarting QZ Tray..."
pkill -f qz-tray || true
sleep 2

if [ "$(uname -s)" = "Darwin" ]; then
    open /Applications/"QZ Tray.app"
else
    /opt/qz-tray/qz-tray &
fi

echo "Setup Complete!"
echo "Next steps:"
echo "1. Grant permission when QZ Tray shows security dialog"
echo "2. Configure printers in ProString Settings"
