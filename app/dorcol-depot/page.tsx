/* oxlint-disable next/no-img-element -- Historic museum source images use controlled derivatives. */
import type { Metadata } from 'next';
import { ExhibitionHeader } from '@/components/exhibition';
import { museumLocale, text } from '@/lib/museum-research';
import { RelatedExhibitions } from '@/components/museum-research';
import story from '@/lib/depot-story.json';
import translations from '@/lib/depot-story-translations.json';
import './depot-story.css';

type Props = { searchParams: Promise<{ lang?: string }> };
type ImageKey = keyof typeof story.manifest;
type ChapterKey = keyof typeof translations.en.chapters;

const serbianLabels = {
  "eyebrow": "Depo Dorćol / Mesto i sećanje",
  "meta": [
    {
      "title": "Donji depo",
      "detail": "Istorijski tramvajski pogon"
    },
    {
      "title": "Radionice i kovačnica",
      "detail": "Prostor tehničkog znanja i rada"
    },
    {
      "title": "Digitalna zbirka",
      "detail": "Fizički muzej nije otvoren za posete"
    }
  ],
  "introMark": "O priči / Uvod",
  "forgeQuote": "Četiri nakovnja i jedna zajednička vatra — tako počinje sačuvani opis prve kovačnice.",
  "protectionLabel": "Očuvanje industrijskog nasleđa",
  "protectionTitle": "Šta će grad sačuvati?",
  "protectionParas": [
    "Ambasada za urbanizam je 4. septembra 2026. podnela inicijativu za stručnu identifikaciju i valorizaciju istorijskog kompleksa depoa GSP na Dorćolu.",
    "Zavod za zaštitu spomenika kulture grada Beograda je 18. septembra potvrdio prijem inicijative pod brojem 75-239/2026 od 7. septembra 2026. godine. Naveo je da kompleks tada nije imao status kulturnog dobra niti dobra pod prethodnom zaštitom i da će stručni saradnici sprovesti istraživanja.",
    "To nije odluka o proglašenju zaštite, već početak stručnog razmatranja vrednosti mesta."
  ],
  "sourceLead": "Izvor: GSP",
  "sourcePage": "PDF str.",
  "sourceDateCaution": "datum snimanja nije potvrđen.",
  "sourceSummary": "Izvori i napomene",
  "pdfLabel": "PDF str.",
  "footer": "Ambasada za urbanizam · digitalni muzejski projekat"
};

const seo = {
  sr: {
    title: 'Depo Dorćol — Grad iza kapije | Muzej javnog prevoza Beograda',
    description: 'Istorija Donjeg tramvajskog depoa, kovačnice, radionica i trolejbuskog pogona na Dorćolu.',
  },
  en: {
    title: 'Dorćol Depot — A City Behind the Gate | Belgrade Museum of Public Transport',
    description: 'The history of Dorćol’s Lower Tram Depot, workshops, forge and trolleybus depot.',
  },
  ru: {
    title: 'Депо Дорчол — Город за воротами | Музей общественного транспорта Белграда',
    description: 'История Нижнего трамвайного депо на Дорчоле, мастерских, кузницы и троллейбусного депо.',
  },
};

const sourceNotes = {
  sr: [
    '60 godina beogradskog javnog saobraćaja (1952), PDF str. 26, 30–33, 42.',
    '85 godina javnog gradskog saobraćaja u Beogradu (1977), PDF str. 14, 55, 57, 67.',
    '110 godina gradskog prevoza u Beogradu (2002), PDF str. 39–40, 45.',
    'GSP Beograd, Kovačnica (2015).',
    'Danas, 27–28.02.1999, str. 7.',
    'Zavod za zaštitu spomenika kulture grada Beograda, odgovor 18.09.2026, br. 75-239/2026.',
  ],
  en: [
    '60 godina beogradskog javnog saobraćaja (1952), PDF pp. 26, 30–33, 42.',
    '85 godina javnog gradskog saobraćaja u Beogradu (1977), PDF pp. 14, 55, 57, 67.',
    '110 godina gradskog prevoza u Beogradu (2002), PDF pp. 39–40, 45.',
    'GSP Belgrade, Kovačnica (The Forge), 2015.',
    'Danas, 27–28 February 1999, p. 7.',
    'Cultural Heritage Preservation Institute of Belgrade, official reply of 18 September 2026, no. 75-239/2026.',
  ],
  ru: [
    '60 godina beogradskog javnog saobraćaja (1952), стр. PDF 26, 30–33, 42.',
    '85 godina javnog gradskog saobraćaja u Beogradu (1977), стр. PDF 14, 55, 57, 67.',
    '110 godina gradskog prevoza u Beogradu (2002), стр. PDF 39–40, 45.',
    'ГСП Белград, Kovačnica («Кузница»), 2015.',
    'Газета Danas, 27–28 февраля 1999 года, с. 7.',
    'Завод по охране памятников культуры Белграда, официальный ответ от 18 сентября 2026 года, № 75-239/2026.',
  ],
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const locale = museumLocale((await searchParams).lang);
  return {
    ...seo[locale],
    metadataBase: new URL('https://depodorcol.rs'),
    alternates: {
      canonical: `/dorcol-depot?lang=${locale}`,
      languages: {
        sr: '/dorcol-depot?lang=sr',
        en: '/dorcol-depot?lang=en',
        ru: '/dorcol-depot?lang=ru',
      },
    },
    robots: { index: false, follow: true }, // Retain restriction pending image rights review.
  };
}

