import type { Metadata } from 'next';
import { MuseumFrame } from '@/components/museum-research';
import {
  museumLocale,
  museumSources,
  museumObjects,
  museumUrl,
  text,
} from '@/lib/museum-research';
export const metadata: Metadata = {
  title: 'Istraživanja / Research | Depo Dorćol',
  robots: { index: false, follow: true },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const locale = museumLocale((await searchParams).lang);
  return (
    <MuseumFrame
      locale={locale}
      path="/research"
      title={text(
        locale,
        'Izvori i istraživanja',
        'Sources and research',
        'Источники и исследования',
      )}
    >
      <p className="research-lead">
        {text(
          locale,
          'Tri jubilarne knjige, deset početnih zapisa i otvorena pitanja o istoriji depoa.',
          'Three anniversary publications, ten initial records and open questions about depot history.',
          'Три юбилейные книги, десять первых записей и открытые вопросы об истории депо.',
        )}
      </p>
      <section
        className="research-grid"
        aria-label={text(
          locale,
          'Bibliografija',
          'Bibliography',
          'Библиография',
        )}
      >
        {museumSources.map((s) => (
          <article className="research-record" key={s.id}>
            <p>
              {s.id} · {s.year}
            </p>
            <h2>
              <a href={museumUrl(`/research/sources/${s.id}`, locale)}>
                {s.title}
              </a>
            </h2>
            <p>
              {s.pdfPages} PDF {text(locale, 'stranica', 'pages', 'страниц')} ·{' '}
              {museumObjects.filter((o) => o.sourceId === s.id).length}{' '}
              {text(
                locale,
                'povezanih zapisa',
                'linked records',
                'связанных записей',
              )}
            </p>
          </article>
        ))}
      </section>
      <section className="research-section">
        <h2>
          {text(
            locale,
            'Kako čitamo izvore',
            'How we read the sources',
            'Как мы читаем источники',
          )}
        </h2>
        <p>
          {text(
            locale,
            'Polazna osnova je istraživački registar od 19 zapisa. U ovoj iteraciji prikazujemo deset. Registar beleži vizuelnu proveru 11 PDF stranica 14. novembra 2026. Ova implementacija nije nova nezavisna provera skenova.',
            'The starting point is a research register of 19 records; this iteration presents ten. The register records visual checking of 11 PDF pages on 14 November 2026. This implementation is not a new independent scan verification.',
            'Основа — исследовательский реестр из 19 записей; в этой итерации показаны десять. В реестре зафиксирована визуальная проверка 11 PDF-страниц 14 ноября 2026 года. Реализация сайта не является новой независимой проверкой сканов.',
          )}
        </p>
        <p>
          {text(
            locale,
            'Svaka tvrdnja ima broj PDF strane i, kada postoji, štampanu paginaciju. OCR služi pretrazi; nije proveren istorijski tekst. Potvrda u knjizi, preciznost datuma i tačna lokacija odvojena su pitanja.',
            'Every claim has a PDF page and, where available, printed pagination. OCR supports searching; it is not verified historical text. Confirmation in a book, date precision and exact location are separate questions.',
            'У каждого утверждения есть PDF-страница и, где имеется, печатная пагинация. OCR помогает искать, но не считается проверенным историческим текстом. Подтверждение в книге, точность даты и локализация — разные вопросы.',
          )}
        </p>
        <p>
          {text(
            locale,
            'Autori i izdavači čekaju proveru kolofona. Skenovi, OCR tekstovi i knjiške ilustracije nisu dostupni na ovom sajtu: dozvole za reprodukciju nisu utvrđene.',
            'Authors and publishers await colophon verification. Scans, OCR texts and book illustrations are not available on this site: reproduction permissions are unresolved.',
            'Авторы и издатели требуют сверки с выходными данными. Сканы, OCR-тексты и книжные иллюстрации на сайте не доступны: разрешения на воспроизведение не установлены.',
          )}
        </p>
      </section>
      <p>
        <a href={museumUrl('/dorcol-depot', locale)}>
          {text(
            locale,
            'Pročitajte nacrt istorije depoa',
            'Read the draft depot history',
            'Читать черновик истории депо',
          )}
        </a>
      </p>
    </MuseumFrame>
  );
}
