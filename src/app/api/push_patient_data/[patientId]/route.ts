import { NextResponse } from 'next/server';

// Define a type for the context parameter
type RouteContext = {
  params: {
    patientId: string;
  };
};

// Define an interface for the request body
interface PatientData {
  patient_name: string;
  patient_text: string;
  medical_condition: string;
  final_recommendation: string;
  retrieved_docs: string; // Consider defining a more specific type if possible
  patient_text_verified: boolean;
  medical_condition_verified: boolean;
  final_recommendation_verified: boolean;
  retrieved_docs_verified: boolean;
  patient_text_lgtm: boolean;
  medical_condition_lgtm: boolean;
  final_recommendation_lgtm: boolean;
  retrieved_docs_lgtm: boolean;
  updated_by: string;
}

export async function POST(request: Request, context: RouteContext) {
  const { params } = context;
  const patientId = params.patientId;

  try {
    // Parse the incoming request body
    const requestBody: PatientData = await request.json();
    
    // Construct the URL with the patient ID
    const url = `https://paramjeetpradhan00-copilot.cloud.dbos.dev/api/v1/push_patient_data/${patientId}`;

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
    console.error('Error pushing patient data:', error);
    return NextResponse.json({ error: 'Failed to push patient data' }, { status: 500 });
  }
}