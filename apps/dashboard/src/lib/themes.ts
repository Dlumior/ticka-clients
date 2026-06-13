export type ThemeId = "ticka" | "pine" | "orchid" | "pacific"
                   | "admiral" | "garnet" | "grove" | "ember";

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  polarity: "dark" | "light";
  cssClass: string;
}

export const THEMES: ThemeDefinition[] = [
  { id: "ticka",   label: "Ticka",   polarity: "dark",  cssClass: "theme-ticka" },
  { id: "pine",    label: "Pine",    polarity: "dark",  cssClass: "theme-pine" },
  { id: "orchid",  label: "Orchid",  polarity: "light", cssClass: "theme-orchid" },
  { id: "pacific", label: "Pacific", polarity: "light", cssClass: "theme-pacific" },
  { id: "admiral", label: "Admiral", polarity: "dark",  cssClass: "theme-admiral" },
  { id: "garnet",  label: "Garnet",  polarity: "dark",  cssClass: "theme-garnet" },
  { id: "grove",   label: "Grove",   polarity: "light", cssClass: "theme-grove" },
  { id: "ember",   label: "Ember",   polarity: "dark",  cssClass: "theme-ember" },
];

export const DEFAULT_THEME_ID: ThemeId = "ticka";

export function getTheme(id: ThemeId): ThemeDefinition {
  const theme = THEMES.find((t) => t.id === id);
  if (!theme) throw new Error(`Unknown theme: ${id}`);
  return theme;
}

export function isThemeId(value: string | null): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}
