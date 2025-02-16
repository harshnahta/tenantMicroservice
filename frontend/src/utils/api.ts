/** @format */

import axios from 'axios';
//const CancelToken = axios.CancelToken;
//const source = CancelToken.source();

import { getCookie } from './utility';

const axiosAuthInstance = axios.create({
  baseURL: process.env.API_ENDPOINT,
});

const axiosAuthClientInstance = axios.create({
  baseURL: '/api/auth',
});

const axiosProductInstance = axios.create({
  baseURL: process.env.PRODUCT_API_ENDPOINT,
});

const axiosProductClientInstance = axios.create({
  baseURL: '/api/product',
});

const axiosInstance = {
  auth: axiosAuthInstance,
  product: axiosProductInstance,
};

const axiosClientInstance = {
  auth: axiosAuthClientInstance,
  product: axiosProductClientInstance,
};

export const api = async (
  options: any,
  isClient: boolean = false,
  tokenServer = null,
  instanceType = 'auth'
) => {
  let token = null;

  if (!options.headers) options.headers = {};
  if (!options.method) options.method = 'POST';
  if (tokenServer) {
    options.headers.Authorization = `Bearer ${tokenServer}`;
  } else {
    token = getCookie('jwt');
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }
  }

  options.headers = {
    ...options.headers,
  };
  //options.url = API_HOST + options.url;
  //options.cancelToken = source.token;

  try {
    const res = isClient
      ? await axiosClientInstance[
          instanceType as keyof typeof axiosClientInstance
        ](options)
      : await axiosInstance[instanceType as keyof typeof axiosInstance](
          options
        );

    return res.data;
  } catch (err: any) {
    if (err?.response?.status === 401 && isClient) {
      let now = new Date();
      let time = now.getTime();
      const secondsUntilEndOfMinute = 0;
      let expireTime = time + 0 * secondsUntilEndOfMinute;
      now.setTime(expireTime);
      document.cookie = `user=;expires=${now.toUTCString()};path=/`;
      document.cookie = `jwt=;expires=${now.toUTCString()};path=/`;
      window.location.reload();
      throw err;
    } else if (
      err?.response?.status === 409 ||
      err?.response?.status === 422 ||
      err?.response?.status === 402
    ) {
      return err;
    } else {
      if (axios.isCancel(err)) {
        return { cancelled: true };
      } else {
        return err;
      }
    }
  }
};

export const getTokenFromCookie = async (cookies: any) => {
  try {
    let data = null;
    if (typeof cookies === 'string' && cookies.length > 1) {
      data = parseCookie(cookies);
    }
    return data && data.token ? data.token : null;
  } catch (e) {
    return null;
  }
};

const parseCookie = (str: string) =>
  str
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc: any, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
