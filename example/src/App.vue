<template>
    <input v-model="form.email" type="email" placeholder="Email" />
    <input v-model="form.password" type="password" placeholder="password" />

    <button @click="signin">Sign in</button>
    <button @click="signup">Sign up</button>
    <button @click="logout()">Logout</button>

    Loading: {{ isLoading }}
    Authenticate: {{ isAuth }}

    <div v-if="error">{{ error.data }}</div>
</template>

<script setup>
import { reactive } from 'vue'
// import useAuth from 'use-auth'
import useAuth from '../../src/composables/useAuth'
import axios from 'axios'

const form = reactive({
    email: '',
    password: '',
    remember: true
})

const { login, register, refresh, logout, init, isLoading, isAuth, error } = useAuth();

// Set the base API url with axios
axios.defaults.baseURL = 'http://localhost:3001'
// or
// init({
//     axiosInstance: axios.create({ baseURL: 'http://localhost:3001', /*headers: {'X-Custom-Header': 'foobar'}*/ })
//     tokenKey: 'token',
//     storageKey: 'token',
//     authorizationScheme: 'Bearer'
// });

// Refresh token
refresh('/auth/refresh')
    .then(console.log)
    .catch(console.log)

async function signin() {
    await login('/auth/login', form)
    // await getUser()
}

async function signup() {
    await register('/auth/register', form)
}
</script>

<!--With typescript-->
<!--<script setup lang="ts">
import { reactive } from 'vue'
import useAuth from '../lib'
import axios from 'axios'

const form = reactive({
    email: '',
    password: '',
    remember: false
})

const { login, register, refresh, logout, init, isLoading, isAuth, error } = useAuth();

// Set the base API url with axios
// axios.defaults.baseURL = 'http://localhost:3001'
// or
init({
    axiosInstance: axios.create({ baseURL: 'http://localhost:3001', /*headers: {'X-Custom-Header': 'foobar'}*/ })
    // tokenKey: 'token',
    // storageKey: 'token',
    // authorizationScheme: 'Bearer'
});

// Types example
type FormData = { email: string, password: string, remember?: boolean }
type LoginResponse = { token?: string, error?: string }

// Refresh token
(async () => await refresh('/auth/refresh'))()

async function signin() {
    await login<FormData, LoginResponse>('/auth/login', form)
    // await getUser()
}

async function signup() {
    await register<FormData>('/auth/register', form)
}
</script>-->

