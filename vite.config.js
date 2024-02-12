/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react';
import alias from 'alias-reuse';
import { defineConfig } from 'vite';
import checkerPlugin from 'vite-plugin-checker';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    checkerPlugin({
      typescript: true,
    }),
    viteStaticCopy({
      targets: [{
        src: 'assets',
        dest: '',
      }],
    }),
  ],
  root: './src',
  base: '',
  build: {
    target: 'esnext',
    outDir: '../dist',
    emptyOutDir: true,
    assetsDir: '',
  },
  server: {
    port: 9999,
  },
  define: {
    ENV_MODE: JSON.stringify(mode),
  },
  resolve: {
    alias: alias
      .fromFile(__dirname, './tsconfig.json')
      .toVite(),
  },
}));
