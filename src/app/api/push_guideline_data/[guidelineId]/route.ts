import { NextResponse } from 'next/server';

// Define a type for the context parameter
type RouteContext = {
  params: {
    guidelineId: string;
  };
};

// Define an interface for the request body
interface GuidelineData {
  guideline_name: string;
  guideline_text: string;
  guideline_medical_condition: string;
  guideline_criteria: string;
  guideline_pdf: string;
  guideline_text_verified: boolean;
  guideline_medical_condition_verified: boolean;
  guideline_criteria_verified: boolean;
  guideline_text_lgtm: boolean;
  guideline_medical_condition_lgtm: boolean;
  guideline_criteria_lgtm: boolean;
  updated_by: string;
}

export async function POST(request: Request, context: RouteContext) {
  const { params } = context;
  const guidelineId = params.guidelineId;

  try {
    // Parse the incoming request body
    const requestBody: GuidelineData = await request.json();
    
    // Construct the URL with the guideline ID
    const url = `https://paramjeetpradhan00-copilot.cloud.dbos.dev/api/v1/push_guideline_data/${guidelineId}`;

    // Make the POST request to the external API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers if needed
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error pushing guideline data:', error);
    return NextResponse.json({ error: 'Failed to push guideline data' }, { status: 500 });
  }
}