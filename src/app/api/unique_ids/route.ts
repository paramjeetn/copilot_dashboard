import { NextResponse } from 'next/server';

export async function GET() {
  const response = await fetch('https://paramjeetpradhan00-copilot.cloud.dbos.dev/api/v1/unique_ids', {
    method: 'GET',
    // Add any headers if needed
  });
  const data = await response.json();
  return NextResponse.json(data);
}
