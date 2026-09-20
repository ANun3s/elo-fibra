import { build } from 'esbuild';

await build({
  entryPoints: ['src/effects.jsx', 'src/specular-buttons.jsx'],
  bundle: true,
  minify: true,
  format: 'esm',
  jsx: 'automatic',
  target: ['es2020'],
  outdir: 'dist/assets',
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'linked',
  logLevel: 'info'
});
