import { GoogleGenAI } from "@google/genai";

const recommendHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { title, userComment } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is undefined");
    return res.status(500).json({ error: "API 키가 누락되었습니다" });
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
영상 제목: ${title}
사용자가 작성한 댓글: ${userComment}

이 댓글을 더 긍정적이고 공감 가게 개선해줘.
댓글 형식으로 하나의 댓글만 반환하는 거야.
부가적인 설명은 하지 말고, 댓글만 출력해줘.
`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "추천 결과 없음";
    res.status(200).json({ recommendComment: text });
  } catch (error) {
    console.error("Gemini API 호출 실패:", error);
    res.status(500).json({ error: "Gemini API 호출 실패" });
  }
};

export default recommendHandler;
