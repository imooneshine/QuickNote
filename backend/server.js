const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Successfully connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
app.get("/", (req, res) => {
  res.send("QuickNote Backend API is running...");
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});