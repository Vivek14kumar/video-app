const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./db.cjs");
const videoRoutes = require("./routes/videos.cjs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use all routes under /
app.use("/", videoRoutes);

// Start the server after connecting to DB
connectDB().then(() => {
  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () => {
    console.log(`🚀 API running at http://127.0.0.1:${PORT}`);
  });
});
