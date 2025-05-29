import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src', // если твои исходники в папке src
  build: {
    outDir: '../dist', // чтобы сборка шла в dist, как раньше
    emptyOutDir: true,
  },
  server: {
    port: 9000,
    open: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
})
