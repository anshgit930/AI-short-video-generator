
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json"
};


  export const chatSession = model.startChat({
    generationConfig,
    //safetySettings: Adjust safety settings
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Write a script to generate a 30 seconds video on topic: Interesting historical story along with AI image prompt in Realistic format for each scene. Return result in JSON format with fields imagePrompt and ContentText."
          }
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "```json\n[\n  {\n    \"imagePrompt\":\"A bustling marketplace in ancient times\"}]"
          }
        ],
      },
    ],
  });
