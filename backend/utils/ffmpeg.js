const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const fetchText = require("./fetchText");
const fetchAudio = require("./fetchAudio");

async function generateVideo(surah, startAyah, endAyah, reciter, bg) {
  const textData = await fetchText(surah, startAyah, endAyah);
  const audioFiles = await fetchAudio(surah, startAyah, endAyah, reciter);

  // Create list for concatenation
  const concatList = audioFiles.map(f => `file '${f}'`).join("\n");
  fs.writeFileSync("filelist.txt", concatList);

  // Combine audio
  await execPromise(`ffmpeg -f concat -safe 0 -i filelist.txt -c copy combined.mp3`);

  // Create subtitles file
  let srt = "";
  let startTime = 0;
  textData.forEach((item, i) => {
    const endTime = startTime + 5; // ~5 seconds per ayah (adjust if needed)
    srt += `${i + 1}\n00:00:${pad(startTime)},000 --> 00:00:${pad(endTime)},000\n${item.arabic}\n${item.urdu}\n\n`;
    startTime = endTime;
  });
  fs.writeFileSync("caption.srt", srt);

  // Background
  const bgVideo = path.join("backend", "backgrounds", `${bg}.mp4`);
  const outputName = `quran_${surah}_${startAyah}_${endAyah}_${Date.now()}.mp4`;
  const outputPath = path.join("backend", "downloads", outputName);

  // FFmpeg command (vertical 1080x1920)
  await execPromise(
    `ffmpeg -stream_loop -1 -i "${bgVideo}" -i combined.mp3 ` +
    `-vf "subtitles=caption.srt:force_style='FontName=Arial,FontSize=48,Alignment=2',scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" ` +
    `-shortest "${outputPath}"`
  );

  return `https://${process.env.BACKEND_DOMAIN}/downloads/${outputName}`;
}

function pad(n) { return n < 10 ? "0" + n : n; }

function execPromise(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) reject(stderr || error);
      else resolve(stdout);
    });
  });
}

module.exports = { generateVideo };
