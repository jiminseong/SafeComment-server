// api/recommend.js (또는 .ts)

import { GoogleGenerativeAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { title, userComment } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is undefined");
    return res.status(500).json({ error: "API 키가 누락되었습니다" });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // 또는 chat-bison-001

    const prompt = `
    영상 제목: ${title}
    사용자가 작성한 댓글: ${userComment}

    이 댓글을 더 긍정적이고 공감 가게 개선해줘.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "추천 결과 없음";

    res.status(200).json({ recommendComment: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Gemini API 호출 실패" });
  }
}
