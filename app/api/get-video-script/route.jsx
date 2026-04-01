import { NextResponse } from "next/server";
import { chatSession } from "@/configs/AiModel";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    console.log("Prompt:", prompt);

    if (!chatSession?.sendMessage) {
      throw new Error("chatSession not initialized");
    }

    const result = await chatSession.sendMessage(prompt);
    const text = result?.response?.text?.();
    if (!text) throw new Error("No response text from chatSession");

    console.log("Raw response:", text);

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text };
    }

    return NextResponse.json({ result: parsed });
  } catch (e) {
    console.error("API error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}