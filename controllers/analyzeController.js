const { extractTextFromPDF } = require("../utils/extractText");
const { analyzeResumeAI } = require("../utils/aiService");

const analyzeResume = async (req, res) => {
    try {
        console.log("📥 File:", req.file);
        console.log("📝 JD:", req.body.jobDescription);

        if (!req.file) {
            return res.status(400).json({ error: "Resume file missing" });
        }

        const resumeText = await extractTextFromPDF(req.file.buffer);

        if (!resumeText) {
            return res.status(400).json({ error: "Could not read resume" });
        }

        const analysisData = await analyzeResumeAI(
            resumeText,
            req.body.jobDescription
        );

        // Ensure we have valid data or fallbacks
        const resumeScore = analysisData?.resumeScore || 0;
        const jdMatchScore = analysisData?.jdMatchScore || 0;

        res.json({
            atsScore: {
                resumeScore,
                jdMatchScore
            },
            analysis: analysisData || {}
        });
    } catch (error) {
        console.error("❌ BACKEND ERROR:", error.message);
        res.status(500).json({ error: "Resume analysis failed" });
    }
};

module.exports = { analyzeResume };
