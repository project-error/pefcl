const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    minify: true,
    target: 'es2015',
    loader: {
      '.tsx': 'tsx',
      '.ts': 'ts',
      '.js': 'js',
      '.jsx': 'jsx',
    },
    outdir: 'build',
  })
  .catch(() => process.exit(1));
