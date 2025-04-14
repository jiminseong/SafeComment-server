import express from "express";
import dotenv from "dotenv";
import checkHandler from "./api/checkHandler.js";
import comfortHandler from "./api/comfortHandler.js";
import recommendHandler from "./api/recommendHandler.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.post("/api/check", checkHandler);
app.post("/api/comfort", comfortHandler);
app.post("/api/recommend", recommendHandler);

app.get("/", (req, res) => {
  res.send("✅ SafeComment Gemini API 서버가 실행 중입니다.");
});

app.listen(PORT, () => {
  console.log(`🚀 SafeComment 서버 실행 중 → http://localhost:${PORT}`);
});
