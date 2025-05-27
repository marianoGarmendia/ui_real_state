import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
  }

  try {
    const client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY!,
    });

    const response = await client.speechToText.convert({
      modelId: "scribe_v1", // o scribe_v1_experimental
      file: file,
      languageCode: "es", // para español (opcional)
      tagAudioEvents: true,
      diarize: true,
      timestampsGranularity: "word",
    });

    return NextResponse.json({
      text: response.text,
      language: "spa",
     
      words: response.words,
    });
  } catch (error) {
    console.error("Transcripción fallida:", error);
    return NextResponse.json({ error: "Transcripción fallida" }, { status: 500 });
  }
}
