import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    glsl({
      include: ['**/*.glsl', '**/*.vert', '**/*.frag'],
      defaultExtension: 'glsl',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // better alias
    },
  },
  build: {
    outDir: 'dist', // Vercel expects this
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
});
