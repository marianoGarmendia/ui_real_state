// "use client";

// import { useEffect, useRef, useState } from "react";

// export default function VoiceTranscriberAutoStop({
//   onTranscription,
// }: {
//   onTranscription: (text: string) => void;
// }) {
//   const [recording, setRecording] = useState(false);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);
//   const silenceStartRef = useRef<number | null>(null);
//   const audioContextRef = useRef<AudioContext | null>(null);
//   const analyserRef = useRef<AnalyserNode | null>(null);
//   const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const silenceTimeoutMs = 3000;

//   const checkSilence = () => {
//     const analyser = analyserRef.current;
//     if (!analyser) return;

//     const dataArray = new Uint8Array(analyser.fftSize);
//     analyser.getByteTimeDomainData(dataArray);

//     const rms = Math.sqrt(
//       dataArray.reduce((acc, val) => acc + (val - 128) ** 2, 0) / dataArray.length
//     );

//     const silenceThreshold = 5; // menor RMS = menos volumen

//     if (rms < silenceThreshold) {
//       if (silenceStartRef.current === null) {
//         silenceStartRef.current = Date.now();
//       } else if (Date.now() - silenceStartRef.current > silenceTimeoutMs) {
//         stopRecording();
//       }
//     } else {
//       silenceStartRef.current = null; // hubo sonido
//     }

//     requestAnimationFrame(checkSilence);
//   };

//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     streamRef.current = stream;

//     const mediaRecorder = new MediaRecorder(stream);
//     mediaRecorderRef.current = mediaRecorder;
//     audioChunksRef.current = [];

//     const audioContext = new AudioContext();
//     const source = audioContext.createMediaStreamSource(stream);
//     const analyser = audioContext.createAnalyser();
//     analyser.fftSize = 256;

//     source.connect(analyser);
//     analyserRef.current = analyser;
//     audioContextRef.current = audioContext;
//     sourceRef.current = source;

//     mediaRecorder.ondataavailable = (e) => {
//       if (e.data.size > 0) audioChunksRef.current.push(e.data);
//     };

//     mediaRecorder.onstop = async () => {
//       const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//       const formData = new FormData();
//       formData.append("file", blob, "audio.webm");

//       try {
//         const res = await fetch("/api/transcribe", {
//           method: "POST",
//           body: formData,
//         });
//         const data = await res.json();
//         onTranscription(data.text || "[sin texto]");
//       } catch (err) {
//         console.error("Error al transcribir:", err);
//       }
//     };

//     mediaRecorder.start();
//     setRecording(true);
//     requestAnimationFrame(checkSilence);
//   };

//   const stopRecording = () => {
//     mediaRecorderRef.current?.stop();
//     streamRef.current?.getTracks().forEach((t) => t.stop());

//     audioContextRef.current?.close();
//     analyserRef.current = null;
//     sourceRef.current = null;
//     silenceStartRef.current = null;

//     setRecording(false);
//   };

//   return (
//     <div>
//       <button
//         onClick={startRecording}
//         disabled={recording}
//         className="bg-green-600 text-white px-4 py-2 rounded"
//       >
//         🎙️ Iniciar Grabación
//       </button>

//       {recording && (
//         <p className="text-sm mt-2 text-gray-700">Grabando... (silencio detiene)</p>
//       )}
//     </div>
//   );
// }

// VoiceTranscriberAutoStop.tsx
import { forwardRef, useImperativeHandle, useEffect, useRef, useState } from "react";

export type VoiceTranscriberRef = {
  start: () => void;
};

const VoiceTranscriberAutoStop = forwardRef(function VoiceTranscriberAutoStop(
  {
    onTranscription,
  }: {
    onTranscription: (text: string) => void;
  },
  ref: React.Ref<VoiceTranscriberRef>
) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceStartRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimeoutMs = 3000;

  useImperativeHandle(ref, () => ({
    start: startRecording,
  }));

  const checkSilence = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(dataArray);

    const rms = Math.sqrt(
      dataArray.reduce((acc, val) => acc + (val - 128) ** 2, 0) / dataArray.length
    );

    const silenceThreshold = 5;

    if (rms < silenceThreshold) {
      if (silenceStartRef.current === null) {
        silenceStartRef.current = Date.now();
      } else if (Date.now() - silenceStartRef.current > silenceTimeoutMs) {
        stopRecording();
      }
    } else {
      silenceStartRef.current = null;
    }

    requestAnimationFrame(checkSilence);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    source.connect(analyser);
    analyserRef.current = analyser;
    audioContextRef.current = audioContext;
    sourceRef.current = source;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", blob, "audio.webm");

      try {
        const res = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        onTranscription(data.text || "[sin texto]");
      } catch (err) {
        console.error("Error al transcribir:", err);
      }
    };

    mediaRecorder.start();
    setRecording(true);
    requestAnimationFrame(checkSilence);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());

    audioContextRef.current?.close();
    analyserRef.current = null;
    sourceRef.current = null;
    silenceStartRef.current = null;

    setRecording(false);
  };

  return (
    <div>
      <button
        onClick={startRecording}
        disabled={recording}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        🎙️ Iniciar Grabación
      </button>

      {recording && <p className="text-sm mt-2 text-gray-700">Grabando... (silencio detiene)</p>}
    </div>
  );
});

export default VoiceTranscriberAutoStop;

