/**
 * Password Policy Enforcement Utility (OWASP Compliance)
 * Urban Furniture ERP - Enterprise Security Suite Phase 4
 */

const MIN_LENGTH = 8;
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /[0-9]/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;

/**
 * Validates candidate password against enterprise security complexity rules
 * @param {string} password 
 * @returns {{ isValid: boolean, message?: string }}
 */
function validatePasswordComplexity(password) {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      message: 'Password must be a valid non-empty string.'
    };
  }

  if (password.length < MIN_LENGTH) {
    return {
      isValid: false,
      message: `Password must be at least ${MIN_LENGTH} characters long.`
    };
  }

  if (!UPPERCASE_REGEX.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter (A-Z).'
    };
  }

  if (!LOWERCASE_REGEX.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter (a-z).'
    };
  }

  if (!NUMBER_REGEX.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one numeric digit (0-9).'
    };
  }

  if (!SPECIAL_CHAR_REGEX.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character (!@#$%^&*...).'
    };
  }

  return { isValid: true };
}

module.exports = {
  validatePasswordComplexity,
  MIN_LENGTH
};
