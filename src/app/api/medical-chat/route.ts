import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const messages = body.messages;

  const userMessage = messages.find(msg => msg.role === 'user')?.content || '';
  const match = userMessage.match(/Model prediction:\s*(.+)/i);
  const predictedDisease = match ? match[1].trim() : null;
  console.log(predictedDisease)

  // Return a mock LLM response
  return NextResponse.json({
    message: predictedDisease,
  });
}
