import data from './museum-research.json';
import type { ExhibitionLocale } from './exhibitions';
export const museumSources = data.sources;
export const museumObjects = data.objects;
export type MuseumObject = (typeof museumObjects)[number];
export const museumLocale = (lang?: string): ExhibitionLocale =>
  lang === 'en' || lang === 'ru' ? lang : 'sr';
export const museumUrl = (path: string, locale: ExhibitionLocale) =>
  `${path}?lang=${locale}`;
export const text = (
  locale: ExhibitionLocale,
  sr: string,
  en: string,
  ru: string,
) => ({ sr, en, ru })[locale];
