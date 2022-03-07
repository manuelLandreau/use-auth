var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
import { ref } from "vue";
import axios from "axios";
const isAuth = ref(false);
const isLoading = ref(false);
const error = ref(null);
function useAuth() {
  let options = {
    axiosInstance: axios,
    tokenKey: "token",
    storageKey: "token",
    authorizationScheme: "Bearer"
  };
  function init(opts) {
    options = __spreadValues(__spreadValues({}, options), opts);
    return options;
  }
  function login(url, data) {
    isLoading.value = true;
    error.value = null;
    return options.axiosInstance.post(url, { method: "POST", data }).then((response) => {
      options.axiosInstance.defaults.headers.common["Authorization"] = options.authorizationScheme + " " + response.data[options.tokenKey];
      data.remember ? localStorage.setItem(options.storageKey, response.data[options.tokenKey]) : sessionStorage.setItem(options.storageKey, response.data[options.tokenKey]);
      isAuth.value = true;
      return response;
    }).catch((e) => {
      error.value = e.response;
      logout();
      return e;
    }).finally(() => isLoading.value = false);
  }
  function register(url, data) {
    isLoading.value = true;
    error.value = null;
    return options.axiosInstance.post(url, { method: "POST", data }).then((response) => response).catch((response) => {
      error.value = response.response;
      logout();
      return response;
    }).finally(() => isLoading.value = false);
  }
  function refresh(url) {
    isLoading.value = true;
    error.value = null;
    let remember = false;
    if (localStorage.getItem(options.storageKey)) {
      remember = true;
      options.axiosInstance.defaults.headers.common["Authorization"] = options.authorizationScheme + " " + localStorage.getItem(options.storageKey);
    } else
      options.axiosInstance.defaults.headers.common["Authorization"] = options.authorizationScheme + " " + sessionStorage.getItem(options.storageKey);
    return options.axiosInstance.get(url).then((response) => {
      options.axiosInstance.defaults.headers.common["Authorization"] = options.authorizationScheme + response.data[options.tokenKey];
      remember ? localStorage.setItem(options.storageKey, response.data[options.tokenKey]) : sessionStorage.setItem(options.storageKey, response.data[options.tokenKey]);
      isAuth.value = true;
      return response;
    }).catch((response) => {
      logout();
      return response;
    }).finally(() => isLoading.value = false);
  }
  function logout() {
    options.axiosInstance.defaults.headers.common["Authorization"] = false;
    localStorage.removeItem(options.storageKey);
    sessionStorage.removeItem(options.storageKey);
    isAuth.value = false;
  }
  return {
    login,
    register,
    refresh,
    logout,
    init,
    isAuth,
    isLoading,
    error
  };
}
export { useAuth as default };
