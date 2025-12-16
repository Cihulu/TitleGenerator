
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTitles = async (
  content: string,
  purpose: string,
  additionalRequirements?: string
): Promise<GenerationResult> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `你是一位专业的中文文案策划和编辑。
    请分析以下文本内容，并根据指定的用途完成以下三个任务：
    
    1. 生成 3 个独特的、高质量的中文标题。对于每个标题，请用一句话简要说明推荐理由。
    2. 提取 10 个最相关的中文关键词或 Hashtag 标签，用于国内平台搜索流量。
    3. 提取 10 个最相关的英文关键词 (English Keywords)，用于寻找国际化素材或图片。
    
    场景/用途: ${purpose}
    ${additionalRequirements ? `额外要求/风格偏好: ${additionalRequirements}` : ''}
    
    需要分析的内容:
    "${content}"`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "生成的中文标题" },
                  reasoning: { type: Type.STRING, description: "推荐理由" }
                },
                required: ["title", "reasoning"]
              }
            },
            keywordsCn: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "10个中文关键词"
            },
            keywordsEn: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "10个英文关键词"
            }
          },
          required: ["titles", "keywordsCn", "keywordsEn"]
        }
      },
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);
    
    // Ensure the structure matches GenerationResult
    return {
      titles: Array.isArray(parsed.titles) ? parsed.titles : [],
      keywordsCn: Array.isArray(parsed.keywordsCn) ? parsed.keywordsCn : [],
      keywordsEn: Array.isArray(parsed.keywordsEn) ? parsed.keywordsEn : []
    };

  } catch (error) {
    console.error("Generation Error:", error);
    throw new Error("生成失败，请重试。");
  }
};
