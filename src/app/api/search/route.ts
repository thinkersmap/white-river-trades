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
    const prompt = `You are a home services trade matching expert.

Your task is to analyze the user's query and match it with the most relevant trades from our database.

Query: "${query}"

Available trades data:
${JSON.stringify(tradesData, null, 2)}

Step-by-step reasoning (do not include this in the output):
1. Determine the **intent** of the query. Classify it as one of the following:
   - "installation" → user wants something fitted, added, or replaced
   - "repair" → user wants something fixed or not working
   - "maintenance" → user wants regular servicing or inspection
   - "upgrade" → user wants to improve or modernize something
   - "emergency" → urgent issue, often involving leaks, loss of power, or safety concerns

2. Identify the **object or problem** mentioned (e.g., washing machine, boiler, lighting, roof, walls, flooring, garden).

3. Match the query to the most relevant trades based on:
   - Alignment between intent and the type of work each trade performs
   - The specific problem or object mentioned
   - Realistic professional responsibility (who would actually handle this job)

4. Penalize matches that are **technically related but contextually wrong** (e.g., a kitchen fitter should not be chosen for a washing machine repair).

Respond ONLY with raw JSON in the following format:

{
  "intent": "repair | installation | maintenance | upgrade | emergency",
  "overview": "Brief analysis of what the user likely needs (2-3 sentences)",
  "recommendedTrade": "Name of the most relevant trade",
  "recommendationReason": "Why this trade is the most suitable (1-2 sentences)",
  "matches": [
    {
      "tradeName": "Trade name",
      "matchScore": number between 0-100,
      "matchReason": "Short reason why this trade fits the query"
    }
  ]
}

Guidelines:
- Return 2–4 matches, ordered by match score.
- Use realistic match scores (e.g., 90–100 = excellent, 70–89 = good, 50–69 = partial).
- Be specific about why each trade is or isn't a good fit.
- If the issue is about a household appliance, prefer trades like "Handyman Services" or "Electrical" rather than installation-focused ones like "Kitchen Fitting".`;

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