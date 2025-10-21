import { GoogleGenerativeAI } from "@google/generative-ai";
import { trades, homeServices } from "@/data/trades";
import { NextResponse } from "next/server";
import { SearchResult } from "@/types/search";
import { supabase } from "@/lib/supabaseClient";

// Combine all work categories
const allWorkCategories = [...trades, ...homeServices];

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Function to log search data to database
async function logSearch(query: string, response: SearchResult, request: Request) {
  try {
    if (!supabase) {
      console.warn('Supabase client not available, skipping search log');
      return;
    }

    // Extract user information from request
    const userIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Prepare search log data
    const searchLogData = {
      query,
      intent: response.intent,
      intent_reason: response.intentReason,
      overview: response.overview,
      recommended_trade: response.recommendedTrade || null,
      recommendation_reason: response.recommendationReason || null,
      confidence_score: response.confidenceScore || null,
      user_ip: userIP,
      user_agent: userAgent,
      response_data: response
    };

    // Insert into search_logs table
    const { error } = await supabase
      .from('search_logs')
      .insert([searchLogData]);

    if (error) {
      console.error('Failed to log search:', error);
    } else {
      console.log('Search logged successfully');
    }
  } catch (error) {
    console.error('Error logging search:', error);
  }
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    // Prepare trades data for Gemini (simplified version)
    const tradesData = allWorkCategories.map(trade => ({
      name: trade.name,
      description: trade.description,
      commonJobs: trade.commonJobs
    }));

    // Create the prompt for Gemini
    // Create the prompt for Gemini
const prompt = `You are a trade matching and intent detection expert for a UK home services platform.

Your job is to:
- Understand the intent behind a homeowner's request.
- Classify whether the request is a **Problem** (something is broken, not working, or needs fixing)
  or a **Project** (something planned, new, or being improved).
- Identify all relevant trades or, if it's a project, generate a clear step-by-step workflow with estimated pricing.

Intent definitions:
- "problem": Reactive or repair-based work (e.g. something leaking, broken, faulty, damaged, blocked, or not working).
- "project": Planned improvements, installations, renovations, or upgrades (e.g. install, build, replace, fit, design, add, renovate).

Query:
"${query}"

Available trades data:
${JSON.stringify(tradesData, null, 2)}

---

Your goals:
1. Detect whether this query represents a **problem** or a **project** and output it as "intent".
2. Provide a short explanation for this classification as "intentReason".

3. If intent = "problem":
   - Recommend the **single most relevant trade** and up to 4 total matches (ordered by relevance).
   - Include:
     - "recommendedTrade" and "recommendationReason"
     - "estimatedPrice" for the top trade
     - "matches" array for all relevant trades
   - Each match must include:
     - "tradeName"
     - "matchScore" (0–100)
     - "matchReason"
     - "estimatedPrice" (with "low", "high", "currency", and "notes" fields)

4. If intent = "project":
   - Do **not** include "recommendedTrade" or "matchScore".
   - Instead, include:
     - "confidenceScore" (0–100) for how confidently this matches a known project type.
     - "projectSteps" array describing the phases of work.
   - Each step must include:
     - "stepName": name of the phase (e.g. "Electrical Rough-In")
     - "stepDescription": what happens at this stage
     - "recommendedTrades": array of relevant trade names from the provided data
     - "estimatedPrice": {
         "low": number,
         "high": number,
         "currency": "GBP",
         "notes": "short text describing what the cost covers"
       }
   - The total across steps should roughly align with realistic UK pricing for that project type.

5. Always include:
   - "overview": short summary of what the work likely involves and the trades suitable.
   - Valid JSON output (no markdown, no commentary).

---

Output format (strict JSON, no markdown, no text outside the JSON):

{
  "intent": "problem" | "project",
  "intentReason": "short explanation",
  "overview": "2–3 sentence summary",

  // Only for problems:
  "recommendedTrade": "string (omit for projects)",
  "recommendationReason": "string (omit for projects)",
  "estimatedPrice": {
    "low": number,
    "high": number,
    "currency": "GBP",
    "notes": "short description"
  },
  "matches": [
    {
      "tradeName": "string",
      "matchScore": number,
      "matchReason": "string",
      "estimatedPrice": {
        "low": number,
        "high": number,
        "currency": "GBP",
        "notes": "string"
      }
    }
  ],

  // Only for projects:
  "confidenceScore": number,
  "projectSteps": [
    {
      "stepName": "string",
      "stepDescription": "string",
      "recommendedTrades": ["string", "string"],
      "estimatedPrice": {
        "low": number,
        "high": number,
        "currency": "GBP",
        "notes": "string"
      }
    }
  ]
}

---

Important rules:
- Always include "intent" and "intentReason".
- Only include "recommendedTrade", "recommendationReason", and "matchScore" if intent = "problem".
- Only include "confidenceScore" and "projectSteps" if intent = "project".
- Use realistic UK cost ranges in GBP for all pricing.
- Use plain English and ensure valid JSON output only (no markdown or extra text).
- If the request is ambiguous, default to intent = "problem" and recommend "Handyman & General Maintenance".`;


    // Check for API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    
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
      let data: SearchResult;
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

        if (!data.intent || !data.intentReason) {
          throw new Error('Missing intent classification');
        }

        // Validate based on intent type
        if (data.intent === 'problem') {
          if (!data.matches || !Array.isArray(data.matches) || data.matches.length === 0) {
            throw new Error('No matching trades found for problem');
          }

          // Validate each match
          data.matches.forEach((match, index) => {
            if (!match.tradeName || !match.matchScore || !match.matchReason) {
              throw new Error(`Invalid match data at index ${index}`);
            }
          });
        } else if (data.intent === 'project') {
          if (!data.projectSteps || !Array.isArray(data.projectSteps) || data.projectSteps.length === 0) {
            throw new Error('No project steps found for project');
          }
        }

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

      // Log the search to database (non-blocking)
      logSearch(query, data, request).catch(err => 
        console.error('Failed to log search:', err)
      );

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