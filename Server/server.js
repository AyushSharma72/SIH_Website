const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ConnectDb = require("./dbconnect");

const locationRoutes = require("./routes/Locationroutes");

dotenv.config();
ConnectDb();

const app = express();

app.use(express.json());

app.use(cors());

// routes

app.use("/api/v1/Location", locationRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("server running on", PORT);
});
