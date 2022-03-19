const esbuild = require('esbuild');
const { esbuildDecorators } = require('@anatine/esbuild-decorators');

const args = process.argv.slice(2);

const modeArg = args.find((arg) => {
  const [key] = arg.split('=');
  return key === '--mode';
});

const mode = modeArg?.split('=')[1];
const NODE_ENV = mode === 'ingame' ? 'ingame' : 'mocking';

esbuild
  .build({
    entryPoints: ['server/server.ts'],
    bundle: true,
    watch: {
      onRebuild(error) {
        if (error) console.error('watch build failed:', error);
        else console.log('watch build succeeded:');
      },
    },
    platform: 'node',
    target: 'node16',
    outfile: 'dist/server.js',
    define: {
      'process.env.NODE_ENV': `"${NODE_ENV}"`, // Mocking is value that's checked for mocking globals etc when running the server outside FiveM
    },
    plugins: [
      esbuildDecorators({
        tsconfig: 'server/tsconfig.json',
      }),
    ],
  })
  .then(() => {
    console.log('Watching server');
  });
