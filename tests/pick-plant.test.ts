import { describe, it, expect } from 'vitest';
import { pickPlant, validateProjectUrl, type BotanicalEntry } from '../scripts/pick-plant';

const sample: BotanicalEntry[] = [
  {
    id: 'lavender',
    name: 'Lavender',
    scientific: 'Lavandula',
    category: 'flower',
    family: 'Lamiaceae',
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    scientific: 'Helianthus',
    category: 'flower',
    family: 'Asteraceae',
    picked: true,
    projectLink: 'https://github.com/ntvu19/sunflower',
  },
];

describe('validateProjectUrl', () => {
  it('accepts http and https URLs', () => {
    expect(() => validateProjectUrl('https://github.com/ntvu19/foo')).not.toThrow();
    expect(() => validateProjectUrl('http://localhost:3000')).not.toThrow();
  });

  it('rejects invalid URLs', () => {
    expect(() => validateProjectUrl('not-a-url')).toThrow(/Invalid project URL/);
    expect(() => validateProjectUrl('ftp://example.com')).toThrow(/http or https/);
  });
});

describe('pickPlant', () => {
  it('marks an available plant as picked with a project link', () => {
    const { plants, plant } = pickPlant(sample, 'lavender', 'https://github.com/ntvu19/lavender');

    expect(plant.picked).toBe(true);
    expect(plant.projectLink).toBe('https://github.com/ntvu19/lavender');
    expect(plants.find((p) => p.id === 'lavender')).toEqual(plant);
    expect(plants.find((p) => p.id === 'sunflower')?.picked).toBe(true);
  });

  it('errors when plant id is missing', () => {
    expect(() => pickPlant(sample, 'rose', 'https://github.com/ntvu19/rose')).toThrow(
      /Plant not found/,
    );
  });

  it('errors when plant is already picked', () => {
    expect(() => pickPlant(sample, 'sunflower', 'https://github.com/ntvu19/sunflower')).toThrow(
      /already picked/,
    );
  });
});
