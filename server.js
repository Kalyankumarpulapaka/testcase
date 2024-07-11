const express = require("express");
const dotenv = require("dotenv").config();
const path = require("path");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db"); // Ensure the path is correct
const mongoose = require('mongoose');
const cors = require('cors');

// Set Mongoose strictQuery option
mongoose.set('strictQuery', true);

const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); // Use CORS middleware

// Route for root
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Support Desk API" });
});

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));

// Serve Frontend
if (process.env.NODE_ENV === "production") {
  // Set build folder as static
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // FIX: below code fixes app crashing on refresh in deployment
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the Support Desk API" });
  });
}

// Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`);
});
