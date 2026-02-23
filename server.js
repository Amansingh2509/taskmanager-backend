require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authroutes");
const taskRoutes = require("./routes/taskroutes");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection with caching for serverless
let cachedDb = null;

const connectToDatabase = async () => {
  // If we have a cached connection, use it
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log("Using cached MongoDB connection");
    return cachedDb;
  }

  // MongoDB connection string - Added database name 'taskmanager'
  const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb+srv://Amantask:Aman814128@cluster0.prllcn8.mongodb.net/taskmanager?retryWrites=true&w=majority";

  console.log("Connecting to MongoDB...");

  try {
    const db = await mongoose.connect(MONGODB_URI);
    cachedDb = db;
    console.log("MongoDB connected successfully");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    await connectToDatabase();
    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      message: error.message,
    });
  }
});

// Middleware to ensure DB connection before routes
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Database connection failed: " + error.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Export for Vercel serverless
module.exports = app;

// Start server only locally (not on Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5001;
  connectToDatabase().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}
