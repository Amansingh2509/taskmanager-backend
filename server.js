require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authroutes");
const taskRoutes = require("./routes/taskroutes");

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Export for Vercel serverless
module.exports = app;

// Start server only locally (not on Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5001;

  const connectDB = async () => {
    try {
      await mongoose.connect(
        "mongodb+srv://Amantask:Aman814128@cluster0.prllcn8.mongodb.net/?retryWrites=true&w=majority",
      );
      console.log("MongoDB connected");
    } catch (error) {
      console.log("MongoDB connection error:", error.message);
    }
  };

  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}
