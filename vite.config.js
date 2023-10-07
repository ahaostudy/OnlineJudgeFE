import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import { Config } from './config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ArcoResolver()],
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true
        })
      ]
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 9009,
    proxy: {
      '/api': {
        target: Config.BASE_HOST + Config.BASE_URI,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
  }
})
