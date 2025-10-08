import { constituenciesMeta } from "@/data/constituencies-meta";
import { trades } from "@/data/trades";
import path from 'path';
import fs from 'fs/promises';

export async function getConstituencyBySlug(slug: string) {
  const meta = constituenciesMeta.find(c => c.slug === slug);
  if (!meta) return null;

  let geometry = null;
  let overrides = null;

  try {
    // Read the GeoJSON file directly from the filesystem
    const filePath = path.join(process.cwd(), 'public', 'data', 'constituencies', `${slug}.geojson`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const feature = JSON.parse(fileContent);
    geometry = feature.geometry;
    console.log('Loaded geometry for:', slug);
  } catch (error) {
    console.error('Error loading constituency geometry:', error);
  }

  try {
    // Try to load override data
    const overridePath = path.join(process.cwd(), 'public', 'data', 'copy-for-constituencies', `${slug}.json`);
    const overrideContent = await fs.readFile(overridePath, 'utf-8');
    const overrideData = JSON.parse(overrideContent);
    overrides = overrideData;
    console.log('Loaded overrides for:', slug);
  } catch {
    console.log('No override data found for:', slug);
  }
  
  return {
    ...meta,
    geometry,
    overrides
  };
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
}