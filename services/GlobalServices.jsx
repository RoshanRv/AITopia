import { GoogleGenAI } from "@google/genai";
import { CoachingOptions } from "./Options";
import axios from "axios";
import { ElevenLabsClient, stream } from 'elevenlabs';
import { Readable } from 'stream';

// Initialize the Gemini client using your API key from environment variables.
const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY ,
});

export const AIModel = async (topic, coachingOption, lastTwoConversation) => {
  const option = CoachingOptions.find((item) => item.name === coachingOption);
  // Create a prompt by replacing the placeholder in your option.
  const prompt = option.prompt.replace("{user_topic}", topic);

  // Combine the prompt with the conversation context.
  const conversationText = lastTwoConversation
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");
  const combinedPrompt = `${prompt}\n\n${conversationText}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: combinedPrompt,
    });
    console.log("Gemini API Response:", response.text);
    // Wrap the response to mimic the structure expected by your code.
    return { choices: [{ message: { content: response.text } }] };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

export const ConvertTextToSpeech = async (text) => {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb',
      headers: {
        'xi-api-key': 'sk_dac32a2a3a2e2d7af2cdd7485649c63697b483140f7cc3e1',
        'Content-Type': 'application/json',
      },
      params: {
        output_format: 'mp3_44100_128',
      },
      data: {
        text: text,
        model_id: 'eleven_multilingual_v2',
      },
      responseType: 'blob', // important for audio
    });

    const audioUrl = URL.createObjectURL(response.data);
    return audioUrl;

  } catch (error) {
    console.error('Error generating audio:', error.response?.data || error.message);
  }
};



