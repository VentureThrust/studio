import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fileBase64 } = req.body;

    if (!fileBase64) {
      return res.status(400).json({ error: "No file received" });
    }

    // Ask GPT to analyze the file directly
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert in due diligence. Generate structured reports.",
        },
        {
          role: "user",
          content: `Analyze the following company document (base64 encoded) and create a due diligence report covering financials, risks, compliance, and legal aspects:\n\n${fileBase64}`,
        },
      ],
    });

    const report = completion.choices[0].message?.content || "No report generated";
    res.status(200).json({ report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Processing failed" });
  }
}
