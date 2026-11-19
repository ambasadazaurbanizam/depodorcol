'use client';

import { FormEvent, useEffect, useState } from 'react';
import { getMessages, type PublicLocale } from '@/lib/i18n';
import { ExhibitionCards } from './exhibition-cards';

const INSTAGRAM_URL = 'https://www.instagram.com/ambasadazaurbanizam/';
const MEDIA_VERSION = '2026-09-01-1';

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>;
}

export function MuseumLanding({ initialLocale = 'en' }: { initialLocale?: PublicLocale }) {
  const [locale, setLocale] = useState<PublicLocale>(initialLocale);
  const [formReady, setFormReady] = useState(false);
  const [formStatus, setFormStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = getMessages(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  async function prepareContribution(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setFormReady(false);
    setFormStatus('');

    const formData = new FormData(form);

    try {
      const response = await fetch('/api/contribute', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage =
          typeof payload === 'object' && payload !== null &&
          'error' in payload && typeof payload.error === 'string' && payload.error
            ? payload.error
            : 'Unable to send the information.';
        throw new Error(errorMessage);
      }

      setFormReady(false);
      setFormStatus(t.contribute.ready);
      form.reset();
    } catch (error) {
      setFormReady(false);
      setFormStatus(error instanceof Error ? error.message : 'Unable to send the information.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={`${t.hero.museum} — home`}>
          <img className="wordmark-logo" src="/media/logo.png" alt="Muzej javnog prevoza Beograda" />
          <span className="wordmark-text" aria-label="Muzej javnog prevoza Beograda">
            <span>MUZEJ JAVNOG</span>
            <span>PREVOZA BEOGRADA</span>
          </span>
        </a>

        <nav className="header-nav" aria-label="Primary navigation">
          <a href="#collection">{t.nav.collection}</a>
          <a href="#exhibitions">{t.nav.exhibitions}</a>
          <a href="#depot">{t.nav.home}</a>
          <a href="#contribute">{t.nav.contribute}</a>
        </nav>

        <div className="locale-list" aria-label="Language">
          {(['sr', 'en'] as const).map((code) => (
            <button
              key={code}
              type="button"
              aria-pressed={locale === code}
              aria-label={getMessages(code).languageName}
              onClick={() => setLocale(code)}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <div id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">{t.hero.museum}</p>
            <h1 id="hero-title">
              {t.hero.titleLineOne}<br />
              <em>{t.hero.titleLineTwo}</em>
            </h1>
            <p className="hero-deck">{t.hero.deck}</p>
            <p className="hero-status">{t.hero.status}</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#collection">{t.hero.explore}<span aria-hidden="true">↘</span></a>
              <a className="button button-line" href="#contribute">{t.hero.share}<Arrow /></a>
            </div>
          </div>

          <figure className="hero-figure">
            <img src={`/media/depot-hero.png?v=${MEDIA_VERSION}`} alt={t.hero.figureAlt} fetchPriority="high" />
            <figcaption>
              <span>{t.hero.figureLabel}</span>
              <span>{t.hero.figureNote}</span>
            </figcaption>
          </figure>
        </section>

        <section className="collect-section" id="collection" aria-labelledby="collect-title">
          <div className="section-heading">
            <p className="section-index">{t.collect.index}</p>
            <div>
              <h2 id="collect-title">{t.collect.title}</h2>
              <p className="section-intro">{t.collect.intro}</p>
            </div>
          </div>

          <ol className="category-grid">
            {t.collect.categories.map(([title, body], index) => (
              <li key={title}>
                <span className="category-number">{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="landing-exhibitions" id="exhibitions" aria-labelledby="exhibitions-title">
          <h2 id="exhibitions-title">{t.nav.exhibitions}</h2>
          <p className="landing-exhibitions-intro">
            {locale === 'sr'
              ? 'Dve fotografske izložbe otkrivaju Beograd i njegove tramvaje kroz objektiv Martina Häfligera.'
              : 'Two photographic exhibitions show Belgrade and its trams through the lens of Martin Häfliger.'}
          </p>
          <ExhibitionCards locale={locale} headingLevel={3} className="landing-exhibition-cards" />
          <nav className="landing-archive-links" aria-label={locale === 'sr' ? 'Još iz muzeja' : 'More from the museum'}>
            <a href={`/collection?lang=${locale}`}>{locale === 'sr' ? 'Zbirka' : 'Collection'} <Arrow /></a>
            <a href={`/research?lang=${locale}`}>{locale === 'sr' ? 'Istraživanja' : 'Research'} <Arrow /></a>
          </nav>
        </section>

        <section className="stories-section" aria-labelledby="stories-title">
          <div className="section-heading section-heading-light">
            <p className="section-index">{locale === 'sr' ? '02 / Iz arhiva muzeja' : '02 / From the museum archive'}</p>
            <div>
              <h2 id="stories-title">{locale === 'sr' ? 'Priče iza fotografija' : 'Stories beyond the photographs'}</h2>
              <p className="section-intro">
                {locale === 'sr'
                  ? 'Istražite ljude i mesta iza gradskog prevoza — i istorijske mape koje pokazuju kako se Beograd menjao.'
                  : 'Discover the people and places behind public transport, and the historical maps that reveal a changing Belgrade.'}
              </p>
            </div>
          </div>

          <div className="feature-story-grid">
            <article className="feature-story-card">
              <a href={`/dorcol-depot?lang=${locale}`}>
                <figure className="feature-story-media">
                  <img
                    src="/media/depot-story/depot-yard.webp"
                    alt={locale === 'sr' ? 'Tramvaji ispred Donjeg depoa na Dorćolu, arhivski snimak iz zbirke GSP-a.' : 'Historic trams outside the Lower Depot in Dorćol, from the GSP collection.'}
                    width={1427}
                    height={777}
                    loading="lazy"
                  />
                </figure>
                <div className="feature-story-content">
                  <p className="feature-story-kicker">{locale === 'sr' ? 'Istorija mesta' : 'History of a place'}</p>
                  <h3>Grad iza kapije</h3>
                  <p>{locale === 'sr'
                    ? 'Ko je popravljao beogradske tramvaje dok je grad spavao? Istorija dorćolskog depoa, radionica, kovačnice i ljudi.'
                    : 'Who repaired Belgrade’s trams while the city slept? The story of the Dorćol Depot, its workshops, forge and workers.'}</p>
                  <span className="feature-story-action">{locale === 'sr' ? 'Pročitajte priču' : 'Read the story'} <Arrow /></span>
                </div>
              </a>
            </article>

            <article className="feature-story-card feature-story-card-atlas" aria-label={locale === 'sr' ? 'Istorijski atlas u pripremi' : 'Historical atlas in progress'}>
              <div className="feature-story-media feature-map-pair">
                <figure>
                  <img
                    src="/media/atlas/belgrade-network-1892-from-gsp-1977.webp"
                    alt={locale === 'sr' ? 'Šema javnog prevoza Beograda za 1892. godinu iz knjige GSP-a iz 1977.' : '1892 public transport network diagram reproduced from the 1977 GSP book.'}
                    width={1581}
                    height={1610}
                    loading="lazy"
                  />
                  <figcaption>1892</figcaption>
                </figure>
                <figure>
                  <img
                    src="/media/atlas/belgrade-network-1976-from-gsp-1977.webp"
                    alt={locale === 'sr' ? 'Šema javnog prevoza Beograda za 1976. godinu iz knjige GSP-a iz 1977.' : '1976 public transport network diagram reproduced from the 1977 GSP book.'}
                    width={1560}
                    height={1588}
                    loading="lazy"
                  />
                  <figcaption>1976</figcaption>
                </figure>
              </div>
              <div className="feature-story-content">
                <p className="feature-story-kicker">{locale === 'sr' ? 'Istorijski atlas · U pripremi' : 'Historical atlas · In progress'}</p>
                <h3>{locale === 'sr' ? 'Beograd na šinama, 1892–1976' : 'Belgrade on the tracks, 1892–1976'}</h3>
                <p>{locale === 'sr'
                  ? 'Sedam istorijskih šema otkriva kako se mreža širila sa gradom. Pripremamo njihovo pažljivo prenošenje na savremenu mapu.'
                  : 'Seven historical diagrams reveal how the network expanded with the city. We are preparing a carefully researched modern map.'}</p>
                <small className="feature-story-source">{locale === 'sr' ? 'Izvor: GSP Beograd, 85 godina javnog gradskog saobraćaja (1977).' : 'Source: GSP Beograd, 85 years of public transport (1977).'}</small>
              </div>
            </article>
          </div>
        </section>

        <section className="depot-section" id="depot" aria-labelledby="depot-title">
          <div className="depot-visual">
            <img src={`/media/depot-02.png?v=${MEDIA_VERSION}`} alt={t.home.visualAlt} loading="lazy" />
            <p><span>{t.home.visualLabel}</span><span>{t.home.visualNote}</span></p>
          </div>
          <div className="depot-copy">
            <p className="section-index">{t.home.index}</p>
            <h2 id="depot-title">{t.home.title}</h2>
            <p className="depot-body">{t.home.body}</p>
            <dl className="address-block">
              <div><dt>{t.home.addressLabel}</dt><dd>{t.home.address}</dd></div>
            </dl>
            <p className="closed-notice"><span aria-hidden="true">●</span>{t.home.closed}</p>
            <a className="text-link" href="#collection">{t.home.visit}<Arrow /></a>
          </div>
        </section>

        <section className="why-section" aria-labelledby="why-title">
          <p className="section-index">{t.why.index}</p>
          <div>
            <h2 id="why-title">{t.why.title}</h2>
            <div className="why-copy">
              {t.why.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </section>

        <section className="contribute-section" id="contribute" aria-labelledby="contribute-title">
          <div className="contribute-intro">
            <p className="section-index">{t.contribute.index}</p>
            <h2 id="contribute-title">{t.contribute.title}</h2>
            <p>{t.contribute.intro}</p>
            <div className="looking-list">
              <h3>{t.contribute.looking}</h3>
              <ul>{t.contribute.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>

          <form className="contribution-form" onSubmit={prepareContribution}>
            <h3>{t.contribute.formTitle}</h3>
            <label>
              <span>{t.contribute.name}</span>
              <input name="name" type="text" autoComplete="name" required />
            </label>
            <label>
              <span>{t.contribute.email}</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              <span>{t.contribute.type}</span>
              <select name="type" required defaultValue="">
                <option value="" disabled>—</option>
                {t.contribute.typeOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>
              <span>{t.contribute.message}</span>
              <textarea name="message" rows={5} placeholder={t.contribute.messageHint} required />
            </label>
            <p className="form-privacy">{t.contribute.fileShareHint}</p>
            {t.contribute.privacy && <p className="form-privacy">{t.contribute.privacy}</p>}
            <button
              className="button button-light form-submit"
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : `${t.contribute.prepare}`}<Arrow />
            </button>
            <div className="form-status" aria-live="polite">
              {formStatus && <p>{formStatus}</p>}
            </div>
          </form>
        </section>

        <section className="stay-section" aria-labelledby="stay-title">
          <p className="section-index">{t.stay.index}</p>
          <div>
            <h2 id="stay-title">{t.stay.title}</h2>
            <p>{t.stay.body}</p>
            <a className="button button-dark" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">{t.stay.cta}<Arrow diagonal /></a>
          </div>
        </section>
      </div>

      <footer className="site-footer">
        <div className="footer-brand">
          <img className="footer-mark" src="/media/logo_white.png" alt="Muzej javnog prevoza Beograda" />
          <div>
            <strong>Muzej javnog prevoza Beograda</strong>
            <span>Belgrade Museum of Public Transport</span>
          </div>
        </div>

        <div className="footer-info">
          <p>{t.footer.initiative}</p>
          <p>{t.footer.dialogue}</p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <a href="#contribute">{t.footer.contact}</a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">{t.footer.instagram}</a>
          <a href="#privacy">{t.footer.privacy}</a>
        </nav>

        <div className="footer-legal" id="privacy">
          {t.footer.privacyText && <p>{t.footer.privacyText}</p>}
          <p>{t.footer.credits}</p>
          <p>© {new Date().getFullYear()} Muzej javnog prevoza Beograda</p>
        </div>
      </footer>
    </main>
  );
}
