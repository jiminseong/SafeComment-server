// api/recommend.js (또는 .ts)

import { GoogleGenAI } from "@google/genai"; // GoogleGenAI 클래스를 import

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { title, userComment } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is undefined");
    return res.status(500).json({ error: "API 키가 누락되었습니다" });
  }

  const ai = new GoogleGenAI({ apiKey }); // API 키를 사용하여 인스턴스 생성

  const prompt = `
  영상 제목: ${title}
  사용자가 작성한 댓글: ${userComment}

  이 댓글을 더 긍정적이고 공감 가게 개선해줘.
  `;

  try {
    // 모델 호출
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // 사용할 모델
      contents: prompt, // 프롬프트
    });

    const text = response.text || "추천 결과 없음"; // 결과가 없을 경우 대체 텍스트

    res.status(200).json({ recommendComment: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Gemini API 호출 실패" });
  }
}
