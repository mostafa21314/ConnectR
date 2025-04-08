/**
 * Validates password strength.
 * Password must be at least 8 characters long with:
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (@, $, !, %, *, ?, &)
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password meets the criteria; otherwise, false.
 */
export const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };