// // Import required modules
// import dotenv from 'dotenv';
// import fs from 'fs';
// import WebSocket from 'ws';

// // Load environment variables
// dotenv.config();
// const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
// const VOICE_ID = process.env.VOICE_ID || 'h2cd3gvcqTp";
// const MODEL_ID = 'eleven_flash_v2_5';

// const WEBSOCKET_URI = `wss://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/multi-stream-input?model_id=${MODEL_ID}`;

// // Function to send text in a specific context
// function sendTextInContext(websocket, text, contextId, voiceSettings = null) {
//   const message = {
//     text: text,
//     context_id: contextId,
//   };

//   // Only include voice_settings for the first message in a context
//   if (voiceSettings) {
//     message.voice_settings = voiceSettings;
//   }

//   websocket.send(JSON.stringify(message));
// }

// // Function to continue an existing context with more text
// function continueContext(websocket, text, contextId) {
//   websocket.send(
//     JSON.stringify({
//       text: text,
//       context_id: contextId,
//     })
//   );
// }

// // Function to flush a context, forcing generation of buffered audio
// function flushContext(websocket, contextId) {
//   websocket.send(
//     JSON.stringify({
//       context_id: contextId,
//       flush: true,
//     })
//   );
// }

// // Function to handle user interruption
// function handleInterruption(websocket, oldContextId, newContextId, newResponse) {
//   // Close the existing context that was interrupted
//   websocket.send(
//     JSON.stringify({
//       context_id: oldContextId,
//       close_context: true,
//     })
//   );

//   // Create a new context for the new response
//   sendTextInContext(websocket, newResponse, newContextId);
// }

// // Function to end the conversation and close the connection
// function endConversation(websocket) {
//   websocket.send(
//     JSON.stringify({
//       close_socket: true,
//     })
//   );
// }

// // Function to run the conversation agent demo
// async function conversationAgentDemo() {
//   // Connect to WebSocket with API key in headers
//   const websocket = new WebSocket(WEBSOCKET_URI, {
//     headers: {
//       'xi-api-key': ELEVENLABS_API_KEY,
//     },
//     maxPayload: 16 * 1024 * 1024,
//   });

//   // Set up event handlers
//   websocket.on('open', () => {
//     // Initial agent response
//     sendTextInContext(
//       websocket,
//       "Hello! I'm your virtual assistant. I can help you with a wide range of topics. What would you like to know about today?",
//       'greeting'
//     );

//     // Simulate wait time (user listening)
//     setTimeout(() => {
//       // Simulate user interruption
//       console.log("USER INTERRUPTS: 'Can you tell me about the weather?'");

//       // Handle the interruption
//       handleInterruption(
//         websocket,
//         'greeting',
//         'weather_response',
//         "I'd be happy to tell you about the weather. Currently in your area, it's 72 degrees and sunny with a slight chance of rain later this afternoon."
//       );

//       // Add more to the weather context
//       setTimeout(() => {
//         continueContext(
//           websocket,
//           " If you're planning to go outside, you might want to bring a light jacket just in case.",
//           'weather_response'
//         );

//         // Flush at the end of this turn
//         flushContext(websocket, 'weather_response');

//         // Simulate wait time (user listening)
//         setTimeout(() => {
//           // Simulate user asking another question
//           console.log("USER: 'What about tomorrow?'");

//           // Create a new context for this response
//           sendTextInContext(
//             websocket,
//             "Tomorrow's forecast shows temperatures around 75 degrees with partly cloudy skies. It should be a beautiful day overall!",
//             'tomorrow_weather'
//           );

//           // Flush and close this context
//           flushContext(websocket, 'tomorrow_weather');
//           websocket.send(
//             JSON.stringify({
//               context_id: 'tomorrow_weather',
//               close_context: true,
//             })
//           );

//           // End the conversation
//           setTimeout(() => {
//             endConversation(websocket);
//           }, 2000);
//         }, 3000);
//       }, 500);
//     }, 2000);
//   });

//   // Handle incoming messages
//   websocket.on('message', (message) => {
//     try {
//       const data = JSON.parse(message);
//       const contextId = data.contextId || 'default';

//       if (data.audio) {
//         //do stuff
//       }

//       if (data.is_final) {
//         console.log(`Context '${contextId}' completed`);
//       }
//     } catch (error) {
//       console.error('Error parsing message:', error);
//     }
//   });

//   // Handle WebSocket closure
//   websocket.on('close', () => {
//     console.log('WebSocket connection closed');
//   });

//   // Handle WebSocket errors
//   websocket.on('error', (error) => {
//     console.error('WebSocket error:', error);
//   });
// }

// // Run the demo
// conversationAgentDemo();
