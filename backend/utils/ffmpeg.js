const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const fetchText = require("./fetchText");
const fetchAudio = require("./fetchAudio");
async function generateVideo(surah, startAyah, endAyah, reciter, bg) {
  const textData = await fetchText(surah, startAyah, endAyah);
  const audioFiles = await fetchAudio(surah, startAyah, endAyah, reciter);
  const concatList = audioFiles.map(f=>`file '${f}'`).join("\n");
  fs.writeFileSync("filelist.txt", concatList);
  await execPromise(`ffmpeg -f concat -safe 0 -i filelist.txt -c copy combined.mp3`);
  let srt = "";
  let startTime = 0;
  textData.forEach((item,i)=>{
    const endTime = startTime + 5;
    srt += `${i+1}\n00:00:${pad(startTime)},000 --> 00:00:${pad(endTime)},000\n${item.arabic}\n${item.urdu}\n\n`;
    startTime = endTime;
  });
  fs.writeFileSync("caption.srt", srt);
  const bgVideo = path.join("backend/backgrounds", bg + ".mp4");
  const output = path.join("backend/downloads", `output_${Date.now()}.mp4`);
  await execPromise(`ffmpeg -stream_loop -1 -i ${bgVideo} -i combined.mp3 -vf "subtitles=caption.srt:force_style='FontName=Arial,FontSize=36,Alignment=2'" -shortest ${output}`);
  return `/${output}`;
}
function pad(n){ return n<10?'0'+n:n; }
function execPromise(cmd){ return new Promise((res,rej)=>exec(cmd,(e,o,err)=>e?rej(err):res(o))); }
module.exports = { generateVideo };
