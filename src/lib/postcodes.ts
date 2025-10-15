import { constituenciesMeta } from '@/data/constituencies-meta';
import { toNormalised } from 'postcode';

interface PostcodeResponse {
  result: {
    parliamentary_constituency: string;
  };
}

export async function getConstituencyFromPostcode(postcode: string) {
  try {
    const start = performance.now();
    console.log('[postcodes] lookup start', { postcode });
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.warn('[postcodes] invalid postcode', { postcode });
        throw new Error("Invalid postcode");
      }
      console.error('[postcodes] lookup failed', response.status);
      throw new Error("Failed to lookup postcode");
    }

    const data = await response.json() as PostcodeResponse;
    if (!data.result?.parliamentary_constituency) {
      console.warn('[postcodes] no constituency in API result', data);
      throw new Error("No constituency found for this postcode");
    }

    // Find the constituency in our metadata
    const constituency = constituenciesMeta.find(
      c => c.name === data.result.parliamentary_constituency
    );

    if (!constituency) {
      console.warn('[postcodes] constituency not in local metadata', data.result.parliamentary_constituency);
      throw new Error("Constituency not found in our database");
    }

    console.log('[postcodes] lookup success', constituency, `in ${Math.round(performance.now()-start)}ms`);
    return {
      name: constituency.name,
      slug: constituency.slug
    };
  } catch (error) {
    console.error('[postcodes] lookup error', error);
    throw error instanceof Error ? error : new Error("Failed to lookup postcode");
  }
}

export function formatPostcode(raw: string | null | undefined): string {
  if (!raw) return "Postcode unavailable";
  try {
    const normalised = toNormalised(String(raw));
    return normalised ?? "Postcode unavailable";
  } catch {
    return "Postcode unavailable";
  }
}