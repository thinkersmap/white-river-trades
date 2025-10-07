import fs from 'fs';
import path from 'path';
import { ConstituencyMeta } from '../src/data/types';

// Simple slugify function
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Determine region based on constituency code
function getRegion(code: string): string {
  // E = England, W = Wales, S = Scotland, N = Northern Ireland
  const prefix = code.charAt(0);
  switch (prefix) {
    case 'E':
      return 'England';
    case 'W':
      return 'Wales';
    case 'S':
      return 'Scotland';
    case 'N':
      return 'Northern Ireland';
    default:
      return 'Unknown';
  }
}

// Read the GeoJSON file
const geojsonPath = path.join(process.cwd(), 'public/data', 'Constituencies_July_2024_Boundaries.geojson');
const geojson = JSON.parse(fs.readFileSync(geojsonPath, 'utf-8'));

// Transform features into our desired format
interface GeoJSONFeature {
  properties: {
    PCON24CD: string;
    PCON24NM: string;
  };
}

const constituencies = geojson.features.map((feature: GeoJSONFeature) => {
  const name = feature.properties.PCON24NM;
  const code = feature.properties.PCON24CD;
  const region = getRegion(code);
  const slug = slugify(name);

  return {
    code,
    name,
    slug,
    region,
  } as ConstituencyMeta;
});

// Sort by name
constituencies.sort((a: ConstituencyMeta, b: ConstituencyMeta) => a.name.localeCompare(b.name));

// Example overrides - you can add more manually
const exampleOverrides: Record<string, ConstituencyMeta['overrides']> = {
  'S14000061': {
    metaTitle: 'Experienced Trades in Aberdeen South | White River',
    metaDescription: 'Aberdeen South is known for its granite homes and coastal properties — find trusted roofers, plumbers, and electricians who understand the local architecture.',
    shortDescription: 'Skilled tradespeople serving the granite city of Aberdeen South, ready for both residential and commercial work.'
  }
};

// Apply any overrides
const constituenciesWithOverrides = constituencies.map((constituency: ConstituencyMeta) => {
  const overrides = exampleOverrides[constituency.code];
  if (overrides) {
    return { ...constituency, overrides };
  }
  return constituency;
});

// Write the transformed data
const outputPath = path.join(process.cwd(), 'src/data', 'constituencies-meta.ts');
const outputContent = `// This file is auto-generated. Do not edit directly.
// Add overrides to the exampleOverrides object in scripts/generate-constituencies.ts
import { ConstituencyMeta } from './types';

export const constituenciesMeta: ConstituencyMeta[] = ${JSON.stringify(constituenciesWithOverrides, null, 2)} as const;
`;

fs.writeFileSync(outputPath, outputContent);

console.log(`Generated ${constituencies.length} constituencies in src/data/constituencies-meta.ts`);