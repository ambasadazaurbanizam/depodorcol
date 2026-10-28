import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Exhibition } from '@/components/exhibition';
import {
  exhibitions,
  locales,
  photograph,
  type ExhibitionLocale,
} from '@/lib/exhibitions';
import '../../exhibitions.css';
type Props = { params: Promise<{ slug: string; locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const ex = exhibitions.find((item) => item.slug === slug);
  if (!ex || !locales.includes(locale as ExhibitionLocale)) return {};
  const lang = locale as ExhibitionLocale;
  return {
    metadataBase: new URL('https://depodorcol.rs'),
    alternates: {
      canonical: `/exhibitions/${slug}/${lang}`,
      languages: Object.fromEntries(locales.map(code => [code, `/exhibitions/${slug}/${code}`])),
    },
    title: `${ex.title[lang]} | Depo Dorćol`,
    description: ex.deck[lang],
    robots: { index: true, follow: true },
    openGraph: {
      title: ex.title[lang],
      description: ex.deck[lang],
      type: 'article',
      images: [
        {
          url: photograph(ex.hero).variants[2].src,
          alt: photograph(ex.hero).alt[lang],
        },
      ],
      locale: { sr: 'sr_RS', en: 'en_GB', ru: 'ru_RU' }[lang],
    },
    twitter: {
      card: 'summary_large_image',
      title: ex.title[lang],
      description: ex.deck[lang],
    },
  };
}
export default async function Page({ params }: Props) {
  const { slug, locale } = await params;
  if (
    !exhibitions.some((item) => item.slug === slug) ||
    !locales.includes(locale as ExhibitionLocale)
  )
    notFound();
  return <Exhibition slug={slug} locale={locale as ExhibitionLocale} />;
}
