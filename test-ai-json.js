const { analyzeResumeAI } = require("./utils/aiService");
require("dotenv").config();

const testAIJSON = async () => {
  console.log("🚀 Testing AI Service for JSON Output...");

  const resumeText = `
  Jane Smith
  Frontend Developer
  Skills: HTML, CSS, JavaScript, React, Redux, Tailwind CSS
  Experience: 4 years creating responsive web applications.
  `;

  const jobDescription = `
  We are looking for a Frontend Developer with React and TypeScript experience.
  Knowledge of Redux and Tailwind is required.
  `;

  try {
    const result = await analyzeResumeAI(resumeText, jobDescription);
    console.log("✅ AI Response received (Type: " + typeof result + "):");
    console.log(JSON.stringify(result, null, 2));

    if (typeof result === 'object' && result.resumeScore !== undefined) {
        console.log("✅ JSON Structure Verified!");
    } else {
        console.error("❌ Invalid JSON Structure");
    }

  } catch (error) {
    console.error("❌ AI Test Failed:", error.message);
  }
};

testAIJSON();
