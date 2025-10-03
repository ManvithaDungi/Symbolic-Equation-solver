// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const mathRoutes = require("./routes/math");
const plot3dRoutes = require("./routes/plot3d");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/math", mathRoutes);
app.use("/api/plot3d", plot3dRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Math solver backend running 🚀" });
});

// Serve frontend build (optional)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
