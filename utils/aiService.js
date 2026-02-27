const axios = require("axios");

const analyzeResumeAI = async (resumeText, jobDescription) => {
  if (!process.env.HF_API_KEY) {
    throw new Error("Missing HF_API_KEY in .env file");
  }

  // Prevent token limit issues
  const truncatedResume = resumeText.slice(0, 3000);
  const truncatedJD = jobDescription.slice(0, 1000);

  const prompt = `
You are an expert ATS (Applicant Tracking System) resume analyzer.

Analyze the resume against the job description and return ONLY a valid JSON object with no additional text.
The JSON must follow this exact structure:
{
  "resumeScore": <integer 0-100, based strictly on resume quality (formatting, clarity, impact) independent of JD>,
  "jdMatchScore": <integer 0-100, based on how well the resume matches the JD (skills, experience)>,
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "bestRole": "<suggested job role>",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2"]
}

RESUME:
${truncatedResume}

JOB DESCRIPTION:
${truncatedJD}
`;

  try {
    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "google/gemma-2-2b-it",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 1000
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000, // 60 seconds timeout
      }
    );

    const generatedText = response.data.choices?.[0]?.message?.content;

    if (!generatedText) {
      throw new Error("No AI output received.");
    }

    // Extract JSON from potential markdown code blocks
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    throw new Error("Invalid AI response format");

  } catch (error) {
    console.error("❌ AI Service Error:", error.response?.data || error.message);
    
    // Return a fallback object instead of throwing to prevent 500 errors on frontend
    return {
      resumeScore: 0,
      jdMatchScore: 0,
      matchingSkills: [],
      missingSkills: [],
      bestRole: "N/A",
      strengths: [],
      weaknesses: [],
      suggestions: ["AI service temporarily unavailable. Please try again later."]
    };
  }
};

module.exports = { analyzeResumeAI };
