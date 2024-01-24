import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import topLevelAwait from 'vite-plugin-top-level-await';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';
const packageJson = require('./package.json');
const { dependencies, name } = packageJson;

delete dependencies['@emotion/styled'];
delete dependencies['@mui/material'];
delete dependencies['@mui/styles'];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name,
      filename: 'remoteEntry.js',
      exposes: {
        './config': './npwd.config.ts',
      },
      shared: ['react', 'react-dom', '@emotion/react', 'react-router-dom', 'jotai'],
    }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`,
    }),
  ],
  resolve: {
    alias: {
      '@hooks': path.resolve(__dirname, './src/hooks/'),
      '@components': path.resolve(__dirname, './src/components/'),
      '@ui': path.resolve(__dirname, './src/components/ui/'),
      '@utils': path.resolve(__dirname, './src/utils/'),
      '@typings': path.resolve(__dirname, '../typings/'),
      src: path.resolve(__dirname, './src/'),
      '@locales': path.resolve(__dirname, '../locales/'),
      '@data': path.resolve(__dirname, './src/data/'),
      '@shared': path.resolve(__dirname, '../shared'),
      'npwd.config': path.resolve(__dirname, './npwd.config.ts'),
    },
  },
  base: './',
  define: {
    process: {
      env: {
        VITE_REACT_APP_IN_GAME: process.env.VITE_REACT_APP_IN_GAME,
      },
    },
  },
  server: {
    port: 3002,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    modulePreload: false,
    assetsDir: '',
  },
});
