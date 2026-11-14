import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { renderToStaticMarkup } from 'react-dom/server';
import Depot from '../app/dorcol-depot/page';
import Research from '../app/research/page';
import Source from '../app/research/sources/[id]/page';
import Collection from '../app/collection/page';
import ObjectPage from '../app/collection/[id]/page';
import ExhibitionPage from '../app/exhibitions/[slug]/[locale]/page';
import ExhibitionIndex from '../app/exhibitions/page';
import Home from '../app/page';
import { POST } from '../app/api/contribute/route';
import { museumObjects, museumSources } from '../lib/museum-research';
let checked = 0;
for (const lang of ['sr', 'en', 'ru'] as const) {
  const query = { searchParams: Promise.resolve({ lang }) };
  for (const page of [Depot, Research, Collection, ExhibitionIndex]) {
    const html = renderToStaticMarkup(await page(query));
    assert(html.includes('<h1'));
    assert(html.includes(`lang="${lang}"`));
    assert(!html.includes('undefined'));
    checked++;
  }
  for (const source of museumSources) {
    const html = renderToStaticMarkup(
      await Source({ ...query, params: Promise.resolve({ id: source.id }) }),
    );
    for (const o of museumObjects.filter((o) => o.sourceId === source.id))
      assert(html.includes(`id="pdf-${o.pdfPage}"`));
    assert(!html.includes('drive.google'));
    checked++;
  }
  for (const o of museumObjects) {
    const html = renderToStaticMarkup(
      await ObjectPage({ ...query, params: Promise.resolve({ id: o.id }) }),
    );
    assert(html.includes(o.title[lang]));
    assert(
      html.includes(
        `/research/sources/${o.sourceId}?lang=${lang}#pdf-${o.pdfPage}`,
      ),
    );
    assert(html.includes(`/collection/${o.id}?lang=sr`));
    assert(!html.includes('.pdf'));
    checked++;
  }
  for (const slug of ['second-life', 'belgrade-in-motion']) {
    const html = renderToStaticMarkup(
      await ExhibitionPage({ params: Promise.resolve({ slug, locale: lang }) }),
    );
    assert(html.includes('Collection A. Radchenko, photo M.A.Haefliger'));
    assert(
      (html.match(/class="ex-gallery-image"/g) ?? []).length ===
        (slug === 'second-life' ? 30 : 14),
    );
    checked++;
  }
}
const home = renderToStaticMarkup(<Home />);
for (const path of [
  '/collection?lang=en',
  '/research?lang=en',
  '/dorcol-depot?lang=en',
  'id="contribute"',
])
  assert(home.includes(path));
for (const source of museumSources) {
  const html = renderToStaticMarkup(
    await Collection({
      searchParams: Promise.resolve({ source: source.id, lang: 'sr' }),
    }),
  );
  assert.equal(
    (html.match(/class="research-record"/g) ?? []).length,
    museumObjects.filter((o) => o.sourceId === source.id).length,
  );
}
for (const type of ['documented-fact', 'photograph-record']) {
  const html = renderToStaticMarkup(
    await Collection({ searchParams: Promise.resolve({ type }) }),
  );
  assert.equal(
    (html.match(/class="research-record"/g) ?? []).length,
    museumObjects.filter((o) => o.type === type).length,
  );
}
const empty = renderToStaticMarkup(
  await Collection({ searchParams: Promise.resolve({ source: 'unknown' }) }),
);
assert(!empty.includes('class="research-record"'));
for (const page of [Source, ObjectPage])
  await assert.rejects(
    () =>
      page({
        params: Promise.resolve({ id: 'missing' }),
        searchParams: Promise.resolve({}),
      }),
    /NEXT_NOT_FOUND/,
  );
await assert.rejects(
  () =>
    ExhibitionPage({
      params: Promise.resolve({ slug: 'missing', locale: 'sr' }),
    }),
  /NEXT_NOT_FOUND/,
);
await assert.rejects(
  () =>
    ExhibitionPage({
      params: Promise.resolve({ slug: 'second-life', locale: 'xx' }),
    }),
  /NEXT_NOT_FOUND/,
);
const incomplete = new FormData();
assert.equal(
  (
    await POST(
      new Request('http://localhost/api/contribute', {
        method: 'POST',
        body: incomplete,
      }) as Parameters<typeof POST>[0],
    )
  ).status,
  400,
);
const complete = new FormData();
for (const [key, value] of Object.entries({
  name: 'Local check',
  email: 'nobody@example.invalid',
  type: 'story',
  message: 'Offline validation',
}))
  complete.set(key, value);
assert.equal(
  (
    await POST(
      new Request('http://localhost/api/contribute', {
        method: 'POST',
        body: complete,
      }) as Parameters<typeof POST>[0],
    )
  ).status,
  500,
);
console.log(
  `${checked} page renders across SR/EN/RU; old exhibition counts/credits; source anchors; filters; invalid IDs/locales; home links and offline contribute 400/500 verified. No SMTP calls.`,
);

// Exercise the build gate with an uncleared image and a private master URL.
const fixture = mkdtempSync(resolve('work/rights-check-'));
try {
  mkdirSync(resolve(fixture, 'lib'));
  const original = JSON.parse(readFileSync('lib/museum-research.json', 'utf8'));
  for (const mutation of [
    (data: typeof original) => {
      data.objects[0].assets = [
        { rightsStatus: 'unknown', publicUrl: '/forbidden-book-scan.jpg' },
      ];
    },
    (data: typeof original) => {
      data.sources[0].masterUrl = 'https://drive.google.com/private-book.pdf';
    },
  ]) {
    const data = structuredClone(original);
    mutation(data);
    writeFileSync(
      resolve(fixture, 'lib/museum-research.json'),
      JSON.stringify(data),
    );
    const result = spawnSync(
      process.execPath,
      [resolve('validate-collection.mjs')],
      { cwd: fixture, encoding: 'utf8' },
    );
    assert.notEqual(
      result.status,
      0,
      'Build gate must reject uncleared assets and private master links',
    );
  }
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
console.log(
  'Negative rights-gate checks passed: uncleared image and private master link rejected.',
);
