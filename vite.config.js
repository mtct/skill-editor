import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/skill-editor/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          codemirror: [
            '@codemirror/view',
            '@codemirror/state',
            '@codemirror/commands',
            '@codemirror/language',
            '@codemirror/lang-markdown',
            '@codemirror/lang-yaml',
            '@codemirror/lang-python',
            '@codemirror/lang-javascript',
          ],
          vendor: ['jszip', 'js-yaml'],
        },
      },
    },
  },
})
