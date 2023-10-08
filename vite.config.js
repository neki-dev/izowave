/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react';
import alias from 'alias-reuse';
import { defineConfig } from 'vite';
import checkerPlugin from 'vite-plugin-checker';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ command }) => ({
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
    IS_DEV_MODE: JSON.stringify(command === 'serve'),
  },
  resolve: {
    alias: alias
      .fromFile(__dirname, './tsconfig.json')
      .toVite(),
  },
}));
