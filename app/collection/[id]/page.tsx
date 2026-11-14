import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  MuseumFrame,
  EvidenceBadge,
  SourceCitation,
  RelatedExhibitions,
} from '@/components/museum-research';
import {
  museumLocale,
  museumObjects,
  museumUrl,
  text,
} from '@/lib/museum-research';
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
};
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const locale = museumLocale((await searchParams).lang);
  return {
    title: `${museumObjects.find((o) => o.id === id)?.title[locale] ?? 'Collection'} | Depo Dorćol`,
    robots: { index: false, follow: true },
  };
}
export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const locale = museumLocale((await searchParams).lang);
  const object = museumObjects.find((o) => o.id === id);
  if (!object) notFound();
  return (
    <MuseumFrame
      locale={locale}
      path={`/collection/${id}`}
      title={object.title[locale]}
    >
      <p>
        <a href={museumUrl('/collection', locale)}>
          {text(locale, 'Kolekcija', 'Collection', 'Коллекция')}
        </a>{' '}
        / {id}
      </p>
      <EvidenceBadge object={object} locale={locale} />
      <p className="research-lead">{object.summary[locale]}</p>
      <dl className="research-meta">
        <div>
          <dt>{text(locale, 'Period', 'Period', 'Период')}</dt>
          <dd>{object.period[locale]}</dd>
        </div>
        <div>
          <dt>{text(locale, 'Izvor', 'Source', 'Источник')}</dt>
          <dd>
            <SourceCitation object={object} locale={locale} />
          </dd>
        </div>
        <div>
          <dt>{text(locale, 'Ograničenja', 'Limitations', 'Ограничения')}</dt>
          <dd>{object.limitation[locale]}</dd>
        </div>
        <div>
          <dt>{text(locale, 'Provera', 'Verification', 'Проверка')}</dt>
          <dd>
            {text(
              locale,
              'Prema istraživačkom registru · vizuelna provera skena 14.11.2026; bez nove nezavisne potvrde.',
              'According to the research register · scan visually checked on 14 November 2026; no new independent corroboration.',
              'По исследовательскому реестру · визуальная проверка скана 14.11.2026; без нового независимого подтверждения.',
            )}
          </dd>
        </div>
        <div>
          <dt>{text(locale, 'Ilustracija', 'Illustration', 'Иллюстрация')}</dt>
          <dd>
            {text(
              locale,
              'Nije objavljena. Dozvola za reprodukciju nije potvrđena; autorstvo se ne pripisuje izdavaču.',
              'Not published. Reproduction clearance is unconfirmed; authorship is not attributed to the publisher.',
              'Не опубликована. Разрешение на воспроизведение не подтверждено; авторство не приписывается издателю.',
            )}
          </dd>
        </div>
      </dl>
      <p>
        <a href={museumUrl('/dorcol-depot', locale)}>
          {text(
            locale,
            'U kontekstu: istorija depoa',
            'In context: depot history',
            'В контексте: история депо',
          )}
        </a>
      </p>
      <RelatedExhibitions locale={locale} />
    </MuseumFrame>
  );
}
