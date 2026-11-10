import { build } from 'esbuild';

await build({
  entryPoints: ['src/effects.jsx', 'src/specular-buttons.jsx', 'src/customer-stories.jsx'],
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

// Isolated, lazy-loaded team scene; no 3D code on the home or customer pages.
await build({
  entryPoints: ['src/team-lanyards.jsx'],
  bundle: true,
  minify: true,
  format: 'esm',
  jsx: 'automatic',
  target: ['es2020'],
  outdir: 'dist/assets',
  loader: { '.glb': 'file', '.png': 'file' },
  assetNames: '[name]-[hash]',
  publicPath: '/assets',
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'linked',
  logLevel: 'info'
});
