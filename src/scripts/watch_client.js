const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['client/client.ts'],
    bundle: true,
    loader: { '.ts': 'ts' },
    minify: true,
    outfile: 'dist/client.js',
    watch: {
      onRebuild(error) {
        if (error) console.error('[CLIENT] watch build failed:', error);
        else console.log('[CLIENT] watch build succeeded.');
      },
    },
  })
  .then(() => {
    console.log('Watching client');
  });
