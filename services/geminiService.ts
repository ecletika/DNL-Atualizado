
import { GoogleGenAI } from "@google/genai";
import { ProjectType } from "../types";

/**
 * Generates a professional description for a project using Google Gemini API.
 * Always uses the 'gemini-3-flash-preview' model for text generation tasks.
 */
export const generateProjectDescription = async (title: string, type: ProjectType): Promise<string> => {
  // Initialize Gemini API client correctly using named parameters and process.env.API_KEY directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `Escreva uma descrição profissional, atraente e concisa (máximo 40 palavras) para um projeto de portfólio de uma empresa de reformas chamada DNL Remodelações. 
    Título do Projeto: ${title}
    Tipo: ${type}
    Idioma: Português de Portugal.`;

    // Correctly call generateContent with the model name and contents.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Extract text output using the .text property from GenerateContentResponse as per guidelines.
    // Note: Do not use response.text() as it is a property/getter.
    return response.text?.trim() || "Sem descrição gerada.";
  } catch (error: any) {
    console.error("Error generating description:", error);
    return `Erro ao gerar descrição: ${error.message || 'Verifique a configuração da API'}`;
  }
};
