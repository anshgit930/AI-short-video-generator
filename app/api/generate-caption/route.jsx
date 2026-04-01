// 
// import { AssemblyAI } from "assemblyai";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { audioFileUrl } = await req.json();

//     const client = new AssemblyAI({
//       apiKey: process.env.CAPTION_API,
//     });

//     const data = { audio: audioFileUrl };

//     const transcript = await client.transcripts.transcribe(data);

//     // transcript.words is an array of { text, start, end, confidence }
//     const captions = transcript.words.map(word => ({
//       text: word.text,
//       start: word.start,
//       end: word.end
//     }));

//     return NextResponse.json({ captions });
//   } catch (e) {
//     console.error("Error generating captions:", e);
//     return NextResponse.json({ error: e.message || e }, { status: 500 });
//   }
// }
import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { audioFileUrl } = await req.json();

    if (!process.env.CAPTION_API) {
      throw new Error("CAPTION_API key is missing");
    }

    const client = new AssemblyAI({
      apiKey: process.env.CAPTION_API,
    });

    // 👇 REQUIRED: specify at least one speech model
    const transcript = await client.transcripts.transcribe({
      audio: audioFileUrl,
      speech_models: ["universal-2"] // or ["universal-3-pro"]
    });

    const captions = transcript.words?.map(word => ({
      text: word.text,
      start: word.start,
      end: word.end
    })) || [];

    return NextResponse.json({ captions });
  } catch (e) {
    console.error("Error generating captions:", e);
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}