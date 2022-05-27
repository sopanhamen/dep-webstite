import sha1 from 'sha1';
import axios from 'axios';
import store from 'store';
import { getLanguage } from '@shared/custom-function/common';

interface IExtraAxiosHeader {
  key: string;
  value: any;
}

const url = process.env.NEXT_PUBLIC_API_URL;
const clientId = process.env.NEXT_PUBLIC_API_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_API_CLIENT_SECRET;
const clientSha1 = sha1(`${clientId}:${clientSecret}`);
const Authorization = `Bearer ${clientSha1}`;

export const APIServices = {
  authUrl: url,
  apiUrlV1: `${url}/v1`,
  clientId,
  // using this header after login
  axiosConfig: () => {
    const accessToken = `Bearer ${store?.state?.getState()?.auth?.accessToken}`;
    // config with axios global
    axios.defaults.baseURL = `${url}/v1`;
    axios.defaults.headers.common.Authorization = accessToken;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.headers.post['Content-Type'] =
      'application/x-www-form-urlencoded';
    axios.defaults.headers.common['x-language'] = 'en|km';
  },

  // use this header configuration for client side.
  axiosClientConfig: () => {
    axios.defaults.baseURL = `${url}/v1`;
    const token = store?.state?.getState()?.auth?.publicToken;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    axios.defaults.headers.common['x-language'] = getLanguage();
  },

  // using this header to get authorization token
  authorizeHeader: () => {
    return {
      'Content-Type': 'application/json',
      Authorization,
    };
  },

  // using this header for login
  authenticationHeader: () => {
    const token = store?.state?.getState()?.auth?.authToken;

    return {
      'Content-Type': 'application/json',
      token: `Bearer ${token}`,
    };
  },

  // using this header for forgot and reset password
  authenticationHeaderForgotPwd: () => {
    const token = store?.state?.getState()?.auth?.authToken;

    return {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    };
  },

  // using this header when user not yet authorize (not yet login)
  publicHeader: () => {
    const token = store?.state?.getState()?.auth?.publicToken;

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-language': getLanguage(),
    };
  },

  // source
  axiosCancelToken: () => {
    // return axios.CancelToken.source().cancel();
  },

  // set extra missing headers.
  setAxiosHeaders(headers: IExtraAxiosHeader[]) {
    headers.forEach((h) => {
      axios.defaults.headers.common[h?.key] = h?.value;
    });
  },
};
