export interface SkillItem {
  name: string;
  category: 'Languages' | 'Systems & Performance' | 'Backend & Architecture' | 'Platform & Tooling';
  level: number;
  years: number;
}

export type TierId = 'T5' | 'T4' | 'T3' | 'T2';

export interface TierMap {
  T5: SkillItem[];
  T4: SkillItem[];
  T3: SkillItem[];
  T2: SkillItem[];
}

const tierFor = (level: number): TierId => {
  if (level >= 5) return 'T5';
  if (level === 4) return 'T4';
  if (level === 3) return 'T3';
  return 'T2';
};

export function groupByTier(items: readonly SkillItem[]): TierMap {
  const out: TierMap = { T5: [], T4: [], T3: [], T2: [] };
  for (const item of items) out[tierFor(item.level)].push(item);
  for (const k of Object.keys(out) as TierId[]) {
    out[k].sort((a, b) => b.years - a.years);
  }
  return out;
}

export const TIER_META: Record<TierId, { label: string; note: string }> = {
  T5: { label: 'Expert', note: 'shipped repeatedly · can teach it' },
  T4: { label: 'Advanced', note: 'production-ready · on-the-job daily' },
  T3: { label: 'Proficient', note: 'working knowledge · solo on most tasks' },
  T2: { label: 'Familiar', note: 'used in projects · still sharpening' },
};
