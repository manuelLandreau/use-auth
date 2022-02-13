import { AxiosResponse } from 'axios';
/**
 * useAuth compositable functions
 * @see https://v3.vuejs.org/guide/composition-api-introduction.html
 * @return { login: Function, logout: Function, refresh: Function, isAuth: Ref<boolean>, isLoading: Ref<boolean>, error: Ref<any> }
 */
export default function useAuth(): {
    login: <T, U>(data: T, url: string, remember?: boolean, tokenKey?: string, storageKey?: string, authorizationScheme?: string) => Promise<AxiosResponse<U, any>>;
    register: <T_1, U_1>(data: T_1, url: string) => Promise<AxiosResponse<U_1, any>>;
    refresh: <T_2>(url: any, tokenKey?: string, storageKey?: string, authorizationScheme?: string) => Promise<AxiosResponse<T_2, any>>;
    logout: (storageKey?: string) => void;
    isAuth: import("vue").Ref<boolean>;
    isLoading: import("vue").Ref<boolean>;
    error: any;
};
