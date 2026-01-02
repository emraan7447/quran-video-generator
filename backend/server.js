const express = require("express");
const generateRoute = require("./routes/generate");
const app = express();
app.use(express.json());
app.use("/api", generateRoute);
app.listen(3001, () => console.log("Backend running on port 3001"));
