import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import User from "./user.js";

const genAI = new GoogleGenerativeAI("AIzaSyANCun7o-uSswwxNT6sJA5XAC3njjb1M3g");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });
  const user = await User.find();
  const result = await chatSession.sendMessage(
    "Here is some information: [context].  Now, tell me [your question]"
  );
  console.log(result.response.text());
}

run();
