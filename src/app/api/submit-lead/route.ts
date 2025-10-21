import { NextRequest, NextResponse } from 'next/server';

// Airtable API configuration
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID; // Prefer table ID per Airtable best practices
const AIRTABLE_ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { 
      tradeName, 
      problemDescription, 
      location, 
      division, 
      contactInfo, 
      additionalInfo,
      urgency,
      timeline,
      intent,
      aiAnalysis
    } = body;

    if (!tradeName || !contactInfo?.name || !contactInfo?.email || !contactInfo?.phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID || !AIRTABLE_ACCESS_TOKEN) {
      console.error('Missing Airtable configuration');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Prepare data for Airtable
    const airtableData = {
      fields: {
        'Trade Name': tradeName,
        'Problem Description': problemDescription || '',
        'Location': location || '',
        'Division': division || '',
        'Customer Name': contactInfo.name,
        'Email': contactInfo.email,
        'Phone': contactInfo.phone,
        'Additional Info': additionalInfo || '',
        'Urgency': urgency || 'medium',
        'Timeline': timeline || '',
        'Intent': intent || 'problem',
        'AI Analysis': aiAnalysis || '',
        'Status': 'New Lead',
      },
      // Allow Airtable to coerce values to the right types (e.g. select options)
      typecast: true,
    };

    // Create record in Airtable using REST API
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        // Ask Airtable to return the created record in the response body
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(airtableData),
    });

    if (!response.ok) {
      let errorMessage = `Airtable API error: ${response.status}`;
      try {
        const errorData = await response.json();
        console.error('Airtable API error:', errorData);
        errorMessage = errorData?.error?.message || errorMessage;
      } catch {
        // ignore JSON parse errors
      }
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 502 }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      recordId: result.id,
      message: 'Lead submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting lead to Airtable:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit lead. Please try again.' 
      },
      { status: 500 }
    );
  }
}
