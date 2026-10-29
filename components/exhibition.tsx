/* oxlint-disable next/no-img-element -- Collection images use checked-in responsive derivatives and intrinsic dimensions. */
import { ExhibitionGallery } from './exhibition-gallery';
import {
  exhibitions,
  exhibitionUrl,
  locales,
  museumHomeUrl,
  photograph,
  sources,
  ui,
  type ExhibitionLocale,
} from '@/lib/exhibitions';

export function ExhibitionHeader({
  locale,
  slug,
}: {
  locale: ExhibitionLocale;
  slug?: string;
}) {
  return (
    <>
      <a className="skip-link" href="#exhibition-main">
        {ui.skip[locale]}
      </a>
      <header className="ex-header">
        <a className="wordmark" href={museumHomeUrl(locale)} aria-label={ui.home[locale]}>
          <img className="wordmark-logo" src="/media/logo.png" alt="Muzej javnog prevoza Beograda" />
          <span>
            Depo Dorćol
            <span className="ex-wordmark-sub">
              Muzej javnog prevoza Beograda
            </span>
          </span>
        </a>
        <a href={museumHomeUrl(locale, 'exhibitions')}>{ui.exhibitions[locale]}</a>
        <nav className="ex-languages" aria-label="Language">
          {locales.map((code) => (
            <a
              key={code}
              lang={code}
              hrefLang={code}
              aria-current={locale === code ? 'page' : undefined}
              href={
                slug ? exhibitionUrl(slug, code) : `/exhibitions?lang=${code}`
              }
            >
              {code.toUpperCase()}
            </a>
          ))}
        </nav>
      </header>
    </>
  );
}

export function Exhibition({
  slug,
  locale,
}: {
  slug: string;
  locale: ExhibitionLocale;
}) {
  const exhibition = exhibitions.find((item) => item.slug === slug)!;
  const other = exhibitions.find((item) => item.slug !== slug)!;
  const images = exhibition.chapters.flatMap((chapter) =>
    chapter.images.map(photograph),
  );
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: exhibition.title[locale],
    description: exhibition.deck[locale],
    inLanguage: locale,
    mainEntity: {
      '@type': 'ImageGallery',
      numberOfItems: images.length,
      hasPart: images.map((image) => ({
        '@type': 'ImageObject',
        identifier: image.id,
        name: image.caption[locale],
        contentUrl: image.variants[2].src,
        creditText: 'Collection A. Radchenko, photo M.A.Haefliger',
        creator: { '@type': 'Person', name: image.creator },
      })),
    },
  };
  return (
    <div
      className={`exhibition ex-${exhibition.theme} ex-gallery-page`}
      lang={locale}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <ExhibitionHeader locale={locale} slug={slug} />
      <main id="exhibition-main">
        <section className="ex-gallery-intro" aria-labelledby="ex-title">
          <div>
            <p className="ex-period">{exhibition.period[locale]}</p>
            <h1 id="ex-title">{exhibition.title[locale]}</h1>
          </div>
          <div className="ex-gallery-intro-copy">
            <p>{exhibition.intro[locale]}</p>
            {exhibition.anniversary && (
              <p className="ex-anniversary">{exhibition.anniversary[locale]}</p>
            )}
            <small>Collection A. Radchenko, photo M.A.Haefliger</small>
          </div>
        </section>
        <ExhibitionGallery
          images={images}
          locale={locale}
          groups={exhibition.chapters.map((chapter) => ({
            id: chapter.id,
            title: chapter.title,
            images: chapter.images,
          }))}
        />
        <details className="ex-collection-notes">
          <summary>{ui.about[locale]}</summary>
          <div className="ex-notes-content">
            <div>
              <p>{exhibition.rights[locale]}</p>
              <h2>{ui.sources[locale]}</h2>
              <ul>
                {exhibition.sources.map((id) => {
                  const source = sources[id as keyof typeof sources];
                  return (
                    <li key={id}>
                      {source.url ? (
                        <a href={source.url} target="_blank" rel="noreferrer">
                          {source.title}
                        </a>
                      ) : (
                        <strong>{source.title}</strong>
                      )}
                      <p>{source.note[locale]}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <p>{exhibition.research[locale]}</p>
            </div>
          </div>
        </details>
        <section className="ex-next">
          <p>{ui.other[locale]}</p>
          <a href={exhibitionUrl(other.slug, locale)}>
            <img
              src={photograph(other.hero).variants[0].src}
              alt=""
              width="640"
              height="426"
              loading="lazy"
            />
            <span>{other.title[locale]}</span>
          </a>
        </section>
      </main>
      <footer className="ex-footer">
        <a href={museumHomeUrl(locale)}>Depo Dorćol</a>
        <p>{ui.closed[locale]}</p>
        <a href={museumHomeUrl(locale, 'exhibitions')}>{ui.exhibitions[locale]}</a>
      </footer>
    </div>
  );
}
