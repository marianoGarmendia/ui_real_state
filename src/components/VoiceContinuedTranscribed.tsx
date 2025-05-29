"use client";

import { useEffect, useRef, useImperativeHandle, useState, forwardRef } from "react";

export type VoiceTranscriberRef = {
  start: () => void;
  stop: () => void;
};

const VoiceTranscriberContinued = forwardRef(function VoiceTranscriberAutoStop(
  { onTranscription }: { onTranscription: (text: string) => void },
  ref: React.Ref<VoiceTranscriberRef>
) {
  const [recording, setRecording] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const silenceStartRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const soundThreshold = 0.5; // umbral de sonido para activar la grabación
  const silenceTimeoutMs = 3000;

 

  useImperativeHandle(ref, () => ({
    start: initMicrophoneMonitoring,
    stop: cleanup,
  }));

  const initMicrophoneMonitoring = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    console.log("Micrófono activado");
    
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    source.connect(analyser);

    audioContextRef.current = audioContext;
    sourceRef.current = source;
    analyserRef.current = analyser;

    monitorAudio(); // comienza el bucle de escucha
  };

  const monitorAudio = () => {
    console.log("Monitoreando audio...");
    
    const analyser = analyserRef.current;
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(dataArray);

    const rms = Math.sqrt(
      dataArray.reduce((acc, val) => acc + (val - 128) ** 2, 0) / dataArray.length
    );
     console.log("RMS:", rms.toFixed(2));
    const now = Date.now();

    if (rms > soundThreshold) {
      silenceStartRef.current = null;
      if (!recording) startRecording();
    } else if (recording) {
      if (silenceStartRef.current === null) {
        silenceStartRef.current = now;
      } else if (now - silenceStartRef.current > silenceTimeoutMs) {
        stopRecording();
      }
    }

    requestAnimationFrame(monitorAudio);
  };

  const startRecording = () => {
    const stream = streamRef.current;
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

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
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    silenceStartRef.current = null;
  };

  const cleanup = () => {
    stopRecording();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioContextRef.current?.close();

    streamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
    sourceRef.current = null;
    silenceStartRef.current = null;
  };

   return (
    <div className="flex justify-center items-center mt-4">
      <div
        className={`w-10 h-10 rounded-full ${
          recording ? "bg-red-500 animate-ping-slow" : "bg-gray-400"
        }`}
        title={recording ? "Grabando..." : "Inactivo"}
      />
    </div>
  );
});

export default VoiceTranscriberContinued;
