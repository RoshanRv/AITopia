import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
console.log(
  "NEXT_PUBLIC_GEMINI_API_KEY",
  process.env.NEXT_PUBLIC_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



export async function generateStory({
  topic,
  maxNbPanels,
  previousPanel,
}) {
  try {
    const nbPanelsToGenerate = 2;
    const existingPanels = previousPanel || [];

    const existingPanelsTemplate = existingPanels.length
      ? ` To help you, here are the previous panels and their captions (note: if you see an anomaly here eg. no caption or the same description repeated multiple times, do not hesitate to fix the story): ${JSON.stringify(
          existingPanels,
          null,
          2
        )} and topic is ${topic}.`
      : "";
  
   
    const firstNextOrLast =
      existingPanels.length === 0
        ? "first"
        : maxNbPanels- existingPanels.length === maxNbPanels
        ? "last"
        : "next";

    const query = `
          You are a writer specialized in Science and Education. Create a 4-panel comic story about the topic: ${topic}. Use the context below to ensure technical accuracy.  
  

Instructions:  
1. Write a story that integrates technical terms (e.g., "photosynthesis," "algorithm") naturally into dialogue or narration.  
2. Set the story in real-world scenarios (e.g., science labs, coding competitions, engineering projects).  
3. Use a professional and engaging tone, avoiding overly simplistic or childish language.  

For the ${firstNextOrLast} ${nbPanelsToGenerate} panels (out of 4 total):  
- Provide detailed drawing instructions (character gender, age, clothing, location, visual cues for technical concepts).  
- Write captions that include 1-2 technical terms from the context.  
- Ensure continuity with the broader story (${maxNbPanels} panels total). 
          output format must be : 
            (Json)
            [
              {
            "panel": ${existingPanels.length + 1},
            "instructions": string,
            "caption": string
            },
            {
            "panel": ${existingPanels.length + 2},
            "instructions": string,
            "caption": string
            }
      },
      {
        role: "user",
        content: The story is about: ${prompt}.${existingPanelsTemplate}
      }`;

    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();
    const cleanText = text
      .trim()
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();
    const jsonData = JSON.parse(cleanText);

    return jsonData;
  } catch (error) {
    console.error("Error generating assessment:", error);
    return {
      message: "Error generating assessment",
      error: error.message || "Unknown error",
    };
  }
}

