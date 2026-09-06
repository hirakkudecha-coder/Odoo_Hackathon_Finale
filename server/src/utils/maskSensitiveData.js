/**
 * Sensitive Data & PII Masking Utility
 * Urban Furniture ERP - Enterprise Security Suite Phase 4
 * 
 * Protects Personally Identifiable Information (PII) and credentials
 * from inadvertent exposure in audit logs, telemetry, and non-privileged APIs.
 */

const CREDENTIAL_KEYS = new Set([
  'password',
  'currentpassword',
  'newpassword',
  'token',
  'secret',
  'refreshtoken',
  'authorization',
  'cookie',
  'jwt',
  'accesstoken',
  'idtoken'
]);

const PHONE_KEYS = new Set([
  'phone',
  'mobile',
  'contactnumber',
  'phonenumber'
]);

const BANK_KEYS = new Set([
  'bankaccount',
  'accountnumber',
  'bankaccountnumber',
  'iban'
]);

const TAX_KEYS = new Set([
  'taxid',
  'gstnumber',
  'pannumber',
  'gstin',
  'pan'
]);

/**
 * Masks a phone number to reveal only trailing 4 digits
 * E.g., "+91 9876543210" -> "••••••3210"
 */
function maskPhone(val) {
  if (!val) return val;
  const str = String(val).trim();
  if (str.length < 4) return '••••';
  const cleanDigits = str.replace(/\D/g, '');
  const last4 = cleanDigits.slice(-4);
  return `••••••${last4}`;
}

/**
 * Masks a bank account number to reveal only trailing 4 digits
 * E.g., "123456789012" -> "••••••••9012"
 */
function maskBankAccount(val) {
  if (!val) return val;
  const str = String(val).trim();
  if (str.length <= 4) return '••••';
  const last4 = str.slice(-4);
  return `••••••••${last4}`;
}

/**
 * Masks a Tax / GSTIN / PAN identifier
 * E.g., "27AAAAA0000A1Z5" -> "27•••••••••1Z5"
 */
function maskTaxId(val) {
  if (!val) return val;
  const str = String(val).trim();
  if (str.length < 6) return '••••••';
  const prefix = str.slice(0, 2);
  const suffix = str.slice(-3);
  return `${prefix}${'•'.repeat(Math.max(4, str.length - 5))}${suffix}`;
}

/**
 * Recursively masks sensitive fields in objects and arrays
 * @param {any} data 
 * @param {number} depth 
 * @returns {any} Sanitized clone or value
 */
function maskSensitiveData(data, depth = 0) {
  if (!data || typeof data !== 'object' || depth > 10) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => maskSensitiveData(item, depth + 1));
  }

  // Handle Mongoose documents or plain objects
  const raw = typeof data.toObject === 'function' ? data.toObject() : data;
  const clone = {};

  for (const [key, value] of Object.entries(raw)) {
    const lowerKey = key.toLowerCase().replace(/[-_]/g, '');

    if (CREDENTIAL_KEYS.has(lowerKey)) {
      clone[key] = '[REDACTED]';
    } else if (PHONE_KEYS.has(lowerKey)) {
      clone[key] = maskPhone(value);
    } else if (BANK_KEYS.has(lowerKey)) {
      clone[key] = maskBankAccount(value);
    } else if (TAX_KEYS.has(lowerKey)) {
      clone[key] = maskTaxId(value);
    } else if (value && typeof value === 'object') {
      clone[key] = maskSensitiveData(value, depth + 1);
    } else {
      clone[key] = value;
    }
  }

  return clone;
}

module.exports = {
  maskSensitiveData,
  maskPhone,
  maskBankAccount,
  maskTaxId
};
