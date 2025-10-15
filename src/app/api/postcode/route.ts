import { NextRequest, NextResponse } from 'next/server';
import { getConstituencyFromPostcode } from '@/lib/postcodes';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postcode = searchParams.get('postcode');

    if (!postcode) {
      return NextResponse.json(
        { success: false, error: 'Postcode is required' },
        { status: 400 }
      );
    }

    const constituency = await getConstituencyFromPostcode(postcode);

    if (!constituency) {
      return NextResponse.json(
        { success: false, error: 'Postcode not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      constituency: {
        name: constituency.name,
        slug: constituency.slug
      }
    });
  } catch (error) {
    console.error('Postcode API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
