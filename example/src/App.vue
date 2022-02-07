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
import useAuth from 'use-auth'
import axios from 'axios'

const form = reactive({
    email: '',
    password: '',
    remember: true
})

// Base url with axios
axios.defaults.baseURL = 'http://localhost:3001'

const { login, register, refresh, logout, isLoading, isAuth, error } = useAuth();

// Refresh token
refresh('/auth/refresh')
    .then(console.log)
    .catch(console.log)

async function signin() {
    await login(form, '/auth/login', form.remember)
    // await getUser()
}

async function signup() {
    await register(form, '/auth/register')
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

// Base url with axios
axios.defaults.baseURL = 'http://localhost:3001'

// Types example
type FormData = { email: string, password: string, remember?: boolean }
type LoginResponse = { token?: string, error?: string }

const { login, register, refresh, logout, isLoading, isAuth, error } = useAuth();

// Refresh token
(async () => await refresh('/auth/refresh'))()

async function signin() {
    await login<FormData, LoginResponse>(form, '/auth/login', form.remember)
    // await getUser()
}

async function signup() {
    await register<FormData>(form, '/auth/register')
}
</script>-->

