/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react';
import alias from 'alias-reuse';
import { defineConfig } from 'vite';
import checkerPlugin from 'vite-plugin-checker';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import zipPackPlugin from 'vite-plugin-zip-pack';

import pkg from './package.json';

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
    (mode !== 'development') && zipPackPlugin({
      inDir: 'dist',
      outDir: 'dist',
      outFileName: `${pkg.name}-${pkg.version}-${mode}.zip`,
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
    PLATFORM: JSON.stringify(mode),
  },
  resolve: {
    alias: alias
      .fromFile(__dirname, './tsconfig.json')
      .toVite(),
  },
}));
