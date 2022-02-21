# useAuth()
[![Node.js CI](https://github.com/manuelLandreau/use-auth/actions/workflows/test.yml/badge.svg)](https://github.com/manuelLandreau/use-auth/actions/workflows/test.yml)
---
#### Just simple authentication **composable** functions for Vue 3

- API agnostic (JWT(ish))
- No store needed, **isAuth, isLoading** and **error** "state" variables are shared between components
- Written in Typescript
- It uses Axios

**Minimum requirement : [Vue 3.2](https://v3.vuejs.org/guide/introduction.html)** (Vue 2 + Composable API not tested)

---
## Get started
### Installation
```
npm install manuellandreau/use-auth
# or
yarn add manuellandreau/use-auth
```
### How to use

```vue
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

const { login, register, refresh, logout, init, isLoading, isAuth, error } = useAuth();

// Set the base API url with axios
axios.defaults.baseURL = 'http://your-api-base-url'
// or
// init({
//     axiosInstance: axios.create({ baseURL: 'http://your-api-base-url', /*headers: {'X-Custom-Header': 'foobar'}*/ })
//     tokenKey: 'token',
//     storageKey: 'token',
//     authorizationScheme: 'Bearer'
// })

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
```

#### With typescrypt
```vue
<script setup lang="ts">
import { reactive } from 'vue'
import useAuth from 'use-auth'
import axios from 'axios'

const form = reactive({
    email: '',
    password: '',
    remember: false
})

const { login, register, refresh, logout, init, isLoading, isAuth, error } = useAuth();

// Set the base API url with axios
axios.defaults.baseURL = 'http://your-api-base-url'
// or
// init({
//     axiosInstance: axios.create({ baseURL: 'http://your-api-base-url', /*headers: {'X-Custom-Header': 'foobar'}*/ })
//     tokenKey: 'token',
//     storageKey: 'token',
//     authorizationScheme: 'Bearer'
// })

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
</script>
```

## Parameters
| Function | Parameters                                                                                                                            | Default                                                     | Return                  |
|----------|---------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------|-------------------------|
| init     | axiosInstance<br/>tokenKey: string (token response key)<br/>storageKey (key name in local or session storage)<br/>authorizationScheme | Global axios instance<br/>'token'<br/>'token'<br/>'Bearer ' | Promise<AxiosResponse>  |
| login    | url: string (POST endpoint url)<br/>data: object                                                                                      | **required**<br/>**required**                               | Promise<AxiosResponse>  |
| register | url: string (POST endpoint url)<br/>data: object                                                                                      | **required**<br/>**required**                               | Promise<AxiosResponse>  |
| refresh  | url: string                                                                                                                           | **required**                                                | Promise<AxiosResponse>  |
| logout   |                                                                                                                                       |                                                             | void                    |

## More 

See [Vue 3 API composition](https://v3.vuejs.org/guide/composition-api-introduction.html) and [axios](https://axios-http.com/docs/intro) documentations

## Development

Require node >14

Tests with Jest (npm test)
Build with Vite (npm run build)

## Contributing

Contributions, issues and feature requests are welcome!
Feel free to check issues page.

