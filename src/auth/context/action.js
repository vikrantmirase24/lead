import { paths } from 'src/routes/paths';

import { encryptValue } from 'src/utils/crypto';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { setSession } from './utils';
/** **************************************
 * getAll Portals
 *************************************** */
export const getAllPortals = async (portalUserFetch) => {
  try {
    const result = await axiosInstance.post(endpoints.auth.getAllPortal, {
      username: portalUserFetch,
    });
    if (!result) {
      throw new Error("user portal not assign");
    }
    return result.data;
  } catch (error) {
    console.error('Error fetching portals:', error);
    throw error;
  }
};
/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ username, password, portal_id }) => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const ipData = await response.json();

    const agentBrowser = navigator.userAgent;

    const params = {
      username,
      password,
      portal_id
    };

    const res = await axiosInstance.post(endpoints.auth.signIn, params);
    const { accessToken, refreshToken, user, two_step, request_id } = res.data;

    if (two_step === true) {
      const searchParams = new URLSearchParams({
        user: encryptValue(user),
        portal: encryptValue(portal_id),
        request_id: encryptValue(request_id),
      });
      window.location.href = `${paths.auth.verify}?${searchParams.toString()}`;
      return null;
    }

    await setSession(accessToken, refreshToken);
    return { accessToken, refreshToken, user };
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};
/** **************************************
 * 2FA
 *************************************** */
export const confirmOtpSignUp = async ({ userId, portalId, otpCode, requestId }) => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const ipData = await response.json();

    const agentBrowser = navigator.userAgent;

    const params = {
      user_id: userId,
      portal_id: portalId,
      otp_code: otpCode,
      request_id: requestId, 
    };

    const result = await axiosInstance.post(endpoints.auth.twoStep, params);

    if (!result) throw new Error("Otp invalid");

    const { accessToken, refreshToken, user } = result.data;
    if (accessToken && refreshToken) {
      await setSession(accessToken, refreshToken);
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('portal_id', String(portalId));
    }
  } catch (error) {
    console.error('Error during OTP confirm:', error);
    throw error;
  }
};
/** **************************************
 * reSend otp
 *************************************** */
export const resendSignUpCode = async ({ userId }) => {
  try {
    const params = {
      user_id: userId
    };
    const result = await axiosInstance.post(endpoints.auth.reSendOtp, params);
    if (!result) {
      throw new Error("Otp invalid");
    }
  } catch (error) {
    console.error('Error during otp send:', error);
    throw error;
  }
};
/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    const refresh = sessionStorage.getItem('refresh_token');

    const ipRes = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipRes.json();
    const ip_address = ipData.ip;

    const agentBrowser = navigator.userAgent;

    const headers = {
      'X-Forwarded-For': ip_address,
      'User-Agent': agentBrowser,
    };

    await axiosInstance.post(
      endpoints.auth.logout,
      { refresh },
      { headers }
    );

    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
/** **************************************
 * forgot Password
 *************************************** */
export const forgotPassword = async ({ userName }) => {
  const { data, error } = await axiosInstance.post(endpoints.auth.forgotPassword, { username: userName });
  if (error) {
    console.error('sss:', error);
    throw error;
  }
  return { data, error };
};
/** **************************************
 * reset Password
 *************************************** */
export const resetPassword = async ({ resetToken, newPassword }) => {
  console.log('Sending data:', { resetToken, newPassword });
  try {
    const response = await axiosInstance.post(endpoints.auth.resetPassword(resetToken), {
      resetToken,
      newPassword,
    });
    console.log('Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};
/** **************************************
 * reset Password valid Token
 *************************************** */
export const validToken = async (token) => {
  try {
    const { data } = await axiosInstance.get(endpoints.auth.validToken(token));
    return data;
  } catch (error) {
    console.error('Error validating token:', error.response?.data || error.message);
    throw error;
  }
};
