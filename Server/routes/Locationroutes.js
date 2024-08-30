const express = require("express");
const { GetLocation } = require("../controllers/GetLocationController");
const router = express.Router();

router.get("/GetLocation", GetLocation);

module.exports = router;