function SourcePhoto({ photo, hero = false, locale }: { photo: ImageKey; hero?: boolean; locale: 'sr' | 'en' | 'ru' }) {
  const image = story.manifest[photo];
  const translated = locale === 'sr' ? null : translations[locale].photos[photo];
  const labels = locale === 'sr' ? serbianLabels : translations[locale].labels;
  return (
    <figure className={hero ? 'd-hero-media' : 'd-photo'}>
      <img
        src={`/media/depot-story/${image.file}`}
        alt={translated?.alt ?? image.alt}
        loading={hero ? 'eager' : 'lazy'}
      />
      <figcaption>
        {translated?.caption ?? image.caption}{' '}
        <span className="d-photo-source">
          {labels.sourceLead} {image.book}, {labels.sourcePage} {image.pdfPage}; {labels.sourceDateCaution}
        </span>
      </figcaption>
    </figure>
  );
}

export default async function Page({ searchParams }: Props) {
  const locale = museumLocale((await searchParams).lang);
  const localized = locale === 'sr' ? null : translations[locale];
  const labels = localized?.labels ?? serbianLabels;
  const intro = localized?.intro ?? story.intro;
  const chapters = story.chapters.map((chapter) => {
    const translated = localized?.chapters[chapter.slug as ChapterKey];
    return {
      ...chapter,
      title: translated?.title ?? chapter.title,
      kicker: translated?.kicker ?? chapter.kicker,
      year: translated?.year ?? chapter.year,
      paras: translated?.paras ?? chapter.paras,
    };
  });

  return (
    <div className="exhibition depot-story" lang={locale}>
      <ExhibitionHeader locale={locale} languagePath="/dorcol-depot" />
      <main id="exhibition-main">
        <section className="d-hero" id="top">
          <div className="d-hero-copy">
            <span className="d-eyebrow">{labels.eyebrow}</span>
            <h1>
              {text(locale, 'Grad', 'A city', 'Город')}
              <br />
              <em>{text(locale, 'iza kapije.', 'behind the gate.', 'за воротами.')}</em>
            </h1>
            <p className="d-subtitle">
              {text(
                locale,
                'Istorija mesta na kome je Beograd čuvao, popravljao i pripremao vozila za novi dan.',
                'The story of a place where Belgrade stored, repaired and prepared vehicles for another day.',
                'История места, где Белград хранил, ремонтировал и готовил транспорт к новому дню.',
              )}
            </p>
            <div className="d-hero-bottom"><span>1892–2026</span><span>↓</span></div>
          </div>
          <SourcePhoto photo="depot-yard" hero locale={locale} />
        </section>

        <div className="d-meta">
          {labels.meta.map((item) => (
            <div key={item.title}><b>{item.title}</b><span>{item.detail}</span></div>
          ))}
        </div>

        <div className="d-container">
          <section className="d-intro">
            <div className="d-intro-mark">{labels.introMark}</div>
            <div className="d-intro-text">
              {intro.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
          </section>

          <div className="d-chapters">
            {chapters.map((chapter, index) => (
              <article className="d-chapter" id={chapter.slug} key={chapter.slug}>
                <div className="d-ordinal">
                  {String(index + 1).padStart(2, '0')}
                  <div style={{ font: '12px Arial', marginTop: 16, color: 'var(--muted)' }}>{chapter.year}</div>
                </div>
                <div className="d-chapter-content">
                  <p className="d-chapter-kicker">{chapter.kicker}</p>
                  <h2>{chapter.title}</h2>
                  <div className="d-paragraphs">
                    {chapter.paras.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                  </div>
                  {chapter.photos.length > 0 && (
                    <div className={`d-figures ${chapter.photos.length > 1 ? 'two' : ''}`}>
                      {chapter.photos.map((photo) => (
                        <SourcePhoto key={photo} photo={photo as ImageKey} locale={locale} />
                      ))}
                    </div>
                  )}
                  {chapter.slug === 'forge' && <blockquote className="d-pull">{labels.forgeQuote}</blockquote>}
                </div>
              </article>
            ))}
          </div>
        </div>

        <section className="d-issue" id="protection">
          <div className="d-container d-issue-inner">
            <div>
              <div className="d-issue-label">{labels.protectionLabel}</div>
              <h2>{labels.protectionTitle}</h2>
              <span className="d-issue-number">75-239/2026</span>
            </div>
            <div className="d-issue-body">
              {labels.protectionParas.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
          </div>
        </section>

        <div className="d-container">
          <section className="d-sources">
            <details>
              <summary>{labels.sourceSummary} ↓</summary>
              <ol>
                {sourceNotes[locale].map((source, index) => (
                  <li key={index}>
                    {index === 3 ? (
                      <a href="https://www.gsp.rs/dokumenti/muzejska_zbirka/kovacnica.pdf">{source}</a>
                    ) : source}
                  </li>
                ))}
              </ol>
            </details>
          </section>
        </div>
        <div className="d-container"><RelatedExhibitions locale={locale} /></div>
      </main>
      <footer className="d-footer">
        <span>DEPO DORĆOL · MUZEJ JAVNOG PREVOZA BEOGRADA</span>
        <span>{labels.footer}</span>
      </footer>
    </div>
  );
}
