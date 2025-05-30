// "use client";

// import { record } from "@elevenlabs/elevenlabs-js/core/schemas";
// import { on } from "events";
// import React, { useState, useRef } from "react";

// type VoiceTranscriberProps = {
//     onRecording: () => void;
//     isRecording: Boolean;
//     stopRecording: () => void;  
// }

// export default function VoiceTranscriber(props: VoiceTranscriberProps) {
// //   const [recording, setRecording] = useState(false);
// //   const [transcription, setTranscription] = useState<string | null>(null);
// //   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
// //   const audioChunksRef = useRef<Blob[]>([]);

// //   const startRecording = async () => {
// //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// //     const mediaRecorder = new MediaRecorder(stream);
// //     mediaRecorderRef.current = mediaRecorder;
// //     audioChunksRef.current = [];

// //     mediaRecorder.ondataavailable = (event) => {
// //       if (event.data.size > 0) {
// //         audioChunksRef.current.push(event.data);
// //       }
// //     };

// //     mediaRecorder.onstop = async () => {
// //       const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
// //       const formData = new FormData();
// //       formData.append("file", audioBlob, "recording.webm");

// //       try {
// //         const response = await fetch("/api/transcribe", {
// //           method: "POST",
// //           body: formData,
// //         });

// //         if (!response.ok) {
// //           throw new Error("Error en la transcripción");
// //         }

// //         const data = await response.json();
// //         setTranscription(data.text);
// //       } catch (err) {
// //         console.error(err);
// //         setTranscription("Error al transcribir");
// //       }
// //     };

// //     mediaRecorder.start();
// //     setRecording(true);
// //   };

// //   const stopRecording = () => {
// //     mediaRecorderRef.current?.stop();
// //     setRecording(false);
// //   };

//   return (
//     <div className="space-y-4">
//       <button
//         onClick={() => {
//             console.log("onRecording", props.isRecording);
            
//             props.isRecording ? props.stopRecording() : props.onRecording();}}
//         className="px-4 py-2 rounded bg-blue-600 text-white"
//       >
//         {props.isRecording ? "🎙️ Detener grabación" : "🎤 Iniciar grabación"}
//       </button>

     
      
//     </div>
//   );
// }
