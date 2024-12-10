import { defineConfig } from 'vite';
import { resolve } from 'path';

import react from '@vitejs/plugin-react-swc';

const root = resolve(__dirname, "src");

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': resolve(root, "./src"),
    },
  }
})
