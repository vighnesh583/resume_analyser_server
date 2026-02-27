// const axios = require("axios");

// const analyzeResumeAI = async (resumeText, jobDescription) => {
//   if (!process.env.HF_API_KEY) {
//     throw new Error("Missing HF_API_KEY in .env file");
//   }

//   // Prevent token limit issues
//   const truncatedResume = resumeText.slice(0, 3000);
//   const truncatedJD = jobDescription.slice(0, 1000);

//   const prompt = `
// You are an expert ATS (Applicant Tracking System) resume analyzer.

// Analyze the resume against the job description and return ONLY a valid JSON object with no additional text.
// The JSON must follow this exact structure:
// {
//   "resumeScore": <integer 0-100, based strictly on resume quality (formatting, clarity, impact) independent of JD>,
//   "jdMatchScore": <integer 0-100, based on how well the resume matches the JD (skills, experience)>,
//   "matchingSkills": ["skill1", "skill2"],
//   "missingSkills": ["skill1", "skill2"],
//   "bestRole": "<suggested job role>",
//   "strengths": ["strength1", "strength2"],
//   "weaknesses": ["weakness1", "weakness2"],
//   "suggestions": ["suggestion1", "suggestion2"]
// }

// RESUME:
// ${truncatedResume}

// JOB DESCRIPTION:
// ${truncatedJD}
// `;

//   try {
//     const response = await axios.post(
//       // "https://router.huggingface.co/v1/chat/completions",
//       // {
//       //   // model: "google/gemma-2-2b-it",
//       //   model: "microsoft/Phi-3-mini-4k-instruct",
//       "http://localhost:11434/api/generate",
//       {
//         model: "phi3",

//         messages: [
//           { role: "user", content: prompt }
//         ],
//         max_tokens: 1000
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HF_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         timeout: 60000, // 60 seconds timeout
//       }
//     );

//     const generatedText = response.data.choices?.[0]?.message?.content;

//     if (!generatedText) {
//       throw new Error("No AI output received.");
//     }

//     // Extract JSON from potential markdown code blocks
//     const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
//     if (jsonMatch) {
//       try {
//         return JSON.parse(jsonMatch[0]);
//       } catch (parseError) {
//         console.error("JSON Parse Error:", parseError);
//         throw new Error("Failed to parse AI response as JSON");
//       }
//     }

//     throw new Error("Invalid AI response format");

//   } catch (error) {
//     console.error("❌ AI Service Error:", error.response?.data || error.message);
//     return "AI service temporarily unavailable. Please try again later.";
//   }
// };

// module.exports = { analyzeResumeAI };


// const axios = require("axios");

// const analyzeResumeAI = async (resumeText, jobDescription) => {
//   if (!process.env.HF_API_KEY) {
//     throw new Error("Missing HF_API_KEY in .env file");
//   }

//   const truncatedResume = resumeText.slice(0, 3000);
//   const truncatedJD = jobDescription.slice(0, 1000);

//   const prompt = `
// You are an expert ATS resume analyzer.

// Return ONLY valid JSON in this format:
// {
//   "resumeScore": 0,
//   "jdMatchScore": 0,
//   "matchingSkills": [],
//   "missingSkills": [],
//   "bestRole": "",
//   "strengths": [],
//   "weaknesses": [],
//   "suggestions": []
// }

// RESUME:
// ${truncatedResume}

// JOB DESCRIPTION:
// ${truncatedJD}
// `;

//   try {
//     const response = await axios.post(
//       "https://api-inference.huggingface.co/models/google/flan-t5-small",
//       {
//         inputs: prompt
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HF_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         timeout: 60000,
//       }
//     );


//     const generatedText = response.data?.[0]?.generated_text;

//     if (!generatedText) {
//       throw new Error("No AI output received");
//     }

//     const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
//     if (!jsonMatch) {
//       throw new Error("Invalid JSON from AI");
//     }

//     return JSON.parse(jsonMatch[0]);

//   } catch (error) {
//     console.error("❌ AI Service Error:", error.response?.data || error.message);

//     return {
//       resumeScore: 0,
//       jdMatchScore: 0,
//       matchingSkills: [],
//       missingSkills: [],
//       bestRole: "",
//       strengths: [],
//       weaknesses: [],
//       suggestions: ["AI service unavailable. Try again later."]
//     };
//   }
// };

// module.exports = { analyzeResumeAI };




const axios = require("axios");

const analyzeResumeAI = async (resumeText, jobDescription) => {
  const truncatedResume = resumeText.slice(0, 3000);
  const truncatedJD = jobDescription.slice(0, 1000);

  const prompt = `
You are an expert ATS (Applicant Tracking System) resume analyzer.

Analyze the resume against the job description and return ONLY valid JSON.
No explanation. No markdown. No extra text.

{
  "resumeScore": 0-100,
  "jdMatchScore": 0-100,
  "matchingSkills": [],
  "missingSkills": [],
  "bestRole": "",
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}

RESUME:
${truncatedResume}

JOB DESCRIPTION:
${truncatedJD}
`;

  try {
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "phi3",
        prompt,
        stream: false
      },
      { timeout: 180000 }
    );

    const text = response.data.response;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON");

    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error("❌ Ollama Error:", error.message);
    throw new Error("Local AI analysis failed");
  }
};

module.exports = { analyzeResumeAI };
