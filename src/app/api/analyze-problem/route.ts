import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { problem } = await request.json();

    if (!problem || !problem.trim()) {
      return NextResponse.json(
        { success: false, error: 'Problem description is required' },
        { status: 400 }
      );
    }

    // For now, return a mock analysis
    // In production, this would call your AI service
    const mockAnalysis = `This appears to be a ${problem.toLowerCase().includes('boiler') ? 'heating system' : problem.toLowerCase().includes('electrical') ? 'electrical' : problem.toLowerCase().includes('plumbing') ? 'plumbing' : 'general maintenance'} issue. The problem involves ${problem.toLowerCase().includes('won\'t turn on') ? 'a system that is not responding to activation attempts' : problem.toLowerCase().includes('noise') ? 'unusual sounds or vibrations' : problem.toLowerCase().includes('leak') ? 'water or fluid escaping from its intended containment' : 'a malfunction requiring professional assessment'}. This type of issue typically requires specialized knowledge and tools to diagnose and resolve safely.`;

    return NextResponse.json({
      success: true,
      analysis: mockAnalysis
    });
  } catch (error) {
    console.error('Analyze problem API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
