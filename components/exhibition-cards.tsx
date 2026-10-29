/* oxlint-disable next/no-img-element -- Museum photographs use local responsive derivatives. */
import { exhibitions, exhibitionUrl, photograph, ui, type ExhibitionLocale } from '@/lib/exhibitions';

export function ExhibitionCards({
  locale,
  headingLevel = 2,
  className = '',
}: {
  locale: ExhibitionLocale;
  headingLevel?: 2 | 3;
  className?: string;
}) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  return (
    <div className={`exhibition-cards ${className}`}>
      {exhibitions.map((exhibition) => {
        const photo = photograph(exhibition.hero);
        const titleId = `exhibition-card-${exhibition.slug}`;
        return (
          <article className="exhibition-card" key={exhibition.slug}>
            <a href={exhibitionUrl(exhibition.slug, locale)} aria-labelledby={titleId}>
              <img
                src={photo.variants[1].src}
                srcSet={photo.variants.map((variant) => `${variant.src} ${variant.width}w`).join(', ')}
                sizes="(max-width: 760px) 92vw, 46vw"
                alt={photo.alt[locale]}
                width={photo.width}
                height={photo.height}
                loading="lazy"
              />
              <p className="exhibition-card-period">{exhibition.period[locale]}</p>
              <Heading className="exhibition-card-title" id={titleId}>{exhibition.title[locale]}</Heading>
              <p className="exhibition-card-description">{exhibition.deck[locale]}</p>
              <small className="exhibition-card-kind">{ui.draft[locale]}</small>
            </a>
          </article>
        );
      })}
    </div>
  );
}
