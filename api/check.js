import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { title, userBadComment } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is undefined");
    return res.status(500).json({ error: "API 키가 누락되었습니다" });
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
  영상 제목: ${title}
  신고하려는 댓글 :  ${userBadComment}
  악플이면 true, 악플이아니면 false 반환
  `;

  try {
    // 모델 호출
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // 사용할 모델
      contents: prompt, // 프롬프트
    });

    const text = response.text || "결과 없음";

    res.status(200).json({ result: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Gemini API 호출 실패" });
  }
}
