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

  이 댓글을 악플이야, 이걸 발견하게 된 사용자가 위로받을 수 있도록 2~3줄의 위로글을 작성해줘
  악플이 아니리면 "false"만을 반환해줘, 악플이라면 그저 위로글만 작성해주면 돼

  무엇보다, 마크다운 없이 텍스트만으로 구성되도록 해주고, 따뜻한 문체로 작성해줘
  그리고 사용자는 제작자일수도, 그저 시청자 일수도 있어 그래서 제작자라면~, 시청자라면~ 이런식으로 2가지로 나눠서 표현해줘

  
  `;

  try {
    // 모델 호출
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // 사용할 모델
      contents: prompt, // 프롬프트
    });

    const text = response.text || "추천 결과 없음"; // 결과가 없을 경우 대체 텍스트

    res.status(200).json({ comfortText: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Gemini API 호출 실패" });
  }
}
