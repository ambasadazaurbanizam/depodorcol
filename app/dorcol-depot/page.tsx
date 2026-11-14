import type { Metadata } from 'next';
import {
  MuseumFrame,
  ObjectSummary,
  RelatedExhibitions,
} from '@/components/museum-research';
import {
  museumLocale,
  museumObjects,
  museumUrl,
  text,
} from '@/lib/museum-research';
export const metadata: Metadata = {
  title: 'Depo Dorćol — radni nacrt | Depo Dorćol',
  robots: { index: false, follow: true },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const locale = museumLocale((await searchParams).lang);
  const groups = [
    {
      id: 'work',
      title: text(
        locale,
        'Više od mesta za parkiranje tramvaja',
        'More than a place to park trams',
        'Больше, чем стоянка трамваев',
      ),
      intro: text(
        locale,
        'Popravke, pregledi i svakodnevno održavanje bili su nevidljivi deo gradskog saobraćaja. Knjiga iz 1952. pruža pogled u tu organizaciju rada.',
        'Repairs, inspections and everyday maintenance were the less visible side of city transport. The 1952 book offers a view of how this work was organised.',
        'Ремонт, осмотры и повседневное обслуживание были невидимой стороной городского транспорта. Книга 1952 года позволяет увидеть организацию этого труда.',
      ),
      ids: ['DOR-001', 'DOR-003'],
    },
    {
      id: 'smithy',
      title: text(
        locale,
        'Kovačnice i radionice',
        'Smithies and workshops',
        'Кузницы и мастерские',
      ),
      intro: text(
        locale,
        'Opisi stare kovačnice, nove kovačnice iz 1930. i livnice iz 1931. nisu dokaz da je reč o danas sačuvanim zgradama. Potrebni su planovi i građevinska dokumentacija.',
        'Descriptions of the old smithy, the new smithy of 1930 and the foundry of 1931 do not identify surviving buildings. Plans and construction records are still needed.',
        'Описания старой кузницы, новой кузницы 1930 года и литейной 1931 года не идентифицируют сохранившиеся здания. Нужны планы и строительные документы.',
      ),
      ids: ['DOR-004', 'DOR-007', 'DOR-009'],
    },
    {
      id: 'people',
      title: text(
        locale,
        'Ljudi koji su održavali grad u pokretu',
        'The people who kept the city moving',
        'Люди, поддерживавшие движение города',
      ),
      intro: text(
        locale,
        'Fotografija radnika važan je trag za buduća istraživanja. Imena i autorstvo tek treba utvrditi; ovde objavljujemo samo opis zapisa.',
        'The workers’ photograph is a valuable lead for further research. Names and authorship remain unresolved; only a description of the record is shown here.',
        'Фотография работников — важная отправная точка для исследования. Имена и авторство ещё предстоит установить; здесь показано только описание записи.',
      ),
      ids: ['DOR-010'],
    },
    {
      id: 'gate',
      title: text(
        locale,
        'Šta pokazuje knjiga iz 1977?',
        'What does the 1977 book show?',
        'Что показывает книга 1977 года?',
      ),
      intro: text(
        locale,
        'Potpis fotografije potvrđuje Dorćol, ali ne i tačan položaj kapije. Godina izdanja ne postaje automatski datum fotografisanja.',
        'The caption identifies Dorćol, but not the exact gate location. The publication year is not automatically the photograph date.',
        'Подпись подтверждает Дорчол, но не точное положение ворот. Год публикации не становится автоматически датой съёмки.',
      ),
      ids: ['DOR-016'],
    },
    {
      id: 'trolleybus',
      title: text(
        locale,
        'Trolejbuski depo: požar i novi objekat',
        'The trolleybus depot: fire and a new facility',
        'Троллейбусное депо: пожар и новый объект',
      ),
      intro: text(
        locale,
        'Hronika iz 2002. opisuje trolejbuski objekat. Taj podatak ne treba pretvarati u istoriju jednog nepromenjenog tramvajskog kompleksa.',
        'The 2002 chronicle describes a trolleybus facility. It should not be read as the history of one unchanged tram complex.',
        'Хроника 2002 года описывает троллейбусный объект. Эти сведения нельзя превращать в историю одного неизменного трамвайного комплекса.',
      ),
      ids: ['DOR-017', 'DOR-018', 'DOR-019'],
    },
  ];
  return (
    <MuseumFrame
      locale={locale}
      path="/dorcol-depot"
      title={text(
        locale,
        'Depo Dorćol: ljudi, radionice i otvorena pitanja',
        'Dorćol Depot: people, workshops and open questions',
        'Депо Дорчол: люди, мастерские и открытые вопросы',
      )}
    >
      <p className="research-lead">
        {text(
          locale,
          'Radni nacrt istorije depoa zasnovan na tri jubilarne publikacije. Razdvajamo dokumentovane navode od mesta i datuma koje još istražujemo.',
          'A working draft of depot history based on three anniversary publications. We distinguish documented accounts from places and dates still under investigation.',
          'Рабочий черновик истории депо по трём юбилейным изданиям. Документированные сведения отделены от мест и дат, которые ещё предстоит установить.',
        )}
      </p>
      <p className="research-limitation">
        {text(
          locale,
          'Fizički muzej još ne prima posetioce. Ova stranica nije poziv za slobodan ulazak u depo. Sadašnje stanje pojedinačnih objekata ovde nije provereno.',
          'The physical museum is not yet open to visitors. This page is not an invitation to enter the depot freely. The present condition of individual facilities has not been verified here.',
          'Физический музей пока не принимает посетителей. Эта страница не приглашает свободно входить в депо. Нынешнее состояние отдельных объектов здесь не проверено.',
        )}
      </p>
      <nav aria-label={text(locale, 'Sadržaj', 'Contents', 'Содержание')}>
        <ul>
          {groups.map((g) => (
            <li key={g.id}>
              <a href={`#${g.id}`}>{g.title}</a>
            </li>
          ))}
          <li>
            <a href="#questions">
              {text(
                locale,
                'Šta još ne znamo',
                'What we do not yet know',
                'Что ещё неизвестно',
              )}
            </a>
          </li>
        </ul>
      </nav>
      {groups.map((g) => (
        <section className="research-section" id={g.id} key={g.id}>
          <h2>{g.title}</h2>
          <p>{g.intro}</p>
          <div className="research-grid">
            {g.ids.map((id) => (
              <ObjectSummary
                key={id}
                object={museumObjects.find((o) => o.id === id)!}
                locale={locale}
              />
            ))}
          </div>
        </section>
      ))}
      <section className="research-section" id="questions">
        <h2>
          {text(
            locale,
            'Šta još ne znamo',
            'What we do not yet know',
            'Что ещё неизвестно',
          )}
        </h2>
        <p>
          {text(
            locale,
            'Gornji i Donji depo, kovačnica iz 1930. i trolejbuski objekti iz 1997/1999. nisu automatski ista zgrada ili ista parcela. Nije dokazano da su današnje zgrade podignute 1892. Tačne lokacije, kontinuitet objekata i autorstva fotografija zahtevaju dodatne dokumente.',
            'The Upper and Lower Depots, the smithy of 1930 and the trolleybus facilities of 1997/1999 are not automatically the same building or plot. The present buildings have not been proven to date to 1892. Exact locations, building continuity and photographic authorship require further documents.',
            'Верхнее и Нижнее депо, кузница 1930 года и троллейбусные объекты 1997/1999 годов не считаются одним зданием или участком. Строительство нынешних зданий в 1892 году не доказано. Точные места, преемственность построек и авторство фотографий требуют дополнительных документов.',
          )}
        </p>
        <p>
          <a href={museumUrl('/research', locale)}>
            {text(
              locale,
              'Metodologija i bibliografija',
              'Methodology and bibliography',
              'Методология и библиография',
            )}
          </a>
        </p>
      </section>
      <section className="research-section">
        <h2>
          {text(
            locale,
            'Budući dom muzeja',
            'A future home for the museum',
            'Будущий дом музея',
          )}
        </h2>
        <p>
          {text(
            locale,
            'Depo Dorćol je predložen kao budući stalni dom digitalnog muzejskog projekta. To je koncept, bez potvrde otvaranja, redovnog pristupa ili konačno dogovorenih partnerstava.',
            'Dorćol Depot is proposed as a future permanent home for the digital museum project. This is a concept, without confirmation of opening, regular access or finalised partnerships.',
            'Депо Дорчол предложено как будущий постоянный дом цифрового музейного проекта. Это концепция, без подтверждения открытия, регулярного доступа или окончательно оформленных партнёрств.',
          )}
        </p>
      </section>
      <RelatedExhibitions locale={locale} />
    </MuseumFrame>
  );
}
