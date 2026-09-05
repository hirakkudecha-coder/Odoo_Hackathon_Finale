/**
 * Escapes special regex characters in a user-supplied string to prevent ReDoS and regex injection.
 * @param {string} string 
 * @returns {string}
 */
const escapeRegex = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = escapeRegex;
