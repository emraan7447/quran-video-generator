import { useState } from "react";
export default function Home() {
  const [surah, setSurah] = useState("1");
  const [startAyah, setStartAyah] = useState("1");
  const [endAyah, setEndAyah] = useState("1");
  const [reciter, setReciter] = useState("Alafasy");
  const [bg, setBg] = useState("mosque");
  const handleGenerate = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surah, startAyah, endAyah, reciter, bg }),
    });
    const data = await res.json();
    window.location.href = data.downloadUrl;
  };
  return (
    <div>
      <h1>Qur’an Video Generator</h1>
      <label>Surah: <input value={surah} onChange={e=>setSurah(e.target.value)} /></label>
      <label>Start Ayah: <input value={startAyah} onChange={e=>setStartAyah(e.target.value)} /></label>
      <label>End Ayah: <input value={endAyah} onChange={e=>setEndAyah(e.target.value)} /></label>
      <label>Reciter: 
        <select value={reciter} onChange={e=>setReciter(e.target.value)}>
          <option>Alafasy</option>
          <option>Sudais</option>
          <option>Shuraim</option>
        </select>
      </label>
      <label>Background: 
        <select value={bg} onChange={e=>setBg(e.target.value)}>
          <option>mosque</option>
          <option>nature</option>
          <option>sky</option>
        </select>
      </label>
      <button onClick={handleGenerate}>Generate Video</button>
    </div>
  );
}
