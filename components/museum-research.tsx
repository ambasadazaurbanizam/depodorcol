import type { ReactNode } from 'react';
import { ExhibitionHeader } from './exhibition';
import {
  exhibitions,
  exhibitionUrl,
  type ExhibitionLocale,
} from '@/lib/exhibitions';
import { museumUrl, text, type MuseumObject } from '@/lib/museum-research';
import '@/app/exhibitions/exhibitions.css';
import '@/app/research/research.css';

export function MuseumFrame({
  locale,
  path,
  title,
  children,
}: {
  locale: ExhibitionLocale;
  path: string;
  title: string;
  children: ReactNode;
}) {
  const links = [
    ['/exhibitions', text(locale, 'Izložbe', 'Exhibitions', 'Выставки')],
    ['/collection', text(locale, 'Kolekcija', 'Collection', 'Коллекция')],
    [
      '/dorcol-depot',
      text(locale, 'Depo Dorćol', 'Dorćol Depot', 'Депо Дорчол'),
    ],
    ['/research', text(locale, 'Istraživanja', 'Research', 'Исследования')],
  ];
  return (
    <div className="exhibition museum-research" lang={locale}>
      <ExhibitionHeader locale={locale} languagePath={path} />
      <nav
        className="research-nav"
        aria-label={text(locale, 'Muzej', 'Museum', 'Музей')}
      >
        {links.map(([href, label]) => (
          <a
            key={href}
            href={museumUrl(href, locale)}
            aria-current={path === href ? 'page' : undefined}
          >
            {label}
          </a>
        ))}
        <a href="/#contribute">
          {text(
            locale,
            'Podelite priču',
            'Share a story',
            'Поделиться историей',
          )}
        </a>
      </nav>
      <main id="exhibition-main" className="research-main">
        <div className="ex-draft" role="note">
          {text(
            locale,
            'Urednički nacrt · tekst i prevodi čekaju odobrenje. Potvrda u jednoj knjizi nije nezavisna arhivska provera.',
            'Editorial draft · text and translations await approval. Confirmation in one book is not independent archival verification.',
            'Редакционный черновик · текст и переводы ждут утверждения. Подтверждение в одной книге не равно независимой архивной проверке.',
          )}
        </div>
        <h1>{title}</h1>
        {children}
      </main>
      <footer className="ex-footer">
        <span>Depo Dorćol · Ambasada za urbanizam</span>
        <p>
          {text(
            locale,
            'Digitalni muzejski projekat. Fizički muzej još ne prima posetioce.',
            'A digital museum project. The physical museum is not yet open to visitors.',
            'Проект цифрового музея. Физический музей пока не принимает посетителей.',
          )}
        </p>
      </footer>
    </div>
  );
}
export function SourceCitation({
  object,
  locale,
}: {
  object: MuseumObject;
  locale: ExhibitionLocale;
}) {
  return (
    <a
      href={
        museumUrl(`/research/sources/${object.sourceId}`, locale) +
        `#pdf-${object.pdfPage}`
      }
    >
      {object.sourceId} · PDF {object.pdfPage} ·{' '}
      {text(locale, 'štampana str.', 'printed p.', 'печатная с.')}{' '}
      {object.printPage ??
        text(
          locale,
          'bez odvojene paginacije',
          'no separate pagination',
          'без отдельной пагинации',
        )}
    </a>
  );
}
export function EvidenceBadge({
  object,
  locale,
}: {
  object: MuseumObject;
  locale: ExhibitionLocale;
}) {
  return (
    <span className="research-evidence">
      {text(
        locale,
        'Potvrđeno u izvoru',
        'Confirmed in the source',
        'Подтверждено в источнике',
      )}{' '}
      · {object.reviewedAt}
    </span>
  );
}
export function ObjectSummary({
  object,
  locale,
}: {
  object: MuseumObject;
  locale: ExhibitionLocale;
}) {
  return (
    <article className="research-record">
      <p className="ex-object-id">
        {object.id} · {object.period[locale]}
      </p>
      <h2>
        <a href={museumUrl(`/collection/${object.id}`, locale)}>
          {object.title[locale]}
        </a>
      </h2>
      <EvidenceBadge object={object} locale={locale} />
      <p>{object.summary[locale]}</p>
      <p className="research-limitation">{object.limitation[locale]}</p>
      <SourceCitation object={object} locale={locale} />
    </article>
  );
}
export function RelatedExhibitions({ locale }: { locale: ExhibitionLocale }) {
  return (
    <section className="research-section">
      <h2>
        {text(
          locale,
          'Povezane izložbe',
          'Related exhibitions',
          'Связанные выставки',
        )}
      </h2>
      <p>
        {text(
          locale,
          'Dodatni fotografski kontekst, ne nezavisna potvrda ovih činjenica.',
          'Additional photographic context, not independent verification of these facts.',
          'Дополнительный фотографический контекст, а не независимое подтверждение этих фактов.',
        )}
      </p>
      <ul>
        {exhibitions.map((ex) => (
          <li key={ex.slug}>
            <a href={exhibitionUrl(ex.slug, locale)}>{ex.title[locale]}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
