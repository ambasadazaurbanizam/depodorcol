import content from './exhibitions.json';
import images from './exhibition-images.json';
import type { Locale } from './i18n';
export type ExhibitionLocale = Locale;
export type LocalText = Record<ExhibitionLocale, string>;
export type ExhibitionImage = (typeof images)[number];
export const locales: ExhibitionLocale[] = ['sr', 'en', 'ru'];
export const exhibitions = content.exhibitions;
export const ui = content.ui;
export const sources = content.sources;
export const allImages = images;
export const photograph = (id: string) => {
  const result = images.find((image) => image.id === id);
  if (!result) throw new Error(`Missing collection photograph: ${id}`);
  return result;
};
export const exhibitionUrl = (slug: string, locale: ExhibitionLocale) =>
  `/exhibitions/${slug}/${locale}`;
