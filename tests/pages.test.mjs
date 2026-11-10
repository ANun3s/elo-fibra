import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { normalizeBase, preparePages, rewritePaths } from '../scripts/prepare-pages.mjs';

test('prefixes local URLs while preserving external URLs and in-page anchors', () => {
  const source = '<a href="/">Home</a><a href="/#planos">Planos</a><a href="#wifi">Wi-Fi</a><img src="//cdn.test/photo.jpg"><img src="https://cdn.test/a.jpg"><img src="/assets/a.png"><img srcset="/assets/a.png 1x, /assets/b.png 2x">';
  const html = rewritePaths(source, '.html', '/elo-fibra/');
  assert.ok(html.includes('href="/elo-fibra/"'));
  assert.ok(html.includes('href="/elo-fibra/#planos"'));
  assert.ok(html.includes('href="#wifi"'));
  assert.ok(html.includes('src="//cdn.test/photo.jpg"'));
  assert.ok(html.includes('src="https://cdn.test/a.jpg"'));
  assert.ok(html.includes('srcset="/elo-fibra/assets/a.png 1x, /elo-fibra/assets/b.png 2x"'));
  assert.equal(rewritePaths(source, '.html', '/'), source);
  assert.equal(rewritePaths('url(/assets/a.png) url(//cdn.test/a.png)', '.css', '/elo-fibra/'), 'url(/elo-fibra/assets/a.png) url(//cdn.test/a.png)');
  assert.equal(rewritePaths('const a="/assets/a.glb",b="/",c="https://x/a";', '.js', '/elo-fibra/'), 'const a="/elo-fibra/assets/a.glb",b="/",c="https://x/a";');
  assert.equal(rewritePaths('const a={href:"/"},b="/";', '.js', '/elo-fibra/'), 'const a={href:"/elo-fibra/"},b="/";');
  assert.equal(rewritePaths('<div data-front="/assets/team/marina.svg" data-back="/assets/team/marina-back.svg"></div>', '.html', '/elo-fibra/'), '<div data-front="/elo-fibra/assets/team/marina.svg" data-back="/elo-fibra/assets/team/marina-back.svg"></div>');
  assert.throws(() => normalizeBase('elo-fibra'));
  assert.throws(() => normalizeBase('//evil/'));
});

test('each generated local link/asset resolves inside the Pages artifact; dist stays intact', async () => {
  const original = await readFile('dist/index.html', 'utf8');
  await preparePages('/elo-fibra/');
  const once = await readFile('_site/index.html', 'utf8');
  await preparePages('/elo-fibra/');
  assert.equal(await readFile('_site/index.html', 'utf8'), once);
  assert.equal(await readFile('dist/index.html', 'utf8'), original);
  await stat('_site/.nojekyll');
  async function visit(dir) {
    for (const entry of await readdir(dir, {withFileTypes:true})) {
      const file = path.join(dir,entry.name);
      if (entry.isDirectory()) { await visit(file); continue; }
      if (!file.endsWith('.html')) continue;
      const html = await readFile(file,'utf8');
      for (const [,url] of html.matchAll(/(?:href|src|data-front|data-back)="([^"]+)"/g)) {
        if (!url.startsWith('/') || url.startsWith('//')) continue;
        assert.ok(url.startsWith('/elo-fibra/'), `${file}: escaped base: ${url}`);
        const local = decodeURIComponent(url.slice('/elo-fibra/'.length).split(/[?#]/)[0]);
        let dest = path.join('_site',local);
        if ((await stat(dest)).isDirectory()) dest=path.join(dest,'index.html');
        assert.ok((await stat(dest)).isFile(), `${file}: missing ${url}`);
      }
    }
  }
  await visit('_site');
});
