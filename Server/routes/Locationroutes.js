const express = require("express");
const { GetLocation , AddLocation } = require("../controllers/GetLocationController");
const router = express.Router();

router.get("/GetLocation", GetLocation);
router.post("/AddLocation", AddLocation);

module.exports = router;
