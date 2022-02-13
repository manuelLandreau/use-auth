import { ref } from 'vue'
import axios, { AxiosResponse } from 'axios'

/**
 * useAuth compositable functions
 * @see https://v3.vuejs.org/guide/composition-api-introduction.html
 * @return { login: Function, logout: Function, refresh: Function, isAuth: Ref<boolean>, isLoading: Ref<boolean>, error: Ref<any> }
 */
export default function useAuth() {
    const isAuth = ref(false)
    const isLoading = ref(false)
    const error = ref(null)

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
    function login<T, U>(
        data: T,
        url: string,
        remember: boolean = false,
        tokenKey: string = 'token',
        storageKey: string = 'token',
        authorizationScheme = 'Bearer '
    ): Promise<AxiosResponse<U, any>> {
        isLoading.value = true
        error.value = null

        return axios.post<U>(url, { method: 'POST', data })
            .then((response: { data: U }) => {
                axios.defaults.headers.common['Authorization'] = authorizationScheme + response.data[tokenKey]
                remember
                    ? localStorage.setItem(storageKey, response.data[tokenKey])
                    : sessionStorage.setItem(storageKey, response.data[tokenKey])
                isAuth.value = true
                return response
            })
            .catch(response => {
                error.value = response.response
                logout()
                return response
            })
            .finally(() => isLoading.value = false)
    }

    /**
     * Register function
     * @param data: string
     * @param url: string
     * @return Promise<AxiosResponse<U, any>>
     */
    function register<T, U>(data: T, url: string): Promise<AxiosResponse<U, any>> {
        isLoading.value = true
        error.value = null

        return axios.post<U>(url, { method: 'POST', data })
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
     * @param tokenKey?: string
     * @param storageKey?: string
     * @param authorizationScheme?: string
     * @return Promise<AxiosResponse<T, any>>
     */
    function refresh<T>(
        url, tokenKey: string = 'token',
        storageKey: string = 'token',
        authorizationScheme = 'Bearer '
    ): Promise<AxiosResponse<T, any>> {
        isLoading.value = true
        error.value = null
        let remember = false

        if (localStorage.getItem(storageKey)) {
            remember = true
            axios.defaults.headers.common['Authorization'] = authorizationScheme + localStorage.getItem(storageKey)
        } else axios.defaults.headers.common['Authorization'] = authorizationScheme + sessionStorage.getItem(storageKey)

        return axios.get<T>(url)
            .then((response: { data: T }) => {
                axios.defaults.headers.common['Authorization'] = authorizationScheme + response.data[tokenKey]
                remember
                    ? localStorage.setItem(storageKey, response.data[tokenKey])
                    : sessionStorage.setItem(storageKey, response.data[tokenKey])
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
     * @param storageKey?: string
     * @return void
     */
    function logout(storageKey: string = 'token'): void {
        axios.defaults.headers.common['Authorization'] = null
        localStorage.removeItem(storageKey)
        sessionStorage.removeItem(storageKey)
        isAuth.value = false
    }

    return {
        login,
        register,
        refresh,
        logout,
        isAuth,
        isLoading,
        error
    }
}
