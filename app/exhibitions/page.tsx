/* oxlint-disable next/no-img-element -- Collection images use checked-in responsive derivatives and intrinsic dimensions. */
import type { Metadata } from 'next';
import { ExhibitionHeader } from '@/components/exhibition';
import { ExhibitionCards } from '@/components/exhibition-cards';
import {
  locales,
  ui,
  type ExhibitionLocale,
} from '@/lib/exhibitions';
import './exhibitions.css';
export const metadata: Metadata = {
  title: 'Izložbe / Exhibitions | Depo Dorćol',
  description:
    'Two photographic exhibitions from Belgrade’s public transport collection.',
  robots: { index: true, follow: true },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale: ExhibitionLocale = locales.includes(lang as ExhibitionLocale)
    ? (lang as ExhibitionLocale)
    : 'sr';
  return (
    <div className="exhibition" lang={locale}>
      <ExhibitionHeader locale={locale} />
      <main id="exhibition-main">
        <div className="ex-draft">{ui.draftNotice[locale]}</div>
        <div className="ex-index-heading">
          <h1>{ui.exhibitions[locale]}</h1>
          <p>{ui.indexIntro[locale]}</p>
        </div>
        <ExhibitionCards locale={locale} className="ex-index-grid" />
        <p className="ex-index-status">{ui.closed[locale]}</p>
      </main>
    </div>
  );
}
