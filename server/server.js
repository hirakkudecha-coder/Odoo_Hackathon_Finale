require('dotenv').config();
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;
const USE_HTTPS = process.env.USE_HTTPS === 'true';
const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;

let server;

const startServer = async () => {
  await connectDB();
  
  if (USE_HTTPS && SSL_KEY_PATH && SSL_CERT_PATH && fs.existsSync(SSL_KEY_PATH) && fs.existsSync(SSL_CERT_PATH)) {
    const sslOptions = {
      key: fs.readFileSync(path.resolve(SSL_KEY_PATH)),
      cert: fs.readFileSync(path.resolve(SSL_CERT_PATH))
    };
    server = https.createServer(sslOptions, app);
    server.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(` Urban Furniture Backend Running (HTTPS) `);
      console.log(` Port:      ${PORT}`);
      console.log(` Protocol:  https://`);
      console.log(` Env:       ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health:    https://localhost:${PORT}/api/health`);
      console.log(` Heartbeat: https://localhost:${PORT}/api/health/heartbeat`);
      console.log(`=========================================`);
    });
  } else {
    server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(` Urban Furniture Backend Running (HTTP / Reverse Proxy) `);
      console.log(` Port:      ${PORT}`);
      console.log(` Protocol:  http://`);
      console.log(` Proxy:     Trust Proxy Active (${app.get('trust proxy')})`);
      console.log(` Env:       ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health:    http://localhost:${PORT}/api/health`);
      console.log(` Heartbeat: http://localhost:${PORT}/api/health/heartbeat`);
      console.log(`=========================================`);
    });
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
