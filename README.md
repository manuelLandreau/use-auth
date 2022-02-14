# useAuth()
[![](https://img.shields.io/github/workflow/status/manuellandreau/use-auth/test/main)](https://github.com/manuellandreau/use-auth/actions/workflows/test.yml)
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
// import axios from 'axios'

const form = reactive({
    email: '',
    password: '',
    remember: true
})

// Base url with axios
// axios.defaults.baseURL = 'http://localhost...'

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
```

#### With typescrypt
```vue
<script setup lang="ts">
import { reactive } from 'vue'
import useAuth from 'use-auth'
// import axios from 'axios'

const form = reactive({
    email: '',
    password: '',
    remember: false
})

// Base url with axios
// axios.defaults.baseURL = 'http://localhost...'

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
</script>
```

## Parameters
| Function  | Parameters                                                                                                                                                                                                                           | Default                                                                       | Return                  |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|-------------------------|
| login     | data: object<br/>url: string (POST endpoint url)<br/>remember: boolean (persist in session or local storage)<br/>tokenKey: string (token response key)<br/>storageKey (key name in local or session storage)<br/>authorizationScheme | **required**<br/>**required**<br/>false<br/>'token'<br/>'token'<br/>'Bearer ' | Promise<AxiosResponse>  |
| register  | data: object<br/>url: string (POST endpoint url)                                                                                                                                                                                     | **required**<br/>**required**                                                 | Promise<AxiosResponse>  |
| refresh   | url: string<br/>authorizationScheme                                                                                                                                                                                                  | **required**<br/>'Bearer '                                                    | Promise<AxiosResponse>  |
| logout    |                                                                                                                                                                                                                                      |                                                                               | void                    |

## More 

See [Vue 3 API composition](https://v3.vuejs.org/guide/composition-api-introduction.html) and [axios](https://axios-http.com/docs/intro) documentations

## Todo
- [ ] Fetch user function
- [ ] use fetch API ?
- [ ] 0auth ?

## Contributing

Contributions, issues and feature requests are welcome!
Feel free to check issues page.

