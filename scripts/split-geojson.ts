import fs from 'fs/promises';
import path from 'path';
import { constituenciesMeta } from '../src/data/constituencies-meta';

interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  properties: {
    PCON24CD: string;
    PCON24NM: string;
    [key: string]: unknown;
  };
}

interface GeoJSONCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

async function splitGeoJSON() {
  try {
    // Read the main GeoJSON file
    console.log('Reading main GeoJSON file...');
    const mainFilePath = path.join(process.cwd(), 'public/data/Constituencies_July_2024_Boundaries.geojson');
    const fileContent = await fs.readFile(mainFilePath, 'utf-8');
    const data: GeoJSONCollection = JSON.parse(fileContent);
    
    console.log(`Found ${data.features.length} features`);

    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'public/data/constituencies');
    await fs.mkdir(outputDir, { recursive: true });

    // Process each constituency
    for (const constituency of constituenciesMeta) {
      // Find matching feature
      const feature = data.features.find(f => f.properties.PCON24CD === constituency.code);
      
      if (feature) {
        // Create individual GeoJSON file
        const individualGeoJSON = {
          type: "Feature",
          geometry: feature.geometry,
          properties: feature.properties
        };

        // Write to file using the slug
        const outputPath = path.join(outputDir, `${constituency.slug}.geojson`);
        await fs.writeFile(outputPath, JSON.stringify(individualGeoJSON));
        console.log(`Created ${constituency.slug}.geojson`);
      } else {
        console.warn(`No geometry found for ${constituency.name} (${constituency.code})`);
      }
    }

    // Update getConstituencyData.ts to use individual files
    const getConstituencyDataPath = path.join(process.cwd(), 'src/lib/getConstituencyData.ts');
    const newContent = `import { constituenciesMeta } from "@/data/constituencies-meta";
import { trades } from "@/data/trades";

export async function getConstituencyBySlug(slug: string) {
  const meta = constituenciesMeta.find(c => c.slug === slug);
  if (!meta) return null;

  try {
    // Load individual GeoJSON file
    const response = await fetch(\`/data/constituencies/\${slug}.geojson\`);
    const feature = await response.json();
    
    return {
      ...meta,
      geometry: feature.geometry
    };
  } catch (error) {
    console.error('Error loading constituency geometry:', error);
    return meta;
  }
}

export function getAllConstituencySlugs() {
  return constituenciesMeta.map(c => c.slug);
}

export function getAllTradeConstituencyPairs() {
  const availableTrades = trades.filter(t => t.available);
  const constituencies = constituenciesMeta;

  return availableTrades.map(trade => ({
    trade: trade.slug,
    constituency: constituencies.map(c => c.slug)
  }));
}`;

    await fs.writeFile(getConstituencyDataPath, newContent);
    console.log('Updated getConstituencyData.ts');

    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

splitGeoJSON().catch(console.error);
