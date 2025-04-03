import axios from "axios";
import OpenAI from "openai";
import { CoachingOptions } from "./Options";

// Example function to get a token (if needed)
export const getToken = async () => {
  const result = await axios.get("/api/getToken");
  console.log("Token from GlobalServices:", result.data);
  return result.data;
};

// Make sure coachingOptions is defined or imported as needed
// For example, if it's imported from another file:
// import { coachingOptions } from "@/services/Options";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_AI_OPENROUTER,
  dangerouslyAllowBrowser: true,
});

export const AIModel = async (topic, coachingOption, msg) => {
  // Assume coachingOptions is available in this scope
  const option = CoachingOptions.find((item) => item.name === coachingOption);
  const PROMPT = option.prompt.replace("{user_topic}", topic);
  const completion = await openai.chat.completions.create({
    model: "deepseek/deepseek-chat:free",
    messages: [
      { role: "assistant", content: PROMPT },
      { role: "user", content: msg },
    ],
  });
  console.log("AI Completion:", completion.choices[0].message);
  return completion;
};
