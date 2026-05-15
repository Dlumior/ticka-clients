export type ThemeId = "ticka" | "slate-light" | "slate-dark";

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  polarity: "dark" | "light";
  cssClass: string;
}

export const THEMES: ThemeDefinition[] = [
  { id: "ticka",       label: "Ticka",      polarity: "dark",  cssClass: "theme-ticka" },
  { id: "slate-light", label: "Slate Light", polarity: "light", cssClass: "theme-slate-light" },
  { id: "slate-dark",  label: "Slate Dark",  polarity: "dark",  cssClass: "theme-slate-dark" },
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
