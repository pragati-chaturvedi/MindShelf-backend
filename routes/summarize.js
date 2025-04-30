const express = require("express");
const router = express.Router();

const summarize = require("../controllers/summarize.js");

router.route("/summarize").post(summarize);
module.exports = router;
