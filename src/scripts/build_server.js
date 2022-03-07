const esbuild = require('esbuild');
const { esbuildDecorators } = require('@anatine/esbuild-decorators');

const args = process.argv ?? [];
const mode = args.find((str) => str.startsWith('--mode'))?.split('=')[1];

esbuild
  .build({
    entryPoints: ['server/server.ts'],
    bundle: true,
    platform: 'node',
    target: 'node16',
    outfile: 'dist/server.js',
    define: {
      'process.env.NODE_ENV': `"${mode ?? 'development'}"`,
    },
    plugins: [
      esbuildDecorators({
        tsconfig: 'server/tsconfig.json',
      }),
    ],
  })
  .catch(() => process.exit(1));
