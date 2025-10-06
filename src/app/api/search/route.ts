import { GoogleGenerativeAI } from "@google/generative-ai";
import { trades } from "@/data/trades";
import { NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Types for the response
export type TradeMatch = {
  tradeName: string;
  matchScore: number; // 0-100
  matchReason: string;
};

export type SearchResponse = {
  overview: string;
  recommendedTrade: string;
  recommendationReason: string;
  matches: TradeMatch[];
};

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    // Prepare trades data for Gemini (simplified version)
    const tradesData = trades.map(trade => ({
      name: trade.name,
      description: trade.description,
      subcategories: trade.subcategories.map(sub => ({
        name: sub.name,
        description: sub.description
      }))
    }));

    // Create the prompt for Gemini
    const prompt = `You are a trade matching expert for a UK home services platform.

Your job is to analyze a homeowner's request and determine the most relevant trades from our database, based on the nature of the work, the likely cause of the issue, and typical UK trade responsibilities.

Query:
"${query}"

Available trades data:
${JSON.stringify(tradesData, null, 2)}

---

Your goals:
1. Understand the intent behind the user's request (for example, repair, installation, renovation, or inspection).
2. Identify the most suitable trade or trades from the provided data.
3. Provide a short, clear analysis that explains the issue or intent.
4. Recommend up to 4 trades maximum, ordered by relevance.
5. Assign realistic match scores between 0 and 100.
6. For each trade, estimate an average price range in GBP based on UK market data for that type of work.
   - Use broad, honest ranges (for example, 80–200 for small jobs, 300–800 for major repairs).
   - Express as numeric values: "low" and "high".
   - Always include "currency": "GBP".
   - Add a short "notes" field explaining what the estimate covers (for example, call-out, parts, labour).
7. If no exact match exists, choose the closest relevant trade and briefly explain why.

---

Output format (strict JSON, no markdown, no extra text):

{
  "overview": "2 to 3 sentence summary explaining what the problem likely involves and what kind of trades are suitable.",
  "recommendedTrade": "Name of the single most relevant trade",
  "recommendationReason": "Why this trade best fits the job (1 to 2 sentences)",
  "estimatedPrice": {
    "low": number,
    "high": number,
    "currency": "GBP",
    "notes": "short sentence describing what the estimate includes"
  },
  "matches": [
    {
      "tradeName": "Trade name from tradesData",
      "matchScore": number between 0 and 100,
      "matchReason": "1 sentence explaining why this trade is suitable",
      "estimatedPrice": {
        "low": number,
        "high": number,
        "currency": "GBP",
        "notes": "short description"
      }
    }
  ]
}

---

Important rules:
- Use plain English in all text fields.
- Avoid vague statements (for example, "this trade may help"); be specific about what they can do.
- Always include an estimatedPrice for both the top-level recommendation and each match.
- Never add commentary or markdown formatting.
- If the problem is unclear, recommend the most versatile trade (like "Handyman Services") and explain why.
- Make sure your JSON is valid and can be parsed directly.`;

    // Check for API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    try {
      // Get AI response
      console.log('Sending prompt to Gemini:', prompt.slice(0, 100) + '...');
      const result = await model.generateContent(prompt).catch(error => {
        console.error('Gemini API error:', error);
        if (error.message?.includes('quota')) {
          throw new Error('API quota exceeded. Please try again later.');
        }
        if (error.message?.includes('permission')) {
          throw new Error('API access denied. Please check your API key.');
        }
        if (error.message?.includes('invalid')) {
          throw new Error('Invalid API request. Please try again.');
        }
        throw new Error('Failed to connect to AI service. Please try again.');
      });

      if (!result?.response) {
        console.error('Empty response object from Gemini');
        return NextResponse.json(
          { error: 'No response received from AI. Please try again.' },
          { status: 500 }
        );
      }

      const text = result.response.text();
      if (!text?.trim()) {
        console.error('Empty text response from Gemini');
        return NextResponse.json(
          { error: 'Received empty response from AI. Please try again.' },
          { status: 500 }
        );
      }

      // Log the raw response for debugging
      console.log('Raw Gemini response:', text);

      // Try to extract JSON if response contains other text
      let jsonText = text;
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonText = text.slice(jsonStart, jsonEnd + 1);
        console.log('Extracted JSON:', jsonText);
      }

      // Parse the JSON response
      let data: SearchResponse;
      try {
        data = JSON.parse(jsonText);
        
        // Log the parsed data for debugging
        console.log('Parsed response:', data);
        
        // Validate response structure
        if (!data || typeof data !== 'object') {
          console.error('Invalid response structure:', data);
          throw new Error('Invalid response structure');
        }

        if (!data.overview || typeof data.overview !== 'string') {
          throw new Error('Missing or invalid overview');
        }

        if (!data.matches || !Array.isArray(data.matches) || data.matches.length === 0) {
          throw new Error('No matching trades found');
        }

        // Validate each match
        data.matches.forEach((match, index) => {
          if (!match.tradeName || !match.matchScore || !match.matchReason) {
            throw new Error(`Invalid match data at index ${index}`);
          }
        });

      } catch (error) {
              console.error('Failed to parse or validate Gemini response:', error);
              const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
              if (errorMessage === 'No matching trades found') {
                return NextResponse.json(
                  { error: 'No matching trades found for your query. Please try a different description.' },
                  { status: 404 }
                );
              }
              return NextResponse.json(
                { error: 'Invalid response format from AI. Please try again.' },
                { status: 500 }
              );
      }

      return NextResponse.json(data);
    } catch (error) {
      console.error('AI request failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return NextResponse.json(
        { error: errorMessage || 'Failed to get AI response. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to process search request' },
      { status: 500 }
    );
  }
}