const express = require("express");
const {
  handleGenerateNewShortURL,
  handleGetAnalystics,
} = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateNewShortURL);

router.get("/analytics/:shortId", handleGetAnalystics);

module.exports = router;
