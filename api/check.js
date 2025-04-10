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

  악플 판단 기준:
  1. 비속어 사용
  2. 비꼬는 말투
  3. 인터넷 문화를 저해하는 분위기
  4. 사회 문화적으로 갈등을 야기하는 댓글
  5. 부정적인 시각으로만 바라보는 댓글

  등등 조금 예민한 기준으로 악플을 판단해줘
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
