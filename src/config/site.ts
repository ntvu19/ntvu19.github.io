export type HeroVariant = 'split' | 'terminal' | 'centered';
export type ExperienceVariant = 'timeline' | 'cards' | 'table';
export type ProjectVariant = 'grid' | 'list' | 'expanded';
export type ThemeMode = 'light' | 'dark';
export type AccentId = 'green' | 'amber' | 'blue' | 'magenta' | 'mono';

export interface SiteConfig {
  heroVariant: HeroVariant;
  experienceVariant: ExperienceVariant;
  projectVariant: ProjectVariant;
  defaultTheme: ThemeMode;
  defaultAccent: AccentId;
}

export const site: SiteConfig = {
  heroVariant: 'split',
  experienceVariant: 'timeline',
  projectVariant: 'grid',
  defaultTheme: 'light',
  defaultAccent: 'green',
};
