const express = require("express");
const router = express.Router();

const search = require("../controllers/search.js");

router.route("/search").post(search);
module.exports = router;
