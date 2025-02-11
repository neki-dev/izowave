import path from 'path';

import { reuse } from 'alias-reuse';
import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const tsconfig = path.resolve(__dirname, 'tsconfig.json');

export default defineConfig({
  plugins: [
    checker({
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
  resolve: {
    alias: reuse()
      .from(tsconfig)
      .for('vite'),
  },
});
