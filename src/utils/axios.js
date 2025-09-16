import axios from 'axios';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.request.use(async (config) => {
  const token = sessionStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    config.headers['X-Forwarded-For'] = data.ip;
  } catch (e) {
    config.headers['X-Forwarded-For'] = '127.0.0.1';
  }
  config.headers['User-Agent'] = navigator.userAgent;
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error?.response?.data?.detail?.toLowerCase() || '';
    if (detail) {
      sessionStorage.clear();
      window.location.href = paths.auth.signIn;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    signIn: '/api/auth_system/login/',
    twoStep: '/api/auth_system/verify-otp/',
    reSendOtp: '/api/auth_system/resend-otp/',
    logout: '/api/auth_system/logout/',
    refresh: '/api/users/token/refresh/',
    forgotPassword: '/api/v1/auth/forgot-password',
    resetPassword: (token) => `api/v1/auth/reset-password/${token}`,
    validToken: (token) => `/api/v1/auth/validate-token/${token}`,
  },
  user: {
    addProduct: '/api/lead/product-types/',
    allProduct: '/api/lead/product-types/',
    getProduct: (id) => `/api/lead/product-types/${id}/`,
    editProduct: (id) => `/api/lead/product-types/${id}/`,
    searchProduct: '/api/lead/product-types/',
    deleteProduct: (id) => `/api/lead/product-types/${id}/`,

    addNatureBusiness: '/api/lead/nature-of-businesses/',
    allNatureBusiness: '/api/lead/nature-of-businesses/',
    getNatureBusines: (id) => `/api/lead/nature-of-businesses/${id}/`,
    editNatureBusiness: (id) => `/api/lead/nature-of-businesses/${id}/`,
    searchNatureBusiness: '/api/lead/nature-of-businesses/',
    deleteNatureBusiness: (id) => `/api/lead/nature-of-businesses/${id}/`,

    addProperty: '/api/lead/property-types/',
    allProperty: '/api/lead/property-types/',
    getProperty: (id) => `/api/lead/property-types/${id}/`,
    editProperty: (id) => `/api/lead/property-types/${id}/`,
    searchProperty: '/api/lead/property-types/',
    deleteProperty: (id) => `/api/lead/property-types/${id}/`,

    addLoanAmount: '/api/lead/loan-amount-ranges/',
    allLoanAmount: '/api/lead/loan-amount-ranges/',
    getLoanAmount: (id) => `/api/lead/loan-amount-ranges/${id}/`,
    editLoanAmount: (id) => `/api/lead/loan-amount-ranges/${id}/`,
    searchLoanAmount: '/api/lead/loan-amount-ranges/',
    deleteLoanAmount: (id) => `/api/lead/loan-amount-ranges/${id}/`,

    addPropertyDocument: '/api/lead/property-documents/',
    allPropertyDocument: '/api/lead/property-documents/',
    getPropertyDocument: (id) => `/api/lead/property-documents/${id}/`,
    searchPropertyDocument: '/api/lead/property-documents/',
    propertydocumentedit: (id) => `/api/lead/property-documents/${id}/`,
    deletepropertydocument: (id) => `/api/lead/property-documents/${id}/`,

    leadcount: 'api/lead/enquiries/all_counts/?count_only=true',
    allLeads: '/api/lead/enquiries/',
    activeleads: '/api/lead/enquiries/active/',
    closeleads: '/api/lead/enquiries/closed/',
    todayleads: '/api/lead/enquiries/today/',
    todayfollowup: '/api/lead/enquiries/followup/',
    monthleads: '/api/lead/enquiries/this-month/',
    refferedleads: '/api/lead/enquiries/assigned_lead/',

    leadgetbyid: (id) => `/api/lead/enquiries/${id}/`,
    Ticketleads: '/api/lead/enquiries/ticket/',
    Ticketgetbyid: (id) => `/api/lead/enquiries/ticket/${id}/`,

    enduselist: '/api/lead/enquiries/end-user/',
    addenduse: '/api/lead/enquiries/end-user/',
    endusebyid: (id) => `/api/lead/enquiries/end-user/${id}/`,
    deleteenduse: (id) => `/api/lead/enquiries/end-user/${id}/`,

    getallemployees: '/api/lead/enquiries/lead_assign/branch-employees/',
    getemplbybranch: (id) => `/api/lead/enquiries/lead_assign/branch-employees/?branch_id=${id}`,
    getfilteradata: '/api/lead/enquiries/reports/',

    followupdate: '/api/lead/enquiries/followup/update/',
    assignLead: (enquiryId) => `/api/lead/enquiries/${enquiryId}/lead_assign/`,
    reopenLead: (enquiryId) => `/api/lead/enquiries/${enquiryId}/reopen/`,

    incompleteTodayLead: '/api/lead/enquiries/today-draft/',
    incompleteAllLead: '/api/lead/enquiries/draft/',
    incompleteLead: (id) => `/api/lead/enquiries/${id}/`, 
  },
};
