import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'test' ? [] : [tailwindcss()])],
  server: { host: 'localhost', port: 3000 },
  build: { sourcemap: false },
  test: {
    globals: true,
    environment: 'jsdom',
    css: false,
    pool: 'forks',
    include: ['src/**/*.{test,spec}.{js,jsx}']
  }
}));


