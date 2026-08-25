import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: 'public',
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  },
  build: {
    rollupOptions: { input: { portfolio: 'index.html', admin: 'admin.html', editor: 'editor.html' } },
    copyPublicDir: true,
  },
})
