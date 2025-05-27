
"use client";

import React, { useRef ,createContext, useContext, useState } from "react";

export type Message = {
  id?: string;
  text: string;
  source?: "user" | "agent" | "ai" |string;
  timestamp?: number;
};

type VoiceChatContextType = {
  messagesVoicesUser: Message[];
  addMessageUser: (message: Message) => void;
    messagesVoicesAi: Message[];
    addMessageAi: (message: Message) => void;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    recording: boolean;
    transcription: string | null;
    setMessagesConversation:React.Dispatch<React.SetStateAction<Message[]>>;
    messagesConversation: Message[];
};



const VoiceChatContext = createContext<VoiceChatContextType | undefined>(undefined);

export const VoiceChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messagesVoicesUser, setMessagesVoicesUser] = useState<Message[]>([]);
  const [messagesVoicesAi, setMessagesVoicesAi] = useState<Message[]>([]);

   const [recording, setRecording] = useState(false);
    const [transcription, setTranscription] = useState<string | null>(null);
    const [messagesConversation, setMessagesConversation] = useState<Message[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

  const addMessageUser = (message: Message) => {
    setMessagesVoicesUser((prev) => [...prev, message]);
  };

  const addMessageAi = (message: Message) => {
    setMessagesVoicesAi((prev) => [...prev, message]);  }

    const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");

      try {
        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Error en la transcripción");
        }

        const data = await response.json();
        setTranscription(data.text);
      } catch (err) {
        console.error(err);
        setTranscription("Error al transcribir");
      }
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <VoiceChatContext.Provider value={{ messagesVoicesUser, addMessageUser, messagesVoicesAi, addMessageAi, startRecording, stopRecording, recording, transcription , setMessagesConversation, messagesConversation }}>
      {children}
    </VoiceChatContext.Provider>
  );
};

export const useVoiceChat = () : VoiceChatContextType=> {
  const context = useContext(VoiceChatContext);
  if (!context) {
    throw new Error("useVoiceChat must be used within a VoiceChatProvider");
  }
  return context;
};
