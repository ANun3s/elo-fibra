import { build } from 'esbuild';

await build({
  entryPoints: ['src/effects.jsx'],
  bundle: true,
  minify: true,
  format: 'esm',
  jsx: 'automatic',
  target: ['es2020'],
  outfile: 'dist/assets/effects.js',
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'linked',
  logLevel: 'info'
});
