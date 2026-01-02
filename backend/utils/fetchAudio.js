const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
module.exports = async function fetchAudio(surah, startAyah, endAyah, reciter){
  const reciters = { Alafasy:4, Sudais:1, Shuraim:2 };
  const reciterId = reciters[reciter] || 4;
  const folder = path.join("backend","downloads","audio");
  if(!fs.existsSync(folder)) fs.mkdirSync(folder,{recursive:true});
  let files = [];
  for(let i=startAyah;i<=endAyah;i++){
    const url = `https://cdn.islamic.network/quran/audio/128/${reciterId}/${surah}${i}.mp3`;
    const filePath = path.join(folder,`ayah${i}.mp3`);
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(filePath,Buffer.from(buffer));
    files.push(filePath);
  }
  return files;
};
