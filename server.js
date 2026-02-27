const express = require("express");
const cors = require("cors");
require("dotenv").config();

const analyzeRoutes = require("./routes/analyzeRoutes");

const app = express();

// Enable CORS for frontend
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "https://resume-analyser-ruddy-five.vercel.app/"], // Allow Vite & React default ports
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/analyze", analyzeRoutes);

// Health Check Route
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("❌ Global Error:", err.stack);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Prevent server crash on unhandled errors
process.on("uncaughtException", (err) => {
    console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("🔥 Unhandled Rejection:", err);
});
