// import { ElevenLabsClient } from "elevenlabs";
// const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || ""
// console.log(`Using ElevenLabs API Key: ${ELEVENLABS_API_KEY}`);


// const client = new ElevenLabsClient({ apiKey: "sk_1b774a391a250d625dd435af78208aafdbb7a483c4e749da" });
// const response = await client.textToSpeech.convert("h2cd3gvcqTp3m65Dysk7", {
//     output_format: "mp3_44100_128",
//     text: "Hola buenops dias soy carla de la inmobiliaria MYM, ¿en qué puedo ayudarte hoy?",
//     model_id: "eleven_multilingual_v2"
// });


// console.dir(response, { depth: null });

// export async function readableStreamToBlob(stream: ReadableStream<Uint8Array>, mimeType = 'audio/mpeg'): Promise<Blob> {
//   const reader = stream.getReader();
//   const chunks = [];

//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) break;
//     chunks.push(value);
//   }

//   return new Blob(chunks, { type: mimeType });
// }

// readableStreamToBlob(response, 'audio/mpeg')



// para cuando es streaming

// import { ElevenLabsClient, stream } from '@elevenlabs/elevenlabs-js';
// import { Readable } from 'stream';

// const elevenlabs = new ElevenLabsClient();

// async function main() {
//   const audioStream = await elevenlabs.textToSpeech.stream('JBFqnCBsd6RMkjVDRZzb', {
//     text: 'This is a test',
//     modelId: 'eleven_multilingual_v2',
//   });

//   // option 1: play the streamed audio locally
//   await stream(Readable.from(audioStream));

//   // option 2: process the audio manually
//   for await (const chunk of audioStream) {
//     console.log(chunk);
//   }
// }

// main();

// const voiceID = "h2cd3gvcqTp3m65Dysk7"

// const synthesize = async (text: string) => {
//   const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceID}`, {
//     method: "POST",
//     headers: {
//       "Accept": "audio/mpeg",
//       "Content-Type": "application/json",
//       "xi-api-key": process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY!,
//     },
//     body: JSON.stringify({
//       text,
//       voice_settings: {
        
//         stability: 0.5,
//         similarity_boost: 0.75,
//       },
//     }),
//   });

//   const blob = await response.blob();
//   const audioUrl = URL.createObjectURL(blob);
//   const audio = new Audio(audioUrl);
//   audio.play();
// };


// synthesize("Hola, buen día. Soy Carla de la inmobiliaria MYM. ¿En qué puedo ayudarte hoy?").catch(console.error);

