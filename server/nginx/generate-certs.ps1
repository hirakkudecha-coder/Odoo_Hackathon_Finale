# Generate Self-Signed TLS Certificate for Local Dev / Staging
# Urban Furniture ERP - Phase 5 TLS / Reverse Proxy Implementation

$sslDir = Join-Path $PSScriptRoot "..\ssl"
if (!(Test-Path $sslDir)) {
    New-Item -ItemType Directory -Path $sslDir -Force | Out-Null
}

$certPath = Join-Path $sslDir "server.crt"
$keyPath = Join-Path $sslDir "server.key"
$pfxPath = Join-Path $sslDir "temp.pfx"
$password = "urbanfurniture"
$secPassword = ConvertTo-SecureString -String $password -Force -AsPlainText

# Locate openssl
$openssl = "openssl"
if (!(Get-Command openssl -ErrorAction SilentlyContinue)) {
    if (Test-Path "C:\Program Files\Git\usr\bin\openssl.exe") {
        $openssl = "C:\Program Files\Git\usr\bin\openssl.exe"
    }
}

Write-Host "Generating 2048-bit RSA Self-Signed Certificate using OpenSSL..." -ForegroundColor Cyan

& $openssl req -x509 -nodes -days 365 -newkey rsa:2048 `
    -keyout $keyPath `
    -out $certPath `
    -subj "/C=IN/ST=Gujarat/L=Ahmedabad/O=Urban Furniture/OU=Engineering/CN=localhost" `
    -addext "subjectAltName=DNS:localhost,DNS:127.0.0.1,DNS:urbanfurniture.local,IP:127.0.0.1"

Write-Host "TLS Certificate generated successfully:" -ForegroundColor Green
Write-Host "  Certificate: $certPath"
Write-Host "  Private Key: $keyPath"
