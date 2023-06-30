import api from './index';

/**
 * Logs in the user by generating an access token.
 *
 * @param {string} email The user's email address
 * @param {string} password The user's password
 * @return {object} The response object containing the access token
 */
export function generateToken(email, password) {
  return api.post('/auth/credentials', {
    email,
    password,
  });
}

/**
 * Refreshes the user's access token.
 *
 * @param {string} token The user's refresh token
 * @return {object} The response object containing the new access token
 */
export function refreshToken(token) {
  return api.post('/auth/refresh', {
    refreshToken: token,
  });
}