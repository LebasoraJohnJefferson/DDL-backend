const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();
require("./utils/cron");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res, next) => {
  res.send("Welcome to intel-alumni-backend!");
});

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api", require("./routes/index"));

const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});

require("./utils/socket")(httpServer);