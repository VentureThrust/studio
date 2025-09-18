import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileBase64 } = body;

    if (!fileBase64) {
      return NextResponse.json({ error: "Missing fileBase64" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a due diligence analyst." },
        {
          role: "user",
          content: `Please generate a due diligence report for this document: ${fileBase64}`,
        },
      ],
    });

    const report =
      completion.choices?.[0]?.message?.content || "No report generated";

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Error /api/diligence/new:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
