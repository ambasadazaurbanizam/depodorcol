import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MuseumFrame, ObjectSummary } from '@/components/museum-research';
import {
  museumLocale,
  museumSources,
  museumObjects,
  museumUrl,
  text,
} from '@/lib/museum-research';
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `${museumSources.find((s) => s.id === id)?.title ?? 'Source'} | Depo Dorćol`,
    robots: { index: false, follow: true },
  };
}
export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const source = museumSources.find((s) => s.id === id);
  if (!source) notFound();
  const locale = museumLocale((await searchParams).lang);
  const records = museumObjects.filter((o) => o.sourceId === id);
  const pages = [...new Set(records.map((o) => o.pdfPage))].sort(
    (a, b) => a - b,
  );
  const unknown = text(
    locale,
    'Nije utvrđeno — proveriti kolofon',
    'Not established — verify the colophon',
    'Не установлено — сверить выходные данные',
  );
  return (
    <MuseumFrame
      locale={locale}
      path={`/research/sources/${id}`}
      title={source.title}
    >
      <p>
        <a href={museumUrl('/research', locale)}>
          {text(locale, 'Svi izvori', 'All sources', 'Все источники')}
        </a>{' '}
        / {source.id}
      </p>
      <dl className="research-meta">
        <div>
          <dt>{text(locale, 'Godina', 'Year', 'Год')}</dt>
          <dd>{source.year}</dd>
        </div>
        <div>
          <dt>
            {text(
              locale,
              'Autor / urednik',
              'Author / editor',
              'Автор / редактор',
            )}
          </dt>
          <dd>{unknown}</dd>
        </div>
        <div>
          <dt>{text(locale, 'Izdavač', 'Publisher', 'Издатель')}</dt>
          <dd>{unknown}</dd>
        </div>
        <div>
          <dt>{text(locale, 'Jezik', 'Language', 'Язык')}</dt>
          <dd>
            {text(
              locale,
              'Srpski · ćirilica',
              'Serbian · Cyrillic',
              'Сербский · кириллица',
            )}
          </dd>
        </div>
        <div>
          <dt>
            {text(
              locale,
              'Istraživačka kopija',
              'Research copy',
              'Исследовательская копия',
            )}
          </dt>
          <dd>
            {source.pdfPages} PDF {text(locale, 'stranica', 'pages', 'страниц')}
          </dd>
        </div>
        <div>
          <dt>OCR</dt>
          <dd>
            {text(
              locale,
              'Mašinski OCR; potpuna ručna provera nije završena.',
              'Machine OCR; full manual proofreading is incomplete.',
              'Машинный OCR; полная ручная вычитка не завершена.',
            )}
          </dd>
        </div>
        <div>
          <dt>
            {text(
              locale,
              'Pristup i prava',
              'Access and rights',
              'Доступ и права',
            )}
          </dt>
          <dd>
            {text(
              locale,
              'Samo bibliografija i činjenične beleške. Dozvole za tekst i ilustracije nisu potvrđene; nema javnog PDF-a.',
              'Bibliography and factual notes only. Text and illustration permissions are unconfirmed; no public PDF.',
              'Только библиография и фактические аннотации. Права на текст и иллюстрации не подтверждены; публичного PDF нет.',
            )}
          </dd>
        </div>
      </dl>
      <h2>
        {text(
          locale,
          'Izabrane stranice i povezani zapisi',
          'Selected pages and linked records',
          'Избранные страницы и связанные записи',
        )}
      </h2>
      <p>
        {text(
          locale,
          'Radni indeks ovog pilota, ne potpuno oglavlje knjige.',
          'A working index for this pilot, not a complete table of contents.',
          'Рабочий индекс пилота, а не полное оглавление книги.',
        )}
      </p>
      {pages.map((page) => (
        <section className="research-page-group" id={`pdf-${page}`} key={page}>
          <h3>PDF {page}</h3>
          {records
            .filter((o) => o.pdfPage === page)
            .map((o) => (
              <ObjectSummary key={o.id} object={o} locale={locale} />
            ))}
        </section>
      ))}
      <p>
        <a href={museumUrl('/dorcol-depot', locale)}>
          {text(
            locale,
            'Povezana priča: Depo Dorćol',
            'Related story: Dorćol Depot',
            'Связанная история: депо Дорчол',
          )}
        </a>
      </p>
    </MuseumFrame>
  );
}
