
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the GoogleGenAI client using the process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateContentRefinement = async (text: string, context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Контекст: Вы помогаете Светлане Анатольевне Кручине (директор школы и учитель английского языка) улучшить её профессиональное портфолио для конкурса "Директор года — 2026".
      Задача: Перепишите следующий текст, чтобы он звучал максимально профессионально, лидерски и вдохновляюще. Используйте терминологию современного менеджмента и образования.
      Тема: ${context}
      Исходный текст: ${text}
      ОТВЕЧАЙТЕ ТОЛЬКО НА РУССКОМ ЯЗЫКЕ.`,
      config: {
        // Removed maxOutputTokens to prevent potential truncation and follow guidelines.
        temperature: 0.7,
      }
    });
    // The response.text property directly returns the generated string.
    return response.text || text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return text;
  }
};

export const generateLessonIdea = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Создайте план урока английского языка на тему: "${topic}" для продвинутого уровня. Урок должен иметь лидерский уклон. ОТВЕЧАЙТЕ НА РУССКОМ ЯЗЫКЕ.`,
      config: {
        // Using thinkingConfig for better reasoning with gemini-3-pro-preview.
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });
    // The response.text property directly returns the generated string.
    return response.text || "Не удалось сгенерировать ответ.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ошибка при генерации идеи урока.";
  }
};
