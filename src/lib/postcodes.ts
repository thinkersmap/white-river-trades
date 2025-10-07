import { constituenciesMeta } from '@/data/constituencies-meta';

interface PostcodeResponse {
  result: {
    parliamentary_constituency: string;
  };
}

export async function getConstituencyFromPostcode(postcode: string) {
  try {
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Invalid postcode");
      }
      throw new Error("Failed to lookup postcode");
    }

    const data = await response.json() as PostcodeResponse;
    if (!data.result?.parliamentary_constituency) {
      throw new Error("No constituency found for this postcode");
    }

    // Find the constituency in our metadata
    const constituency = constituenciesMeta.find(
      c => c.name === data.result.parliamentary_constituency
    );

    if (!constituency) {
      throw new Error("Constituency not found in our database");
    }

    return {
      name: constituency.name,
      slug: constituency.slug
    };
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to lookup postcode");
  }
}