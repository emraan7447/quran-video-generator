const express = require("express");
const generateRoute = require("./routes/generate");
const path = require("path");
const app = express();

app.use(express.json());
app.use("/api/generate", generateRoute);

// Serve generated downloads
app.use("/downloads", express.static(path.join(__dirname, "downloads")));

// Use Render/Heroku port or fallback
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
