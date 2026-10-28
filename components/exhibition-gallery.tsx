/* oxlint-disable next/no-img-element -- Collection images use checked-in responsive derivatives and intrinsic dimensions. */
'use client';
/* oxlint-disable jsx-a11y/no-noninteractive-element-interactions -- Native modal dialog handles backdrop clicks and arrow-key navigation. */
import { useRef, useState } from 'react';
import {
  ui,
  type ExhibitionImage,
  type ExhibitionLocale,
  type LocalText,
} from '@/lib/exhibitions';
type Group = { id: string; title: LocalText; images: string[] };
export function ExhibitionGallery({
  images,
  locale,
  groups,
}: {
  images: ExhibitionImage[];
  locale: ExhibitionLocale;
  groups: Group[];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [filter, setFilter] = useState('all');
  const [activeId, setActiveId] = useState(images[0].id);
  const visible =
    filter === 'all'
      ? images
      : images.filter((image) =>
          groups
            .find((group) => group.id === filter)
            ?.images.includes(image.id),
        );
  const active = Math.max(
    0,
    visible.findIndex((image) => image.id === activeId),
  );
  const selected = visible[active];
  const t = (key: keyof typeof ui) => ui[key][locale];
  function move(offset: number) {
    setActiveId(
      visible[(active + offset + visible.length) % visible.length].id,
    );
  }
  function open(id: string) {
    setActiveId(id);
    dialog.current?.showModal();
  }
  function picture(image: ExhibitionImage, large: boolean, index: number) {
    return (
      <img
        src={image.variants[large ? 2 : 1].src}
        srcSet={image.variants.map((v) => `${v.src} ${v.width}w`).join(', ')}
        sizes={
          large
            ? '(max-width: 760px) 95vw, 75vw'
            : '(max-width: 600px) 94vw, (max-width: 1000px) 46vw, 30vw'
        }
        width={image.width}
        height={image.height}
        alt={image.alt[locale]}
        loading={large || index < 3 ? 'eager' : 'lazy'}
        fetchPriority={!large && index === 0 ? 'high' : 'auto'}
      />
    );
  }
  return (
    <section className="ex-gallery" aria-label={t('objects')}>
      <div className="ex-gallery-toolbar">
        <fieldset
          className="ex-gallery-filters"
          aria-label={t('objects')}
        >
          <button
            type="button"
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            {t('all')}
          </button>
          {groups.map((group) => (
            <button
              type="button"
              key={group.id}
              aria-pressed={filter === group.id}
              onClick={() => setFilter(group.id)}
            >
              {group.title[locale]}
            </button>
          ))}
        </fieldset>
        <p className="ex-gallery-count" aria-live="polite">
          {t('photoCount')}: {visible.length}
        </p>
      </div>
      <div className="ex-gallery-grid">
        {visible.map((image, index) => (
          <figure key={image.id}>
            <button
              className="ex-gallery-image"
              type="button"
              onClick={() => open(image.id)}
              aria-label={`${t('view')}: ${image.caption[locale]}`}
            >
              {picture(image, false, index)}
              <span aria-hidden="true">＋</span>
            </button>
            <figcaption>{image.caption[locale]}</figcaption>
          </figure>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="ex-gallery-dialog"
        aria-labelledby="photo-caption"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            move(-1);
          }
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            move(1);
          }
        }}
      >
        <div className="ex-viewer-toolbar">
          <span aria-live="polite">
            {active + 1} / {visible.length}
          </span>
          <button
            autoFocus
            type="button"
            onClick={() => dialog.current?.close()}
          >
            {t('close')} ×
          </button>
        </div>
        <div className="ex-viewer-body">
          <div className="ex-viewer-image">
            {picture(selected, true, active)}
          </div>
          <div className="ex-viewer-info">
            <p id="photo-caption">{selected.caption[locale]}</p>
            <small>Collection A. Radchenko, photo M.A.Haefliger</small>
            <details key={selected.id}>
              <summary>{t('record')}</summary>
              <dl>
                <div>
                  <dt>{t('date')}</dt>
                  <dd>
                    {selected.series === 'basel'
                      ? t('unconfirmed')
                      : t('april')}
                  </dd>
                </div>
                <div>
                  <dt>{t('place')}</dt>
                  <dd>{selected.placeLabel[locale]}</dd>
                </div>
                <div>
                  <dt>{t('type')}</dt>
                  <dd>{selected.typeLabel[locale]}</dd>
                </div>
                <div>
                  <dt>{t('filename')}</dt>
                  <dd>{selected.originalFilename}</dd>
                </div>
              </dl>
              {selected.identificationNote && (
                <p>{selected.identificationNote[locale]}</p>
              )}
            </details>
            <a href={selected.fullSize.src} target="_blank" rel="noreferrer">
              {t('original')}
            </a>
          </div>
        </div>
        <div className="ex-viewer-controls">
          <button type="button" onClick={() => move(-1)}>
            ← {t('previous')}
          </button>
          <button type="button" onClick={() => move(1)}>
            {t('next')} →
          </button>
        </div>
      </dialog>
    </section>
  );
}
