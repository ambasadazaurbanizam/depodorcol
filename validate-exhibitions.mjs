import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';

const { exhibitions } = JSON.parse(readFileSync('lib/exhibitions.json'));
const images = JSON.parse(readFileSync('lib/exhibition-images.json'));
const registry = new Map(images.map((image) => [image.id, image]));
assert.equal(registry.size, images.length, 'Duplicate collection ID');
let count = 0;
for (const exhibition of exhibitions) {
  const ids = exhibition.chapters.flatMap((chapter) => chapter.images);
  assert.equal(new Set(ids).size, ids.length, 'Duplicate photograph in exhibition');
  assert(ids.includes(exhibition.hero), 'Hero must belong to the exhibition');
  for (const id of ids) {
    const image = registry.get(id);
    assert(image, `Unknown photograph: ${id}`);
    assert.notEqual(image.status, 'excluded', `Excluded photograph: ${id}`);
    if (exhibition.slug === 'second-life') assert.notEqual(image.vehicle, '1004');
    if (exhibition.slug === 'belgrade-in-motion') assert.equal(image.date, '1978-04');
    for (const locale of ['sr', 'en', 'ru']) {
      assert(image.caption[locale]?.trim(), `Missing ${locale} caption: ${id}`);
      assert(image.alt[locale]?.trim(), `Missing ${locale} alt text: ${id}`);
    }
    assert.equal(image.credit, 'Collection A. Radchenko, photo M.A.Haefliger');
    const original = readFileSync(`public${image.original}`);
    assert.equal(createHash('sha256').update(original).digest('hex'), image.sha256,
      `Original bytes do not match collection register: ${id}`);
    for (const variant of [...image.variants, image.fullSize]) {
      assert.equal(statSync(`public${variant.src}`).size, variant.bytes,
        `Missing or changed image derivative: ${variant.src}`);
      assert(variant.width > 0 && variant.height > 0);
    }
    count++;
  }
  console.log(`${exhibition.slug}: ${ids.length} photographs verified`);
}
console.log(`${count} originals and ${count * 4} WebP derivatives verified`);
