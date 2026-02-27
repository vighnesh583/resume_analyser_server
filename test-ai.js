const { analyzeResumeAI } = require("./utils/aiService");
require("dotenv").config();

const testAI = async () => {
  console.log("🚀 Testing AI Service with Gemma-2-2b-it...");

  const resumeText = `
  John Doe
  Software Engineer
  Skills: JavaScript, React, Node.js, Express, MongoDB, Python
  Experience: 3 years building web applications.
  `;

  const jobDescription = `
  We are looking for a MERN Stack Developer.
  Must have experience with React, Node.js, and MongoDB.
  Python is a plus.
  `;

  try {
    const result = await analyzeResumeAI(resumeText, jobDescription);
    console.log("✅ AI Response received:\n", result);
  } catch (error) {
    console.error("❌ AI Test Failed:", error.message);
  }
};

testAI();
