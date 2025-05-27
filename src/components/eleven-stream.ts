import { ElevenLabsClient, stream } from '@elevenlabs/elevenlabs-js';
import { Readable } from 'stream';

const elevenlabs = new ElevenLabsClient();

export async function streamTextSpeech(text: string) {
  const audioStream = await elevenlabs.textToSpeech.stream('h2cd3gvcqTp3m65Dysk7', {
    text: text,
    modelId: 'eleven_multilingual_v2',
    languageCode: 'es',
  });

  // option 1: play the streamed audio locally
  await stream(Readable.from(audioStream));

  // option 2: process the audio manually
  for await (const chunk of audioStream) {
    console.log(chunk);
  }
}


