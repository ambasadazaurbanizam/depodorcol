import type { Metadata } from 'next';
import { MuseumFrame, ObjectSummary } from '@/components/museum-research';
import {
  museumLocale,
  museumObjects,
  museumSources,
  text,
} from '@/lib/museum-research';
export const metadata: Metadata = {
  title: 'Kolekcija / Collection | Depo Dorćol',
  robots: { index: false, follow: true },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; source?: string; type?: string }>;
}) {
  const query = await searchParams;
  const locale = museumLocale(query.lang);
  const objects = museumObjects.filter(
    (o) =>
      (!query.source || o.sourceId === query.source) &&
      (!query.type || o.type === query.type),
  );
  return (
    <MuseumFrame
      locale={locale}
      path="/collection"
      title={text(
        locale,
        'Kolekcija u nastajanju',
        'A collection in progress',
        'Коллекция в работе',
      )}
    >
      <p className="research-lead">
        {text(
          locale,
          'Deset dokumentovanih zapisa o radu i prostorima depoa. Ovo nisu potvrđeni predmeti u vlasništvu muzeja.',
          'Ten documented records about depot work and spaces. These are not confirmed physical objects owned by the museum.',
          'Десять документированных записей о работе и пространствах депо. Это не подтверждённые физические предметы в собственности музея.',
        )}
      </p>
      <form className="research-filters" action="/collection" method="get">
        <input type="hidden" name="lang" value={locale} />
        <label>
          {text(locale, 'Izvor', 'Source', 'Источник')}
          <select name="source" defaultValue={query.source ?? ''}>
            <option value="">
              {text(locale, 'Svi izvori', 'All sources', 'Все источники')}
            </option>
            {museumSources.map((s) => (
              <option value={s.id} key={s.id}>
                {s.id}
              </option>
            ))}
          </select>
        </label>
        <label>
          {text(locale, 'Vrsta zapisa', 'Record type', 'Тип записи')}
          <select name="type" defaultValue={query.type ?? ''}>
            <option value="">
              {text(locale, 'Sve vrste', 'All types', 'Все типы')}
            </option>
            <option value="documented-fact">
              {text(
                locale,
                'Dokumentovana činjenica',
                'Documented fact',
                'Документированный факт',
              )}
            </option>
            <option value="photograph-record">
              {text(
                locale,
                'Opis fotografije',
                'Photograph record',
                'Описание фотографии',
              )}
            </option>
          </select>
        </label>
        <button type="submit">
          {text(locale, 'Primeni', 'Apply', 'Применить')}
        </button>
      </form>
      <p role="status">
        {objects.length} / {museumObjects.length}{' '}
        {text(locale, 'zapisa', 'records', 'записей')}
      </p>
      {objects.length === 0 && (
        <p>
          {text(
            locale,
            'Nema zapisa za izabrane filtere.',
            'No records match the selected filters.',
            'По выбранным фильтрам записей нет.',
          )}
        </p>
      )}
      <div className="research-grid">
        {objects.map((o) => (
          <ObjectSummary key={o.id} object={o} locale={locale} />
        ))}
      </div>
    </MuseumFrame>
  );
}
