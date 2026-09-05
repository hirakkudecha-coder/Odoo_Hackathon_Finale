#!/bin/bash
# Generate Self-Signed TLS Certificate for Local Dev / Staging (Linux / macOS)
# Urban Furniture ERP - Phase 5 TLS / Reverse Proxy Implementation

SSL_DIR="$(cd "$(dirname "$0")/../ssl" && pwd)"
mkdir -p "$SSL_DIR"

CERT_PATH="$SSL_DIR/server.crt"
KEY_PATH="$SSL_DIR/server.key"

echo "Generating 2048-bit RSA Self-Signed TLS Certificate..."

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$KEY_PATH" \
  -out "$CERT_PATH" \
  -subj "/C=IN/ST=Gujarat/L=Ahmedabad/O=Urban Furniture/OU=Engineering/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,DNS:127.0.0.1,DNS:urbanfurniture.local,IP:127.0.0.1"

echo "TLS Certificate generated successfully:"
echo "  Certificate: $CERT_PATH"
echo "  Private Key: $KEY_PATH"
