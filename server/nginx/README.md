# 🔒 Urban Furniture ERP - TLS/SSL & Reverse Proxy Architecture

This directory contains the production-grade Nginx reverse proxy configuration, TLS termination setup, and certificate management scripts for the Urban Furniture ERP platform (Phase 5 Remediation).

---

## 1. Architecture Overview

```
                      HTTPS (Port 443) / TLSv1.2 & TLSv1.3
[ Client Browser ] ──────────────────────────────────────────► [ Nginx Reverse Proxy ]
         │                                                            │
         │ (Port 80 HTTP)                                             ├─► /api/* ──► [ Express Backend:5000 ]
         └──────────────────► 301 Permanent Redirect                 │               (trust proxy = 1)
                                                                      └─► /*     ──► [ Vite SPA:5173 / Static ]
```

### Key Security & Performance Capabilities:
1. **SSL/TLS Termination:** Dual-stack TLSv1.2 & TLSv1.3 with high-security cipher suites (`ECDHE-ECDSA-AES128-GCM-SHA256`, `ECDHE-RSA-CHACHA20-POLY1305`, etc.).
2. **HTTP Strict Transport Security (HSTS):** Enforces 1-year HSTS (`max-age=31536000; includeSubDomains; preload`).
3. **HTTP to HTTPS 301 Redirect:** Automatically upgrades all unencrypted port 80 traffic to encrypted port 443.
4. **Proxy Header Forwarding:** Forwards `X-Forwarded-For`, `X-Real-IP`, `X-Forwarded-Proto`, and `X-Forwarded-Host` to Express.
5. **Express Trust Proxy:** Backend is configured with `app.set('trust proxy', 1)` to accurately resolve client IP addresses and protocol.
6. **Defense in Depth Headers:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`.
7. **Rate Limiting:** Protects `/api/` with `50r/s` and `/api/auth/login` with `10r/s` burst limiters.
8. **WebSocket Support:** Configured for Vite HMR and real-time ERP updates via `Upgrade` and `Connection` headers.

---

## 2. Directory Structure

```
server/
├── nginx/
│   ├── nginx.conf                 # Main Nginx process and event configuration
│   ├── conf.d/
│   │   └── urban-furniture.conf   # Virtual host reverse proxy & TLS termination
│   ├── generate-certs.ps1         # Windows PowerShell self-signed cert generator
│   ├── generate-certs.sh          # Linux/macOS OpenSSL self-signed cert generator
│   └── README.md                  # This deployment & architecture guide
├── ssl/
│   ├── server.crt                 # 2048-bit RSA X.509 TLS certificate
│   └── server.key                 # Private RSA key (PEM)
├── docker-compose.yml             # Full-stack Docker orchestration (Nginx + API + Mongo)
└── Dockerfile                     # Multi-stage production container build
```

---

## 3. Quick Start & Local Testing

### Generating Development TLS Certificates
On Windows (PowerShell):
```powershell
powershell -ExecutionPolicy Bypass -File nginx/generate-certs.ps1
```

On Linux / macOS (Bash):
```bash
chmod +x nginx/generate-certs.sh
./nginx/generate-certs.sh
```

### Running with Docker Compose
```bash
docker-compose up -d --build
```
Access the application securely at `https://localhost` or `https://127.0.0.1`.

---

## 4. Production Deployment with Let's Encrypt / Certbot

To obtain free, automated, browser-trusted TLS certificates via Let's Encrypt:

1. Install Certbot on your host:
   ```bash
   sudo apt update
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. Request certificates for your domain:
   ```bash
   sudo certbot --nginx -d erp.yourdomain.com -d api.yourdomain.com
   ```

3. Update [`conf.d/urban-furniture.conf`](file:///d:/Desktop/odoo-srgasan/Odoo_Hackathon_Finale/server/nginx/conf.d/urban-furniture.conf):
   ```nginx
   ssl_certificate /etc/letsencrypt/live/erp.yourdomain.com/fullchain.pem;
   ssl_certificate_key /etc/letsencrypt/live/erp.yourdomain.com/privkey.pem;
   ```

4. Enable automatic renewal:
   ```bash
   sudo systemctl enable certbot.timer
   ```

---

## 5. Verification Checklist

- [x] Port 80 redirects to Port 443 with HTTP `301 Moved Permanently`.
- [x] Port 443 serves valid TLSv1.2 / TLSv1.3 connection.
- [x] Backend correctly receives `X-Forwarded-For` and `X-Forwarded-Proto`.
- [x] `X-Powered-By` header is stripped to eliminate server fingerprinting.
- [x] HSTS header `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` is present.
- [x] MIME sniffing protection (`X-Content-Type-Options: nosniff`) is enforced.
- [x] Clickjacking protection (`X-Frame-Options: SAMEORIGIN`) is enforced.
