import { computed, ref } from 'vue'
import axios, { AxiosResponse, AxiosStatic } from 'axios'

type Options = {
    axiosInstance: AxiosStatic
    tokenKey: string
    storageKey: string
    authorizationScheme: string
}

// Auth state
const isAuth = ref(false)
const isLoading = ref(false)
const error = ref(null)

/**
 * useAuth compositable functions
 * @see https://v3.vuejs.org/guide/composition-api-introduction.html
 * @return { login: Function, logout: Function, refresh: Function, init: Function,
 *           isAuth: Ref<boolean>, isLoading: Ref<boolean>, error: Ref<any> }
 */
export default function useAuth() {
    let options: Options = {
        axiosInstance: axios,
        tokenKey: 'token',
        storageKey: 'token',
        authorizationScheme: 'Bearer'
    }

    function init(opts: Options): Options {
        options = {...options, ...opts}
        return options
    }

    /**
     * Login function
     * @param url: string
     * @param data: T
     * @return Promise<AxiosResponse<U, any>>
     */
    function login<T, U>(url: string, data: T & { remember: true }): Promise<AxiosResponse<U>> {
        isLoading.value = true
        error.value = null

        return options.axiosInstance.post<U>(url, { method: 'POST', data })
            .then((response: { data: U | any }) => {
                options.axiosInstance.defaults.headers.common['Authorization'] =
                    options.authorizationScheme + ' ' + response.data[options.tokenKey]
                data.remember
                    ? localStorage.setItem(options.storageKey, response.data[options.tokenKey])
                    : sessionStorage.setItem(options.storageKey, response.data[options.tokenKey])
                isAuth.value = true
                return response
            })
            .catch(e => {
                error.value = e.response
                logout()
                return e
            })
            .finally(() => isLoading.value = false)
    }

    /**
     * Register function
     * @param url: string
     * @param data: string
     * @return Promise<AxiosResponse<U, any>>
     */
    function register<T, U>(url: string, data: T): Promise<AxiosResponse<U>> {
        isLoading.value = true
        error.value = null

        return options.axiosInstance.post<U>(url, { method: 'POST', data })
            .then((response: { data: U }) => response)
            .catch(response => {
                error.value = response.response
                logout()
                return response
            })
            .finally(() => isLoading.value = false)
    }

    /**
     * Refresh token function
     * @param url: string
     * @return Promise<AxiosResponse<T, any>>
     */
    function refresh<T>(url: string): Promise<AxiosResponse<T>> {
        isLoading.value = true
        error.value = null
        let remember = false

        if (localStorage.getItem(options.storageKey)) {
            remember = true
            options.axiosInstance.defaults.headers.common['Authorization'] =
                options.authorizationScheme + ' ' + localStorage.getItem(options.storageKey)
        } else
            options.axiosInstance.defaults.headers.common['Authorization'] =
                options.authorizationScheme + ' ' + sessionStorage.getItem(options.storageKey)

        return options.axiosInstance.get<T>(url)
            .then((response: { data: T | any }) => {
                options.axiosInstance.defaults.headers.common['Authorization'] =
                    options.authorizationScheme + response.data[options.tokenKey]
                remember
                    ? localStorage.setItem(options.storageKey, response.data[options.tokenKey])
                    : sessionStorage.setItem(options.storageKey, response.data[options.tokenKey])
                isAuth.value = true
                return response
            })
            .catch(response => {
                logout()
                return response
            })
            .finally(() => isLoading.value = false)
    }

    /**
     * Logout function
     * @return void
     */
    function logout(): void {
        options.axiosInstance.defaults.headers.common['Authorization'] = false
        localStorage.removeItem(options.storageKey)
        sessionStorage.removeItem(options.storageKey)
        isAuth.value = false
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
    }
}
