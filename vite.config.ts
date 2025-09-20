import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Layouts from 'vite-plugin-vue-layouts'
import DefineOptions from 'unplugin-vue-define-options/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Pages from 'vite-plugin-pages'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {},
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) =>
            ['ping-connect-wallet', 'ping-token-convert', 'ping-tx-dialog'].includes(tag),
        },
      },
    }),
    vueJsx(),
    Pages({
      dirs: ['./src/modules', './src/pages'],
      exclude: ['**/*.ts'], // hanya load file .vue
    }),
    Layouts({
      layoutsDirs: './src/layouts/',
    }),
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core', '@vueuse/math', 'vue-i18n', 'pinia'],
      vueTemplate: true,
    }),
    VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      include: [fileURLToPath(new URL('./src/plugins/i18n/locales/**', import.meta.url))],
    }),
    DefineOptions(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    entries: ['./src/**/*.vue'],
  },
  // 🔑 Tambahan penting biar refresh / route langsung jalan
  server: {
    host: true,
    port: 5173,
    open: false,
    fs: {
      strict: true,
    },
    historyApiFallback: true, // ⬅️ ini kunci untuk dev server
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  base: '/', // pastikan root base benar (ubah kalau deploy di subfolder)
})
