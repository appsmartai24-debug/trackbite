import { firebaseApp } from "./lib/firebase/config";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

async function main() {
  const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
  const model = getGenerativeModel(ai, { model: "gemini-3.1-flash-lite" });

  const result = await model.generateContent("love you.");
  console.log("AI response:", result.response.text());
}

main().catch((err) => {
  console.error("Error:", err);
});