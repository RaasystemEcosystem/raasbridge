import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root test route
app.get("/", (req, res) => {
  res.send("✅ RaasBridge Backend Server is running successfully!");
});

// Example POST route
app.post("/api/data", (req, res) => {
  console.log("Received data:", req.body);
  res.json({ message: "Data received successfully", data: req.body });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 RaasBridge backend running at http://localhost:${PORT}`);
});
