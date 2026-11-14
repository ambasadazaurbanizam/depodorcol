// Offline component-level regression checks; no browser or SMTP connection.
import { createRequire } from 'node:module';
import { mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
// Wrangler already supplies esbuild in the locked dependency graph.
const { build } = createRequire(import.meta.resolve('wrangler'))('esbuild');
const output = 'work/museum-regression.mjs';
await mkdir('work', { recursive: true });
try {
  await build({
    entryPoints: ['tests/museum-pages.tsx'],
    outfile: output,
    bundle: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    jsx: 'automatic',
    loader: { '.css': 'empty' },
    alias: {
      '@': process.cwd(),
      'next/link': resolve('node_modules/vinext/dist/shims/link.js'),
      'next/navigation': resolve(
        'node_modules/vinext/dist/shims/navigation.js',
      ),
      'next/server': resolve('node_modules/vinext/dist/shims/server.js'),
    },
    plugins: [
      {
        name: 'forbid-smtp',
        setup(builder) {
          builder.onResolve({ filter: /^nodemailer$/ }, () => ({
            path: 'mail',
            namespace: 'offline',
          }));
          builder.onLoad({ filter: /.*/, namespace: 'offline' }, () => ({
            contents:
              'export default { createTransport(){ throw new Error("SMTP access is forbidden in offline tests") } }',
            loader: 'js',
          }));
        },
      },
    ],
  });
  process.env.SMTP_PASS = '';
  process.env.RESEND_API_KEY = '';
  await import(`./${output}`);
} finally {
  await rm(output, { force: true });
}
