const esbuild = require('esbuild');
const { esbuildDecorators } = require('@anatine/esbuild-decorators');

esbuild
  .build({
    entryPoints: ['server/server.ts'],
    bundle: true,
    platform: 'node',
    target: 'node16',
    outfile: 'dist/server.js',
    plugins: [
      esbuildDecorators({
        tsconfig: 'server/tsconfig.json',
      }),
    ],
  })
  .catch(() => process.exit(1));
