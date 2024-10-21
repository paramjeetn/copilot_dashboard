import { NextResponse } from 'next/server';

// Define a type for the context parameter
type RouteContext = {
  params: {
    guidelineId: string;
  };
};

export async function GET(request: Request, context: RouteContext) {
  const { params } = context;
  const guidelineId = params.guidelineId;
  const response = await fetch(`https://paramjeetpradhan00-copilot.cloud.dbos.dev/api/v1/guidelines/${guidelineId}`, {
    method: 'GET',
    cache: "no-cache"
  });
  const data = await response.json();

  return NextResponse.json(data);
}