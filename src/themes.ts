// Every theme's colours live in CSS (editorial.css + themes.css) as tokens on
// [data-theme="<id>"]. This file only describes them for the picker, the
// command palette and the ambient background.

export type AmbientKind =
  | "dust"
  | "stars"
  | "leaves"
  | "motes"
  | "fireflies"
  | "flecks"
  | "petals";

export interface Theme {
  id: string;
  name: string;
  mode: "light" | "dark";
  /** Shown in the picker: background, accent, second accent. */
  swatch: [string, string, string];
  ambient: AmbientKind;
}

export const THEMES: Theme[] = [
  { id: "light", name: "Paper", mode: "light", swatch: ["#f3eee3", "#d9442a", "#1f5e57"], ambient: "dust" },
  { id: "dark", name: "Ink", mode: "dark", swatch: ["#15130f", "#ff6a47", "#6dbbad"], ambient: "stars" },
  { id: "sage", name: "Sage & Brass", mode: "light", swatch: ["#e7ebe1", "#8a6a2e", "#4f6b55"], ambient: "leaves" },
  { id: "terracotta", name: "Terracotta Clay", mode: "light", swatch: ["#f4e9df", "#b04a26", "#5f7356"], ambient: "motes" },
  { id: "navy", name: "Navy & Gold", mode: "dark", swatch: ["#0f1a2b", "#d4a64a", "#7fa3c6"], ambient: "fireflies" },
  { id: "emerald", name: "Emerald Marble", mode: "dark", swatch: ["#0e2420", "#c9a96e", "#7cc4a8"], ambient: "flecks" },
  { id: "blush", name: "Blush & Charcoal", mode: "light", swatch: ["#f6e8e4", "#a8434f", "#3f3b3c"], ambient: "petals" },
];

export const STORAGE_KEY = "rafi-theme";

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export function initialThemeId(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && THEMES.some((t) => t.id === saved)) return saved;
  } catch {
    /* storage blocked — fall through to the default */
  }
  return "light"; // Paper is the default for first-time visitors.
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
