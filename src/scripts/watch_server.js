const esbuild = require('esbuild');
const { esbuildDecorators } = require('@anatine/esbuild-decorators');

esbuild
  .build({
    entryPoints: ['server/server.ts'],
    bundle: true,
    watch: {
      onRebuild(error, result) {
        if (error) console.error('watch build failed:', error);
        else console.log('watch build succeeded:');
      },
    },
    platform: 'node',
    target: 'node16',
    outfile: 'dist/server.js',
    define: {
      'process.env.NODE_ENV': '"mocking"', // Mocking is value that's checked for mocking globals etc when running the server outside FiveM
    },
    plugins: [
      esbuildDecorators({
        tsconfig: 'server/tsconfig.json',
      }),
    ],
  })
  .then((result) => {
    console.log('Watching server');
  });
