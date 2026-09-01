import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export interface BotanicalEntry {
  id: string;
  name: string;
  scientific: string;
  category: string;
  family: string;
  image?: string;
  picked?: boolean;
  projectLink?: string;
}

const BOTANICAL_PATH = 'src/data/botanical.json';

export function validateProjectUrl(url: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Invalid project URL: ${url}`);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Project URL must use http or https: ${url}`);
  }
}

export function pickPlant(
  plants: BotanicalEntry[],
  plantId: string,
  projectLink: string,
): { plants: BotanicalEntry[]; plant: BotanicalEntry } {
  validateProjectUrl(projectLink);

  const index = plants.findIndex((p) => p.id === plantId);
  const plant = index === -1 ? undefined : plants[index];
  if (!plant) {
    const available = plants
      .filter((p) => !p.picked)
      .slice(0, 8)
      .map((p) => p.id)
      .join(', ');
    throw new Error(`Plant not found: "${plantId}". Example available ids: ${available}…`);
  }

  if (plant.picked) {
    throw new Error(`Plant "${plantId}" is already picked (${plant.projectLink ?? 'no link'}).`);
  }

  const updatedPlant = { ...plant, picked: true as const, projectLink };
  const updatedPlants = [...plants];
  updatedPlants[index] = updatedPlant;

  return { plants: updatedPlants, plant: updatedPlant };
}

export function listAvailablePlants(plants: BotanicalEntry[]): BotanicalEntry[] {
  return plants.filter((p) => !p.picked);
}

export function printAvailablePlants(plants: BotanicalEntry[], limit = 20): void {
  const available = listAvailablePlants(plants);
  console.log(`${available.length} available plants`);
  for (const plant of available.slice(0, limit)) {
    console.log(`  ${plant.id} — ${plant.name}`);
  }
  if (available.length > limit) console.log('  …');
}

function main(): void {
  const plantId = process.argv[2]?.trim();
  const projectLink = process.argv[3]?.trim();

  const raw = readFileSync(BOTANICAL_PATH, 'utf8');
  const plants = JSON.parse(raw) as BotanicalEntry[];

  if (plantId === '--list') {
    printAvailablePlants(plants);
    return;
  }

  if (!plantId || !projectLink) {
    console.error('Usage: tsx scripts/pick-plant.ts <plant-id> <project-url>');
    console.error('       tsx scripts/pick-plant.ts --list');
    process.exit(1);
  }

  const { plants: updated, plant } = pickPlant(plants, plantId, projectLink);

  writeFileSync(BOTANICAL_PATH, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');
  console.log(`Picked "${plant.name}" (${plant.id}) → ${plant.projectLink}`);
}

const isMain = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;
if (isMain) main();
