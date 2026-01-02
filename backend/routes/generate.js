const express = require("express");
const router = express.Router();
const { generateVideo } = require("../utils/ffmpeg");
router.post("/", async (req, res) => {
  const { surah, startAyah, endAyah, reciter, bg } = req.body;
  try {
    const downloadUrl = await generateVideo(surah, startAyah, endAyah, reciter, bg);
    res.json({ downloadUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating video");
  }
});
module.exports = router;
