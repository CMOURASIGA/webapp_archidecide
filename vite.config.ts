
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Injeta a variável de ambiente da Vercel para dentro do código do navegador
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
