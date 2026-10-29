import { MuseumLanding } from '@/components/museum-landing';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  return <MuseumLanding initialLocale={lang === 'sr' ? 'sr' : 'en'} />;
}
