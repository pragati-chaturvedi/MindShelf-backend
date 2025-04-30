const express = require("express");
const router = express.Router();

const getSummary = require("../controllers/getSummary.js");

router.route("/getSummary").get(getSummary);
module.exports = router;
