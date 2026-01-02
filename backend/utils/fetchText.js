const fetch = require("node-fetch");

module.exports = async function fetchText(surah, startAyah, endAyah) {
  const urlAr = `https://api.alquran.cloud/v1/surah/${surah}/ar.alafasy`;
  const urlUr = `https://api.alquran.cloud/v1/surah/${surah}/ur.junagarhi`;

  const [resAr, resUr] = await Promise.all([fetch(urlAr), fetch(urlUr)]);
  const dataAr = await resAr.json();
  const dataUr = await resUr.json();

  const arabicAyahs = dataAr.data.ayahs.slice(startAyah - 1, endAyah).map(a => a.text);
  const urduAyahs = dataUr.data.ayahs.slice(startAyah - 1, endAyah).map(a => a.text);

  return arabicAyahs.map((a, i) => ({ arabic: a, urdu: urduAyahs[i] }));
};
