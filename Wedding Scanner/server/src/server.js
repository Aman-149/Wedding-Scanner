require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const guestRoutes = require("./routes/guestRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Wedding QR Guest Manager API running." });
});

app.use("/api", guestRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
