'use client';

import { FormEvent, useEffect, useState } from 'react';
import { getMessages, type PublicLocale } from '@/lib/i18n';

const INSTAGRAM_URL = 'https://www.instagram.com/ambasadazaurbanizam/';
const MEDIA_VERSION = '2026-09-01-1';

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>;
}

export function MuseumLanding() {
  const [locale, setLocale] = useState<PublicLocale>('en');
  const [formReady, setFormReady] = useState(false);
  const t = getMessages(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  async function prepareContribution(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const note = [
      `${t.contribute.name}: ${form.get('name')}`,
      `${t.contribute.email}: ${form.get('email')}`,
      `${t.contribute.type}: ${form.get('type')}`,
      `${t.contribute.message}: ${form.get('message')}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(note);
    } catch {
      // The note remains visible in the form when clipboard permission is unavailable.
    }
    setFormReady(true);
  }

  return (
    <main id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={`${t.hero.museum} — home`}>
          <img className="wordmark-logo" src="/media/logo.png" alt="Muzej javnog prevoza Beograda" />
          <span>Muzej javnog prevoza Beograda</span>
        </a>

        <nav className="header-nav" aria-label="Primary navigation">
          <a href="#collection">{t.nav.collection}</a>
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

        <section className="stories-section" aria-labelledby="stories-title">
          <div className="section-heading section-heading-light">
            <p className="section-index">{t.stories.index}</p>
            <div>
              <h2 id="stories-title">{t.stories.title}</h2>
              <p className="section-intro">{t.stories.intro}</p>
            </div>
          </div>

          <div className="story-grid">
            {t.stories.cards.map(([title, body, meta], index) => (
              <article className="story-card" key={title}>
                <div className="story-placeholder" role="img" aria-label={`${title}. ${t.stories.rights}`}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <small>{t.stories.rights}</small>
                </div>
                <div className="story-meta"><span>{meta}</span><span>{t.stories.progress}</span></div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
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
            <p className="form-privacy">{t.contribute.privacy}</p>
            <button className="button button-light form-submit" type="submit">{t.contribute.prepare}<Arrow /></button>
            <div className="form-status" aria-live="polite">
              {formReady && (
                <>
                  <p>{t.contribute.ready}</p>
                  <a className="button button-signal" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">{t.contribute.instagram}<Arrow diagonal /></a>
                </>
              )}
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
          <span className="footer-mark" aria-hidden="true">M</span>
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
          <p>{t.footer.privacyText}</p>
          <p>{t.footer.credits}</p>
          <p>© {new Date().getFullYear()} Muzej javnog prevoza Beograda</p>
        </div>
      </footer>
    </main>
  );
}
