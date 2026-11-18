/* oxlint-disable next/no-img-element -- Historic museum source images use controlled derivatives. */
import type { Metadata } from 'next';
import { ExhibitionHeader } from '@/components/exhibition';
import { museumLocale, museumUrl, text } from '@/lib/museum-research';
import { RelatedExhibitions } from '@/components/museum-research';
import story from '@/lib/depot-story.json';
import './depot-story.css';

export const metadata: Metadata = {
  title: 'Depo Dorćol — Grad iza kapije | Muzej javnog prevoza Beograda',
  description: 'Istorija Donjeg tramvajskog depoa, kovačnice, radionica i trolejbuskog pogona na Dorćolu.',
  robots: { index: false, follow: true }, // Until photo reproduction rights and editorial review are cleared.
};

type ImageKey = keyof typeof story.manifest;

function SourcePhoto({ photo, hero = false }: {photo: ImageKey; hero?: boolean}) {
  const image = story.manifest[photo];
  return <figure className={hero ? 'd-hero-media' : 'd-photo'}>
    <img src={`/media/depot-story/${image.file}`} alt={image.alt} loading={hero ? 'eager' : 'lazy'} />
    <figcaption>{image.caption} <span className="d-photo-source">Izvor: GSP {image.book}, PDF str. {image.pdfPage}; datum snimanja nije potvrđen.</span></figcaption>
  </figure>;
}

export default async function Page({ searchParams }: { searchParams: Promise<{lang?: string}> }) {
  const locale = museumLocale((await searchParams).lang);
  return <div className="exhibition depot-story" lang={locale}>
    <ExhibitionHeader locale={locale} languagePath="/dorcol-depot" />
    
    <main id="exhibition-main">
      <section className="d-hero" id="top"><div className="d-hero-copy"><span className="d-eyebrow">Depo Dorćol / Mesto i sećanje</span><h1>{text(locale,"Grad","A city","Город")}<br/><em>{text(locale,"iza kapije.","behind the gate.","за воротами.")}</em></h1><p className="d-subtitle">{text(locale,'Istorija mesta na kome je Beograd čuvao, popravljao i pripremao vozila za novi dan.','The story of a place where Belgrade stored, repaired and prepared vehicles for another day.','История места, где Белград хранил, ремонтировал и готовил транспорт к новому дню.')}</p><div className="d-hero-bottom"><span>1892–2026</span><span>↓</span></div></div><SourcePhoto photo="depot-yard" hero/></section>
      <div className="d-meta"><div><b>Donji depo</b><span>Istorijski tramvajski pogon</span></div><div><b>Radionice i kovačnica</b><span>Prostor tehničkog znanja i rada</span></div><div><b>Digitalna zbirka</b><span>Fizički muzej nije otvoren za posete</span></div></div>
      {locale === 'sr' ? <>
        <div className="d-container"><section className="d-intro"><div className="d-intro-mark">O priči / Uvod</div><div className="d-intro-text">{story.intro.map((p,i)=><p key={i}>{p}</p>)}</div></section>
          <div className="d-chapters">{story.chapters.map((chapter,i)=><article className="d-chapter" id={chapter.slug} key={chapter.slug}>
            <div className="d-ordinal">{String(i+1).padStart(2,'0')}<div style={{font:'12px Arial',marginTop:16,color:'var(--muted)'}}>{chapter.year}</div></div>
            <div className="d-chapter-content"><p className="d-chapter-kicker">{chapter.kicker}</p><h2>{chapter.title}</h2><div className="d-paragraphs">{chapter.paras.map((p,j)=><p key={j}>{p}</p>)}</div>
              {chapter.photos.length>0 && <div className={`d-figures ${chapter.photos.length>1?'two':''}`}>
                {chapter.photos.map(photo=><SourcePhoto key={photo} photo={photo as ImageKey}/>)}</div>}
              {chapter.slug==='forge' && <blockquote className="d-pull">Četiri nakovnja i jedna zajednička vatra — tako počinje sačuvani opis prve kovačnice.</blockquote>}
            </div></article>)}</div></div>
        <section className="d-issue" id="protection"><div className="d-container d-issue-inner"><div><div className="d-issue-label">Očuvanje industrijskog nasleđa</div><h2>Šta će grad sačuvati?</h2><span className="d-issue-number">75-239/2026</span></div>
          <div className="d-issue-body"><p>Ambasada za urbanizam je 4. septembra 2026. podnela inicijativu za stručnu identifikaciju i valorizaciju istorijskog kompleksa depoa GSP na Dorćolu.</p><p>Zavod za zaštitu spomenika kulture grada Beograda je 18. septembra potvrdio prijem inicijative pod brojem 75-239/2026 od 7. septembra 2026. godine. Naveo je da kompleks tada nije imao status kulturnog dobra niti dobra pod prethodnom zaštitom i da će stručni saradnici sprovesti istraživanja.</p><p>To nije odluka o proglašenju zaštite, već početak stručnog razmatranja vrednosti mesta.</p></div></div></section>
      </> : <div className="d-container"><section className="d-intro"><div className="d-intro-mark">{text(locale,'','Introduction','Введение')}</div><div className="d-intro-text"><p>{text(locale,'','The Serbian-language story is the current editorial master. The English translation will follow after review of historical terminology and image permissions.','Полная сербская версия подготовлена для редакционной проверки. Русский перевод добавим после сверки терминологии и прав на фотографии.')}</p><a href={museumUrl('/dorcol-depot','sr')}>{text(locale,'','Read the Serbian edition','Читать сербскую версию')}</a></div></section></div>}
      <div className="d-container"><section className="d-sources"><details><summary>{text(locale,'Izvori i napomene','Sources and notes','Источники и примечания')} ↓</summary><ol>
        <li>60 godina beogradskog javnog saobraćaja (1952), PDF str. 26, 30–33, 42.</li>
        <li>85 godina javnog gradskog saobraćaja u Beogradu (1977), PDF str. 14, 55, 57, 67.</li>
        <li>110 godina gradskog prevoza u Beogradu (2002), PDF str. 39–40, 45.</li>
        <li><a href="https://www.gsp.rs/dokumenti/muzejska_zbirka/kovacnica.pdf">GSP Beograd, Kovačnica (2015)</a>.</li>
        <li>Danas, 27–28.02.1999, str. 7.</li>
        <li>Zavod za zaštitu spomenika kulture grada Beograda, odgovor 18.09.2026, br. 75-239/2026.</li>
      </ol></details></section></div>
      <div className="d-container"><RelatedExhibitions locale={locale}/></div>
    </main><footer className="d-footer"><span>DEPO DORĆOL · MUZEJ JAVNOG PREVOZA BEOGRADA</span><span>Ambasada za urbanizam · digitalni muzejski projekat</span></footer>
  </div>;
}
