const path = require('path')
import vue from '@vitejs/plugin-vue'
const { defineConfig } = require('vite')

module.exports = defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'useAuth',
            fileName: (format) => `use-auth.${format}.js`
        },
        rollupOptions: {
            external: ['vue', 'axios'],
            output: {
                globals: {
                    vue: 'Vue',
                    axios: 'axios'
                }
            }
        }
    },
    plugins: [
        vue({
            babel: {
                plugins: [
                    '@babel/plugin-proposal-optional-chaining'
                ],
            },
        })
    ]
})