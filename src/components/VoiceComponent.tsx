"use client";

import React, { useEffect, useState } from "react";
// import { Volume2 } from "lucide-react";


import {useVoiceChat} from "@/contexts/VoiceChatContexts";

// ElevenLabs
import { useConversation } from "@11labs/react";

// UI
// import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
// import { stat } from "fs";
// import { add } from "lodash";


const VoiceChat = () => {
  const [hasPermission,  setHasPermission] = useState(false);
  // const [isMuted, setIsMuted] = useState(true);
  const [  errorMessage,  setErrorMessage] = useState("");
  const { addMessageUser, addMessageAi, setMessagesConversation } = useVoiceChat();

  const handleRenewalConersation = async () => {
    const conversationId = await handleStartConversation();
    if(conversationId) {
      conversation.sendUserMessage("Al perecer se cortó la conexión, retomemos la conversacion desde el ultimo mensaje")
    }
    
  }
  
 console.log("errorMessage: ", errorMessage);
 console.log("hasPermission: ", hasPermission);
 
 

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");

        
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
      handleRenewalConersation();
    },
    onMessage: (message) => {
      console.log("Received message:", message);
      console.log("Message content: ", message.message ,"de: ",message.source);
      const messageId = message.message === "" ? `"do-not-render-" + ${Date.now().toString()}` : Date.now().toString();
      setMessagesConversation((prev) => [...prev, {text: message.message, source: message.source, id:messageId}]);
     if( message.source === "user" ) {
        addMessageUser({
          source: message.source ,
          text: message.message,
          id: Date.now().toString(),
        });
     }else if( message.source === "ai" ) {
        addMessageAi({
          source: message.source ,
          text: message.message,
          id: Date.now().toString(),
        });

        
     }
    },
    onError: (error: string | Error) => {
      setErrorMessage(typeof error === "string" ? error : error.message);
      console.error("Error:", error);
    },
    onUnhandledClientToolCall:(toolCall) => {
      console.log("Unhandled client tool call:", toolCall);
    },
    onDebug: (debugInfo) => {
      console.log("Debug info:", debugInfo);
      
    }    
    

    
  });

  const { status, isSpeaking } = conversation;



  useEffect(() => {
    // Request microphone permission on component mount
    const requestMicPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch (error) {
        setErrorMessage("Microphone access denied");
        console.error("Error accessing microphone:", error);
      }
    };

    requestMicPermission();
  }, []);

  const handleStartConversation = async () => {
    try {
      // Replace with your actual agent ID or URL
      const conversationId = await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!,
        

   
      });
      console.log("Started conversation:", conversationId);
      return conversationId;
    } catch (error) {
      setErrorMessage("Failed to start conversation");
      console.error("Error starting conversation:", error);
    }
  };

  // const handleEndConversation = async () => {
  //   try {
  //     await conversation.endSession();
  //   } catch (error) {
  //     setErrorMessage("Failed to end conversation");
  //     console.error("Error ending conversation:", error);
  //   }
  // };

  // const toggleMute = async () => {
  //   try {
  //      conversation.setVolume({ volume: isMuted ? 1 : 0 });
  //     setIsMuted(!isMuted);
  //   } catch (error) {
  //     setErrorMessage("Failed to change volume");
  //     console.error("Error changing volume:", error);
  //   }
  // };

  useEffect(() => {

    if(status === "disconnected") {
       const handleStartConversation= async () => {
    try {
      // Replace with your actual agent ID or URL
      const conversationId = await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!,
        

   
      });
      console.log("Started conversation:", conversationId);
      return conversationId;
    } catch (error) {
      setErrorMessage("Failed to start conversation");
      console.error("Error starting conversation:", error);
    }

  };
  handleStartConversation()
    }
    if(status === "connected") {
      console.log("snd first message");

      conversation.sendUserMessage("Hola!")
    }
   
  
  },[status, conversation]);




  return (
    <Card className="w-full rounded-full flex justify-center items-center max-w-md mx-auto">
      {/* <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Voice Chat
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMute}
              disabled={status !== "connected"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-center">
            {status === "connected" ? (
              <Button
                variant="destructive"
                onClick={handleEndConversation}
                className="w-full"
              >
                <MicOff className="mr-2 h-4 w-4" />
                End Conversation
              </Button>
            ) : (
              <Button
                onClick={handleStartConversation}
                disabled={!hasPermission}
                className="w-full"
              >
                <Mic className="mr-2 h-4 w-4" />
                Start Conversation
              </Button>
            )}
          </div> */}

        
     <div className="relative w-32 h-32 flex items-center justify-center">
      {isSpeaking && (
        <span className="absolute w-full h-full rounded-full bg-red-500 animate-ping-smooth" />
      )}
      <div
        className={`z-10 w-16 h-16 rounded-full ${
          isSpeaking ? "bg-red-600" : "bg-gray-400"
        } transition-colors duration-300`}
      />
      <style jsx>{`
        @keyframes ping-smooth {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.2;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        .animate-ping-smooth {
          animation: ping-smooth 1.2s ease-in-out infinite;
        }
      `}</style>
        
    </div>
  

          

          {/* <div className="text-center text-sm">
            {status === "connected" && (
              <p className="text-green-600">
                {isSpeaking ? "Agent is speaking..." : "Listening..."}
              </p>
            )}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {!hasPermission && (
              <p className="text-yellow-600">
                Please allow microphone access to use voice chat
              </p>
            )}
          </div> */}
        {/* </div>
      </CardContent> */}
    </Card>
  );
};

// export default function SpeakingIndicator({ isSpeaking }: { isSpeaking: boolean }) {
//   return (
//     <div className="relative flex justify-center items-center w-10 h-10">
//       <Volume2
//         className={`w-8 h-8 ${
//           isSpeaking ? "text-red-500 animate-pulse" : "text-gray-400"
//         } transition-colors duration-300`}
//       />
//     </div>
//   );
// }

export default VoiceChat;
