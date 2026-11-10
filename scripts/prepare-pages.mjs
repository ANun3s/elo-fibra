import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function normalizeBase(value = '/') {
  if (!/^\/(?:[a-zA-Z0-9._~-]+\/)*$/.test(value)) {
    throw new Error('Base path must start and end with / and contain only URL-safe path segments.');
  }
  return value;
}

export function rewritePaths(text, extension, base) {
  const prefix = url => url.startsWith('/') && !url.startsWith('//') ? base + url.slice(1) : url;
  if (extension === '.html') {
    return text.replace(/\b(href|src|poster|action)=(['"])(.*?)\2/g, (_, attr, quote, url) => `${attr}=${quote}${prefix(url)}${quote}`)
      .replace(/\bsrcset=(['"])(.*?)\1/g, (_, quote, list) => `srcset=${quote}${list.replace(/(^|,\s*)(\/[^\s,]+)/g, (match, separator, url) => separator + prefix(url))}${quote}`);
  }
  if (extension === '.css') {
    return text.replace(/url\((['"]?)(\/[^)'"\s]*)\1\)/g, (_, quote, url) => `url(${quote}${prefix(url)}${quote})`);
  }
  // Runtime asset URLs and known site routes; leave slash literals and external URLs alone.
  if (extension === '.js') {
    return text.replace(/(['"`])(\/(?:assets\/|servicos\/|clientes\/|planos\/)[^'"`\s]*)\1/g, (_, quote, url) => `${quote}${prefix(url)}${quote}`);
  }
  return text;
}

export async function preparePages(base = '/') {
  base = normalizeBase(base);
  const source = path.resolve('dist');
  const destination = path.resolve('_site');
  // Always start from dist: repeated runs cannot double-prefix published URLs.
  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  await cp(source, destination, { recursive: true });
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(file);
      else if (['.html', '.css', '.js'].includes(path.extname(file))) {
        await writeFile(file, rewritePaths(await readFile(file, 'utf8'), path.extname(file), base));
      }
    }
  }
  await visit(destination);
  await writeFile(path.join(destination, '.nojekyll'), '');
  console.log(`GitHub Pages artifact prepared in _site with base ${base}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await preparePages(process.env.PAGES_BASE_PATH || '/');
}
