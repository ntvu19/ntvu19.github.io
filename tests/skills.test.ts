import { describe, it, expect } from 'vitest';
import { groupByTier, type SkillItem } from '../src/scripts/skills';

const items: SkillItem[] = [
  { name: 'C++', category: 'Languages', level: 5, years: 3 },
  { name: 'TypeScript', category: 'Languages', level: 4, years: 3 },
  { name: 'Java', category: 'Languages', level: 3, years: 2 },
  { name: 'Go', category: 'Languages', level: 2, years: 1 },
  { name: 'Rust', category: 'Languages', level: 1, years: 1 },
];

describe('groupByTier', () => {
  it('groups by T5 (5), T4 (4), T3 (3), T2 (1-2)', () => {
    const tiers = groupByTier(items);
    expect(tiers.T5.map((i) => i.name)).toEqual(['C++']);
    expect(tiers.T4.map((i) => i.name)).toEqual(['TypeScript']);
    expect(tiers.T3.map((i) => i.name)).toEqual(['Java']);
    expect(tiers.T2.map((i) => i.name)).toEqual(['Go', 'Rust']);
  });

  it('sorts within tier by years desc', () => {
    const list: SkillItem[] = [
      { name: 'A', category: 'Languages', level: 5, years: 1 },
      { name: 'B', category: 'Languages', level: 5, years: 5 },
      { name: 'C', category: 'Languages', level: 5, years: 3 },
    ];
    expect(groupByTier(list).T5.map((i) => i.name)).toEqual(['B', 'C', 'A']);
  });
});
