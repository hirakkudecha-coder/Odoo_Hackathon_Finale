/**
 * Zero-Dependency TOTP & Multi-Factor Authentication Service (RFC 6238 / RFC 4226)
 * Urban Furniture ERP - Enterprise Security Suite Phase 5
 * 
 * Implements Time-based One-Time Password algorithm natively using Node.js crypto.
 * Compatible with Google Authenticator, Microsoft Authenticator, Authy, and 1Password.
 */

const crypto = require('crypto');

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Encodes a buffer into a Base32 string
 * @param {Buffer} buffer 
 * @returns {string} Base32 encoded string
 */
function base32Encode(buffer) {
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Decodes a Base32 string into a Buffer
 * @param {string} base32Str 
 * @returns {Buffer}
 */
function base32Decode(base32Str) {
  const cleaned = base32Str.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0;
  let value = 0;
  const bytes = [];

  for (let i = 0; i < cleaned.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(cleaned[i]);
    if (idx === -1) continue;

    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Generates a random Base32 secret string (default 20 bytes = 160 bits)
 * @param {number} byteLength 
 * @returns {string}
 */
function generateBase32Secret(byteLength = 20) {
  const randomBytes = crypto.randomBytes(byteLength);
  return base32Encode(randomBytes);
}

/**
 * Computes a 6-digit TOTP token for a given Base32 secret and counter
 * @param {string} base32Secret 
 * @param {number} counter 
 * @returns {string} 6-digit zero-padded numeric string
 */
function computeTOTP(base32Secret, counter) {
  const key = base32Decode(base32Secret);
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));

  const hmac = crypto.createHmac('sha1', key).update(counterBuffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;

  const binaryCode =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const token = (binaryCode % 1000000).toString().padStart(6, '0');
  return token;
}

/**
 * Generates current 6-digit TOTP token (with optional window offset)
 * @param {string} base32Secret 
 * @param {number} windowOffset 
 * @returns {string}
 */
function generateTOTP(base32Secret, windowOffset = 0) {
  const currentStep = Math.floor(Date.now() / 1000 / 30);
  return computeTOTP(base32Secret, currentStep + windowOffset);
}

/**
 * Verifies a candidate 6-digit TOTP token allowing +/- windowTolerance steps
 * @param {string} base32Secret 
 * @param {string} candidateToken 
 * @param {number} windowTolerance 
 * @returns {boolean}
 */
function verifyTOTP(base32Secret, candidateToken, windowTolerance = 1) {
  if (!base32Secret || !candidateToken) return false;
  const cleanToken = String(candidateToken).trim();
  if (cleanToken.length !== 6 || !/^\d{6}$/.test(cleanToken)) return false;

  const currentStep = Math.floor(Date.now() / 1000 / 30);

  for (let offset = -windowTolerance; offset <= windowTolerance; offset++) {
    const expected = computeTOTP(base32Secret, currentStep + offset);
    if (crypto.timingSafeEqual(Buffer.from(cleanToken), Buffer.from(expected))) {
      return true;
    }
  }

  return false;
}

/**
 * Generates standard otpauth:// URI for authenticator QR code scanning
 * @param {string} email 
 * @param {string} base32Secret 
 * @param {string} issuer 
 * @returns {string}
 */
function generateOtpAuthUri(email, base32Secret, issuer = 'Urban Furniture ERP') {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedEmail = encodeURIComponent(email);
  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${base32Secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Generates a set of single-use emergency recovery backup codes
 * E.g. ["a1b2-c3d4", "e5f6-g7h8", ...]
 * @param {number} count 
 * @returns {string[]}
 */
function generateBackupCodes(count = 5) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const raw = crypto.randomBytes(4).toString('hex'); // 8 characters
    const formatted = `${raw.slice(0, 4)}-${raw.slice(4, 8)}`.toUpperCase();
    codes.push(formatted);
  }
  return codes;
}

module.exports = {
  base32Encode,
  base32Decode,
  generateBase32Secret,
  generateTOTP,
  verifyTOTP,
  generateOtpAuthUri,
  generateBackupCodes
};
