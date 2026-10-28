# Additive exhibition sections for depodorcol.rs

Prepared against `ambasadazaurbanizam/depodorcol` main at
`a7bd77f82c8e0a0985547dd2b01363914425ca15`.

New routes: `/exhibitions`, `/exhibitions/second-life/{sr,en,ru}` and
`/exhibitions/belgrade-in-motion/{sr,en,ru}`. The Basel selection contains 30
photographs; tram 1004 is excluded. April 1978 contains 14 photographs.

Existing landing content is retained. Only a navigation link and an exhibition
links block are added. Global styles receive only the new block's rules; the
sitemap receives new entries. Exhibition links use added keys in the existing
SR/EN message dictionaries; existing translations are preserved. The root layout, submission
API, logos, SMTP settings, Docker configuration and Caddy configuration are
unchanged. The lock file adds the already-declared nodemailer dependency so a
frozen installation can succeed. Runtime package versions are unchanged; the
official @types/nodemailer 7.0.0 development dependency completes type checking.

Gallery files include responsive and full-resolution WebP derivatives with
`Collection A. Radchenko, photo M.A.Haefliger` attribution. The 44 active original JPEG files are preserved byte-for-byte in public/media
alongside the optimized derivatives. The collection register retains their
filenames, dimensions and SHA-256 hashes. Earlier duplicate/resized copies and
the excluded car 1004 remain in the source collection, outside this PR.

## Extending the exhibitions

Add the original and responsive WebP derivatives to public/media. Add a record
to lib/exhibition-images.json with a unique stable ID, original hash, dimensions,
SR/EN/RU captions and alt text, date/location evidence and rights attribution.
Reference the ID in the appropriate chapter in lib/exhibitions.json. Pages and
filters are generated from those chapters. Never add an excluded record to a
chapter. Run `node validate-exhibitions.mjs` and `pnpm build`.

## Publication

This branch adds to the existing repository and does not provision hosting.
There is no automated deployment workflow in the current repository. After
review and separate approval, merge the PR and use the existing server deployment
procedure in README.md to rebuild the existing Docker app. Keep .env, SMTP,
Caddy, domain and shared network settings intact. No deployment was performed.

Validation: production build; original landing/form preservation checks;
desktop and mobile gallery checks in SR/EN; metadata/file integrity validation.
No form submissions or email sends performed.

The follow-up resolves the two existing TypeScript issues: official Nodemailer
types are declared as a development dependency, and the form checks that an
error response contains a string before displaying it. The contribution API,
SMTP configuration and successful submission behavior are unchanged.
Validation commands: `pnpm exec tsc --noEmit`, `pnpm build`, and
`node validate-exhibitions.mjs`.
