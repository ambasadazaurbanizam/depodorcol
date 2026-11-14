import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const { sources, objects } = JSON.parse(
  readFileSync('lib/museum-research.json', 'utf8'),
);
assert.deepEqual(
  sources.map((s) => s.id),
  ['S-1952', 'S-1977', 'S-2002'],
);
assert.equal(new Set(objects.map((o) => o.id)).size, objects.length);
assert.equal(objects.length, 10);
for (const source of sources) {
  assert.equal(source.access, 'bibliography-only');
  assert.equal(source.rightsStatus, 'uncleared');
  assert(
    !JSON.stringify(source).match(/https?:|drive\.google|\.pdf\b/i),
    'No master-file URLs in public source metadata',
  );
}
for (const object of objects) {
  const source = sources.find((s) => s.id === object.sourceId);
  assert(source, `${object.id}: unknown source`);
  assert(
    Number.isInteger(object.pdfPage) &&
      object.pdfPage >= 1 &&
      object.pdfPage <= source.pdfPages,
  );
  assert(object.printPage === null || Number.isInteger(object.printPage));
  assert.equal(object.evidenceStatus, 'source-confirmed');
  assert.equal(object.editorialStatus, 'draft');
  assert.equal(object.reviewBasis, 'research-register');
  assert.equal(object.reviewedAt, '2026-11-14');
  for (const locale of ['sr', 'en', 'ru']) {
    for (const key of ['title', 'summary', 'period', 'limitation'])
      assert(
        object[key][locale]?.trim(),
        `${object.id}: missing ${locale} ${key}`,
      );
    assert.equal(object.languageStatus[locale], 'review');
  }
  // This pilot deliberately has no asset renderer or public image fields.
  assert.deepEqual(
    object.assets,
    [],
    `${object.id}: book illustrations must remain absent until cleared`,
  );
  assert(
    !JSON.stringify(object).match(/https?:|drive\.google|\.pdf\b/i),
    'Private assets must not enter public record data',
  );
}
for (const id of ['DOR-010', 'DOR-016'])
  assert.equal(
    objects.find((o) => o.id === id).imageRights,
    'permission-required',
  );
assert.equal(objects.find((o) => o.id === 'DOR-017').pdfPage, 39);
assert.equal(objects.find((o) => o.id === 'DOR-018').pdfPage, 40);
assert.equal(objects.find((o) => o.id === 'DOR-019').pdfPage, 45);
console.log(
  '3 bibliography records, 10 multilingual draft records, citations and absence of uncleared assets verified',
);
