# Research pilot — review before merge or deployment

This is an additive, reversible first iteration, based on `main` at
`d0ecd961ed77833af9d08584f305716a1e0710b0`. It does not open the physical museum.

## Scope

- `/dorcol-depot`: draft editorial account of work, smithies, workers, the gate photograph and trolleybus facilities; links to ten records and the existing exhibitions.
- `/research` (also `/research/sources`): bibliography and methodology.
- `/research/sources/S-1952`, `S-1977`, `S-2002`: source metadata, selected PDF-page index, separate printed pagination and related records.
- `/collection` and `/collection/DOR-…`: ten text-only fact/photograph descriptions, with source/type filters, limitations and stable IDs. These are digital research records, not assertions of ownership of physical artefacts.

New pages use `?lang=sr|en|ru` (default SR), reuse the exhibition header/design tokens and link to both existing exhibitions. All new text/translations remain explicitly draft and new pages use `noindex`. The existing homepage retains its SR/EN language implementation.

## Content provenance

Read through the connected Google Drive account on 14 November 2026:

- [Specification v1.2](https://docs.google.com/document/d/1vF3vbAkpaND0CTHuTFNJhcI0zvuZepke3eNVd3IPgMA/edit).
- [19-record research register](https://docs.google.com/spreadsheets/d/18Rm5n_WMElAXGzncjuN8tqeWH3M3dA2QgcJv7OAahqo/edit).
- [Serbian editorial draft](https://docs.google.com/document/d/1NVeaKGQjJ-bT9WaVknK1ZIgkkhlXztNo6WMMcjwb8EI/edit).
- The supplied research archive was inventoried; no scans, OCR text or book illustrations were copied into the site.

The ten selected records are DOR-001/003/004/007/009/010/016/017/018/019. The source register documents earlier visual verification of 11 pages; this implementation does **not** claim a new independent scan review. “Confirmed in the source” is distinct from independent archival corroboration and exact building identification. Book authors/editors/publishers await colophon verification. Book publication year is not a photograph date.

Public JSON contains bibliography and factual annotations only, without private master-file URLs or OCR. No book images are displayed. The build validation rejects any assets in this pilot, including an uncleared image or a master-file URL. Future asset support requires a separately reviewed rights policy and renderer; setting a flag alone cannot enable it.

## Verification

```sh
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit --incremental false
pnpm build
node validate-exhibitions.mjs
pnpm validate:collection
pnpm test:museum
```

`test:museum` performs 57 component-level renders across SR/EN/RU; checks old gallery counts/credit, source-page anchors, collection filters, unknown IDs/locales, homepage links and offline `/api/contribute` validation (400/500). SMTP is replaced with a throwing stub and credentials are cleared in the test process; nothing is sent. Negative fixtures verify that the build gate rejects uncleared assets and private master links. This is not a browser/end-to-end test.

The existing exhibition validator verifies 44 original file hashes and 176 derivative sizes. All public assets were also checked against the original GitHub blob SHAs. Existing exhibition JSON, gallery logic, API handler, Docker/Caddy, hosting configuration and dependency lockfile are unchanged.

Managed browser preview could not start: the existing Cloudflare Vite plugin failed with `uv_interface_addresses` in the execution environment. Desktop/mobile visual review, gallery dialog/filter interaction, client-side form interaction and full HTTP routing remain **unverified**. Responsive CSS is provided, but is not a substitute for that review. SMTP delivery is deliberately untested.

## Release and rollback

No merge, Sites version save, deployment, DNS/server change or external communication is part of this change. The repository has no tracked Actions workflows; hosting configuration is unchanged. An external deployment webhook cannot be ruled out from repository contents alone.

Before merge/deploy: review the ten records and translations, check the new and old routes on desktop/mobile in an isolated preview, exercise the galleries and form with mocked delivery, and confirm the actual production release path. Do not treat this PR as release approval. Keep draft/noindex status until editorial approval.

All changes are in one feature commit. To roll back after an approved merge, revert that commit (or its merge commit) through the normal review process; no data migration or infrastructure rollback is required.
