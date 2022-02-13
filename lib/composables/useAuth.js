import { ref } from 'vue';
import axios from 'axios';
/**
 * useAuth compositable functions
 * @see https://v3.vuejs.org/guide/composition-api-introduction.html
 * @return { login: Function, logout: Function, refresh: Function, isAuth: Ref<boolean>, isLoading: Ref<boolean>, error: Ref<any> }
 */
export default function useAuth() {
    var isAuth = ref(false);
    var isLoading = ref(false);
    var error = ref(null);
    /**
     * Login function
     * @param data: T
     * @param url: string
     * @param remember?: boolean
     * @param tokenKey?: string
     * @param storageKey?: string
     * @param authorizationScheme?: string
     * @return Promise<AxiosResponse<U, any>>
     */
    function login(data, url, remember, tokenKey, storageKey, authorizationScheme) {
        if (remember === void 0) { remember = false; }
        if (tokenKey === void 0) { tokenKey = 'token'; }
        if (storageKey === void 0) { storageKey = 'token'; }
        if (authorizationScheme === void 0) { authorizationScheme = 'Bearer '; }
        isLoading.value = true;
        error.value = null;
        return axios.post(url, { method: 'POST', data: data })
            .then(function (response) {
            axios.defaults.headers.common['Authorization'] = authorizationScheme + response.data[tokenKey];
            remember
                ? localStorage.setItem(storageKey, response.data[tokenKey])
                : sessionStorage.setItem(storageKey, response.data[tokenKey]);
            isAuth.value = true;
            return response;
        })
            .catch(function (response) {
            error.value = response.response;
            logout();
            return response;
        })
            .finally(function () { return isLoading.value = false; });
    }
    /**
     * Register function
     * @param data: string
     * @param url: string
     * @return Promise<AxiosResponse<U, any>>
     */
    function register(data, url) {
        isLoading.value = true;
        error.value = null;
        return axios.post(url, { method: 'POST', data: data })
            .then(function (response) { return response; })
            .catch(function (response) {
            error.value = response.response;
            logout();
            return response;
        })
            .finally(function () { return isLoading.value = false; });
    }
    /**
     * Refresh token function
     * @param url: string
     * @param tokenKey?: string
     * @param storageKey?: string
     * @param authorizationScheme?: string
     * @return Promise<AxiosResponse<T, any>>
     */
    function refresh(url, tokenKey, storageKey, authorizationScheme) {
        if (tokenKey === void 0) { tokenKey = 'token'; }
        if (storageKey === void 0) { storageKey = 'token'; }
        if (authorizationScheme === void 0) { authorizationScheme = 'Bearer '; }
        isLoading.value = true;
        error.value = null;
        var remember = false;
        if (localStorage.getItem(storageKey)) {
            remember = true;
            axios.defaults.headers.common['Authorization'] = authorizationScheme + localStorage.getItem(storageKey);
        }
        else
            axios.defaults.headers.common['Authorization'] = authorizationScheme + sessionStorage.getItem(storageKey);
        return axios.get(url)
            .then(function (response) {
            axios.defaults.headers.common['Authorization'] = authorizationScheme + response.data[tokenKey];
            remember
                ? localStorage.setItem(storageKey, response.data[tokenKey])
                : sessionStorage.setItem(storageKey, response.data[tokenKey]);
            isAuth.value = true;
            return response;
        })
            .catch(function (response) {
            logout();
            return response;
        })
            .finally(function () { return isLoading.value = false; });
    }
    /**
     * Logout function
     * @param storageKey?: string
     * @return void
     */
    function logout(storageKey) {
        if (storageKey === void 0) { storageKey = 'token'; }
        axios.defaults.headers.common['Authorization'] = null;
        localStorage.removeItem(storageKey);
        sessionStorage.removeItem(storageKey);
        isAuth.value = false;
    }
    return {
        login: login,
        register: register,
        refresh: refresh,
        logout: logout,
        isAuth: isAuth,
        isLoading: isLoading,
        error: error
    };
}
