import Cookies from 'js-cookie';

import { paths } from 'src/routes/paths';

import axios from 'src/utils/axios';
import { encryptValue } from 'src/utils/crypto';

import { PORTAL_KEY,STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------
export function jwtDecode(token) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid token!');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------
export function isValidToken(accessToken) {
  if (!accessToken) {
    return false;
  }
  
  try {
    const decoded = jwtDecode(accessToken);

    if (!decoded || !('exp' in decoded)) {
      return false;
    }

    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error during token validation:', error);
    return false;
  }
}

// ----------------------------------------------------------------------
export function tokenExpired(exp) {
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  setTimeout(() => {
    try {
      alert('Token expired!');
      sessionStorage.removeItem(STORAGE_KEY);
      window.location.href = paths.auth.signIn;
    } catch (error) {
      console.error('Error during token expiration:', error);
      throw error;
    }
  }, timeLeft);
}

// ----------------------------------------------------------------------

// export async function setSession(accessToken, user) {
//   try {
//     if (accessToken) {
//       sessionStorage.setItem(STORAGE_KEY, accessToken ,user);

//       axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

//       const decodedToken = jwtDecode(accessToken); // ~3 days by minimals server
      
//       if (decodedToken && 'exp' in decodedToken) {
//         tokenExpired(decodedToken.exp);
//       } else {
//         throw new Error('Invalid access token!');
//       }
//     } else {
//       sessionStorage.removeItem(STORAGE_KEY);
//       delete axios.defaults.headers.common.Authorization;
//     }
//   } catch (error) {
//     console.error('Error during set session:', error);
//     throw error;
//   }
// }

const REFRESH_KEY = 'refresh_token';

export async function setSession(accessToken, refreshToken) {
  try {
    if (accessToken) {
      sessionStorage.setItem('access_token', accessToken);
      sessionStorage.setItem('refresh_token', refreshToken);
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      delete axios.defaults.headers.common.Authorization;
    }
  } catch (error) {
    console.error('Error during set session:', error);
    throw error;
  }
}

// export const refreshSession = async () => {
//   const refresh_token = sessionStorage.getItem('refresh_token');
//   if (!refresh_token) {
//     console.warn('[Refresh] No refresh token found.');
//     return;
//   }

//   try {
//     const response = await axios.post(endpoints.auth.refresh, {
//       refresh: refresh_token,
//     });

//     const { access_token, refresh_token: new_refresh_token } = response.data;

//     const decoded = jwtDecode(access_token);

//     console.log('[Refresh] New access token:', access_token);
//     console.log('[Refresh] Token expiry time:', new Date(decoded.exp * 1000));

//     // 🟨 Update access token
//     sessionStorage.setItem('access_token', access_token);
//     axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;

//     // 🟨 Update refresh token (if backend returns it)
//     if (new_refresh_token) {
//       sessionStorage.setItem('refresh_token', new_refresh_token);
//       console.log('[Refresh] Updated refresh token stored.');
//     } else {
//       console.warn('[Refresh] Backend did NOT return a new refresh token.');
//     }

//   } catch (error) {
//     console.error('[Refresh] Token refresh failed:', error?.response?.data || error.message);
//     sessionStorage.clear();
//     localStorage.clear();
//     window.location.href = '/login';
//   }
// };

export async function setCookies(accessToken,portalId) {
  try {
    if (accessToken && portalId) {
        Cookies.set(STORAGE_KEY, accessToken, {
          path: '/', 
          domain: 'localhost', 
          sameSite: 'lax', 
          secure: false, 
        });
        Cookies.set(PORTAL_KEY, encryptValue(portalId),{
          path: '/', 
          domain: 'localhost', 
          sameSite: 'lax', 
          secure: false, 
        });
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      axios.defaults.headers.common['user-agent'] = navigator.userAgent;
      axios.defaults.headers.common['x-forwarded-for'] = '106.213.87.10';
      const decodedToken = jwtDecode(accessToken);
      if (decodedToken && 'exp' in decodedToken) {
        tokenExpired(decodedToken.exp);
      } else {
        throw new Error('Invalid access token!');
      }
    } else {
     // Cookies.remove(STORAGE_KEY);
      Cookies.remove(PORTAL_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      delete axios.defaults.headers.common.Authorization;
      window.location.replace(import.meta.env.VITE_PORTAL_SSO_URL);
    }
  } catch (error) {
    console.error('Error during set session:', error);
    throw error;
  }
}